import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-6 text-center">
        <h1 className="text-6xl font-semibold drop-shadow-md">🔐 Auth</h1>
        <p className="text-lg">A simple authentication service</p>
        <Link to="/login">Login</Link>
      </div>
    </main>
  );
}
