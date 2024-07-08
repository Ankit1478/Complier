import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Question {
    id: number;
    title: string;
    content: string;
}

export function QuestionList() {
    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('https://complier.onrender.com/getquestions');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, []);

    return (
        <div className="bg-card text-card-foreground min-h-screen p-5">
            <header className="bg-[#18181b] text-primary-foreground p-4 flex justify-between items-center">
                <div className="text-lg text-white font-bold">Let's Code</div>
                <nav className="flex space-x-4">
                    <a href="#" className="text-white hover:underline">Contests</a>
                    <a href="#" className="text-white hover:underline">Problems</a>
                    <a href="#" className="text-white hover:underline">Standings</a>
                </nav>
                <button className="bg-secondary text-white p-2 rounded">Sign in</button>
            </header>
            <main className="mt-8">
                <h1 className="text-3xl font-bold">Popular Problems</h1>
                <p className="text-muted-foreground mt-2">Check out the most popular programming problems on Let's Code.</p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {questions.map((question) => (
                        <div key={question.id} className="border border-border p-4 rounded-lg">
                            <h2 className="text-xl font-semibold">{question.title}</h2>
                            <p className="text-muted-foreground">{question.content}</p>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <p className="font-semibold">Difficulty</p>
                                    <p className="text-muted-foreground p-1">EASY</p>
                                </div>
                            </div>
                            <Link to={`/question/${question.id}`}>
                                <button
                                    type="button"
                                    className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                >
                                    Solve
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
