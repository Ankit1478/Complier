import axios from 'axios';
import React, { useState } from 'react';

export function Compiler() {
    const [code, setCode] = useState<string>('');
    const [languageId, setLanguageId] = useState<number>(52);
    const [stdin, setStdin] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleCompile = async () => {
        setLoading(true);
        setOutput('');

        const options = {
            method: 'POST',
            url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*',
            headers: {
                'Content-Type': 'application/json',
                'x-rapidapi-key': 'ce4ea634bfmsh36c5a38533faaecp1c6336jsn9396a7944d85',
                'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            },
            data: {
                language_id: languageId,
                source_code: btoa(code),
                stdin: btoa(stdin),
            },
        };

        try {
            const response = await axios.request(options);
            const token = response.data.token;

            setTimeout(async () => {
                const resultOptions = {
                    method: 'GET',
                    url: `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`,
                    headers: {
                        'x-rapidapi-key': 'ce4ea634bfmsh36c5a38533faaecp1c6336jsn9396a7944d85',
                        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    },
                };

                const resultResponse = await axios.request(resultOptions);
                const result = resultResponse.data;

                if (result.stdout) {
                    setOutput(atob(result.stdout));
                } else if (result.stderr) {
                    setOutput(atob(result.stderr));
                } else if (result.compile_output) {
                    setOutput(atob(result.compile_output));
                }
                setLoading(false);
            }, 2000);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setOutput('An error occurred while compiling the code.');
        }
    };

    return (
        <div className="h-screen flex">
            <div className="flex w-full flex-col md:flex-row gap-4 p-4">
                <div className="flex-1 bg-card p-6 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold text-foreground ">Two sum</h1>

                    <p className="mt-8 text-2xl text-muted-foreground">
                        Find the sum of two given elements. Both the numbers will always be 0 or positive.
                    </p>
                    <div className="mt-4">
                        <h2 className="font-semibold text-2xl text-black">Test case 1</h2>
                        <p className="mt-2 text-muted-foreground">Input</p>
                        <div className="bg-secondary text-white bg-[#1f2a38] p-6 rounded-lg mt-1">1, 2</div>
                        <p className="mt-2 text-muted-foreground">Output</p>
                        <div className="bg-secondary text-white bg-[#1f2a38] p-6 rounded-lg mt-1">3</div>
                    </div>

                    <div className="mt-4">
                        <h2 className="font-semibold text-foreground">Test case 2</h2>
                        <p className="mt-2 text-muted-foreground">Input</p>
                        <div className="bg-secondary text-white bg-[#1f2a38] p-6 rounded-lg mt-1">3, 5</div>
                        <p className="mt-2 text-muted-foreground">Output</p>
                        <div className="bg-secondary text-white bg-[#1f2a38] p-6 rounded-lg mt-1">8</div>
                    </div>
                </div>

                <div className="flex-1 bg-card p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">Submit</button>
                        <button className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">Submissions</button>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="language" className="block   text-muted-foreground">Language</label>
                        <select
                            id="language"
                            value={languageId}
                            onChange={(e) => setLanguageId(Number(e.target.value))}
                            className="bg-input text-foreground p-2  rounded-lg w-full mt-1"
                        >
                            <option value={52}>C</option>
                            <option value={54}>C++</option>
                            <option value={62}>Java</option>
                            <option value={71}>Python</option>
                        </select>
                    </div>
                    <div className="bg-black text-white p-4 rounded-lg h-88">
                        <textarea
                            rows={14}

                            className="w-full h-full bg-transparent border-none outline-none"
                            placeholder="Write your code here..."
                            onChange={(e) => setCode(e.target.value)}
                        ></textarea>
                    </div>
                    <button
                        onClick={handleCompile}
                        disabled={loading}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg mt-4"
                    >
                        {loading ? 'Compiling...' : 'Compile and Run'}
                    </button>
                    <div className="mt-4">
                        <h2 className="font-semibold text-foreground">Output</h2>
                        <pre className="bg-secondary text-secondary-foreground p-4 rounded-lg mt-1">{output}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}
