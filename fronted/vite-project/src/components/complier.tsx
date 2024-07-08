import axios from 'axios';
import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { AppBar } from './Navbar';

interface Question {
    id: number;
    title: string;
    content: string;
    testCases: TestCase[];
}

interface TestCase {
    id: number;
    input: string;
    expected: string;
}

export function Compiler() {
    const [question, setQuestion] = useState<Question | null>(null);
    const [functionTemplate, setFunctionTemplate] = useState<string>('');
    const [languageId, setLanguageId] = useState<number>(62);
    const [output, setOutput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [allPassed, setAllPassed] = useState<boolean>(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`https://complier.onrender.com/getquestion/${id}`);
                setQuestion(response.data);
            } catch (error) {
                console.error('Error fetching question:', error);
            }
        };
        fetchQuestion();
    }, []);

    const handleCompile = async () => {
        if (!question) return;

        setLoading(true);
        setOutput('');
        setAllPassed(false);

        const options = {
            method: 'POST',
            url: 'https://complier.onrender.com/compile',
            data: {
                languageId,
                functionTemplate,
                testCases: question.testCases,
            },
        };

        try {
            const response = await axios.request(options);
            const results = response.data;

            const allPassed = results.every((result: any) => result.output && result.output.trim() === result.expected.trim());
            setAllPassed(allPassed);

            if (allPassed) {
                setOutput('<span class="text-green-600 font-bold">All test cases passed!</span>');
            } else {
                const failedCases = results.filter((result: any) => result.output && result.output.trim() !== result.expected.trim());
                const formattedOutput = failedCases.map((result: any, index: number) => (
                    `<div class="mt-2 p-2 rounded-lg bg-red-100 text-red-800">
                        <strong>Test case ${index + 1} failed.</strong><br>
                        <strong>Input:</strong> ${result.input}<br>
                        <strong>Expected:</strong> ${result.expected}<br>
                        <strong>Output:</strong> ${result.output || result.error}
                    </div>`
                )).join('');
                setOutput(`<div class="text-red-600 font-bold">Some test cases failed:</div>${formattedOutput}`);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error compiling code:', error);
            setLoading(false);
            setOutput('<div class="bg-red-100 text-red-800 p-4 rounded-lg">An error occurred while compiling the code.</div>');
        }
    };

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const langId = Number(e.target.value);
        setLanguageId(langId);

        switch (langId) {
            case 52: // C
                setFunctionTemplate(`int f(int a, int b) {\n  // Your code here\n  }`);
                break;
            case 54: // C++
                setFunctionTemplate(`int f(int a, int b) {\n  // Your code here\n  }`);
                break;
            case 62: // Java
                setFunctionTemplate(`static int f(int a, int b) {\n  // Your code here\n  }`);
                break;
            case 71: // Python
                setFunctionTemplate(`def f(a, b):\n  # Your code here\n  `);
                break;
            default:
                setFunctionTemplate('');
        }
    };

    return (
        <div>
            <AppBar></AppBar>
            <div className="w-full flex">
                <div className="flex w-full flex-col md:flex-row gap-4 p-2">
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                        <h1 className="text-4xl font-bold text-gray-900">{question?.title}</h1>

                        <p className="mt-8 text-1.5xl text-gray-600">
                            {question?.content}
                        </p>
                        {question?.testCases.map((testCase, index) => (
                            <div key={testCase.id} className="mt-4">
                                <h2 className="font-semibold text-2xl text-gray-900">Test case {index + 1}</h2>
                                <p className="mt-2 text-gray-600">Input</p>
                                <div className="bg-[#1f2937] text-white p-6 rounded-lg mt-1">{testCase.input}</div>
                                <p className="mt-2 text-gray-600">Expected Output</p>
                                <div className="bg-[#1f2937] text-white p-6 rounded-lg mt-1">{testCase.expected}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg">Submit</button>
                            <button className="bg-gray-400 text-white px-4 py-2 rounded-lg">Submissions</button>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="language" className="block text-gray-600">Language</label>
                            <select
                                id="language"
                                value={languageId}
                                onChange={handleLanguageChange}
                                className="bg-gray-200 text-gray-900 p-2 rounded-lg w-full mt-1"
                            >
                                <option value={52}>C</option>
                                <option value={54}>C++</option>
                                <option value={62}>Java</option>
                                <option value={71}>Python</option>
                            </select>
                        </div>
                        <div className="bg-gray-900 text-white p-4 rounded-lg h-88">
                            <textarea
                                rows={14}
                                className="w-full h-full bg-transparent border-none outline-none"
                                placeholder="Write your function here..."
                                value={functionTemplate}
                                onChange={(e) => setFunctionTemplate(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            onClick={handleCompile}
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
                        >
                            {loading ? 'Compiling...' : 'Compile and Run'}
                        </button>
                        <div className="mt-4">
                            <h2 className="font-semibold text-gray-900">Output</h2>
                            <div dangerouslySetInnerHTML={{ __html: output }} className="bg-gray-200 p-4 rounded-lg mt-1"></div>
                        </div>
                        {allPassed}
                    </div>
                </div>
            </div>
        </div>
    );
}
