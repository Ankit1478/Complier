import { Link } from "react-router-dom";
import { AppBar } from "./Navbar"

export default function Landing() {
    return (
        <div>
            <AppBar></AppBar>
            <div className="min-h-screen bg-background text-foreground p-8">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2">
                            <h1 className="text-4xl font-bold mb-4">Welcome to Let's Code </h1>
                            <p className="text-lg text-muted-foreground mb-6">Let's Code is a platform for holding programming contests. Participate in challenges, solve problems, and climb the leaderboard.</p>
                            <div className="flex space-x-4">
                                <button className="bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/80">View Contests</button>
                                <Link to={"/allquestion"}>
                                    <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Solve</button>
</Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 mt-8 md:mt-0">
                            <img className="rounded-lg" src="https://ideogram.ai/assets/image/balanced/response/OZ93FYuyRpmpgNxX0fRMSw" alt="Programming contest event" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
