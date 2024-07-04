import axios from 'axios';
import React, { FormEvent, useState } from 'react';

interface TestCase {
    input: string;
    expected: string;
}

interface Question {
    id: number;
    title: string;
    content: string;
    language: string;
    testCases: TestCase[];
}


export function AddQuestion() {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [language, setLanguage] = useState<string>('JavaScript');
    const [testCases, setTestCases] = useState<TestCase[]>([{ input: '', expected: '' }]);

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', expected: '' }]);
    };

    const handleTestCaseChange = (index: number, field: keyof TestCase, value: string) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/questions', {
                title,
                content,
                language,
                testCases,
            });
            console.log('Question added:', response.data);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div>
                <label>Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
            </div>
            <div>
                <label>Language</label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Python">Python</option>
                    <option value="C++">C++</option>
                    <option value="Java">Java</option>
                </select>
            </div>
            <div>
                <label>Test Cases</label>
                {testCases.map((testCase, index) => (
                    <div key={index}>
                        <input
                            type="text"
                            placeholder="Input"
                            value={testCase.input}
                            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Expected Output"
                            value={testCase.expected}
                            onChange={(e) => handleTestCaseChange(index, 'expected', e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={handleAddTestCase}>
                    Add Test Case
                </button>
            </div>
            <button type="submit">Add Question</button>
        </form>
    );
}
