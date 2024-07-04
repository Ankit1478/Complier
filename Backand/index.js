const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma.js');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.post('/questions', async (req, res) => {
  const { title, content, language, testCases } = req.body;

  try {
    const newQuestion = await prisma.question.create({
      data: {
        title,
        content,
        language,
        testCases: {
          create: testCases,
        },
      },
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'An error occurred while creating the question.' });
  }
});

app.get('/getquestions', async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      include: { testCases: true },
    });

    res.send(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send({ error: 'An error occurred while fetching the questions' });
  }
});

app.get('/getquestion/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const question = await prisma.question.findUnique({
      where: { id: Number(id) },
      include: { testCases: true },
    });

    if (!question) {
      return res.status(404).send({ error: 'Question not found' });
    }

    res.send(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).send({ error: 'An error occurred while fetching the question' });
  }
});

app.post('/compile', async (req, res) => {
  const { languageId, functionTemplate, testCases } = req.body;

  const wrapInMainClass = (template, langId) => {
    switch (langId) {
      case 52: // C
        return `
#include <stdio.h>
${template}
int main() {
  int a, b;
  while (scanf("%d %d", &a, &b) != EOF) {
    printf("%d\\n", f(a, b));
  }
  return 0;
}`;
      case 54: // C++
        return `
#include <iostream>
using namespace std;
${template}
int main() {
  int a, b;
  while (cin >> a >> b) {
    cout << f(a, b) << endl;
  }
  return 0;
}`;
      case 62: // Java
        return `
public class Main {
  public static void main(String[] args) {
    java.util.Scanner scanner = new java.util.Scanner(System.in);
    while (scanner.hasNext()) {
      int a = scanner.nextInt();
      int b = scanner.nextInt();
      System.out.println(f(a, b));
    }
  }
}
${template}`;
      case 71: // Python
        return `
${template}
if __name__ == "__main__":
  import sys
  input = sys.stdin.read
  data = input().split()
  for i in range(0, len(data), 2):
    a = int(data[i])
    b = int(data[i+1])
    print(f(a, b))`;
      default:
        return template;
    }
  };

  const code = wrapInMainClass(functionTemplate, languageId);

  const retryRequest = async (options, retries = 5, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await axios.request(options);
      } catch (error) {
        if (error.response && error.response.status === 429 && i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
        } else {
          throw error;
        }
      }
    }
  };

  try {
    const results = await Promise.all(testCases.map(async (testCase) => {
      const options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': '2c37770347msh679d0457d024074p1075f6jsnf4583f1ea8c4',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        },
        data: {
          language_id: languageId,
          source_code: Buffer.from(code).toString('base64'),
          stdin: Buffer.from(testCase.input).toString('base64'),
        },
      };

      const response = await retryRequest(options);
      const token = response.data.token;

      // Delay to ensure result is ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      const resultOptions = {
        method: 'GET',
        url: `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`,
        headers: {
          'x-rapidapi-key': '2c37770347msh679d0457d024074p1075f6jsnf4583f1ea8c4',
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        },
      };

      const resultResponse = await retryRequest(resultOptions);
      const result = resultResponse.data;

      return {
        input: testCase.input,
        expected: testCase.expected,
        output: result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf-8') : null,
        error: result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf-8') : null,
      };
    }));

    res.send(results);
  } catch (error) {
    console.error('Error compiling code:', error);
    res.status(500).send({ error: 'An error occurred while compiling the code.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
