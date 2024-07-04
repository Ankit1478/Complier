export function AppBar() {
    return <div>
        <header className="bg-[#18181b] text-primary-foreground p-4 flex justify-between items-center">
            <div className="text-lg text-white font-bold">Let's Code</div>
            <nav className="flex space-x-4">
                <a href="#" className="text-white hover:underline">Contests</a>
                <a href="#" className="text-white hover:underline">Problems</a>
                <a href="#" className="text-white hover:underline">Standings</a>
            </nav>
            <button className="bg-secondary text-white p-2 rounded">Sign in</button>
        </header>
    </div>
}