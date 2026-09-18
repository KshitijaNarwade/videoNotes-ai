import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-medium text-indigo-400">
          AI VIDEO KNOWLEDGE PLATFORM
        </p>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
          Turn videos into knowledge.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Transform educational videos into structured notes, chapters,
          flashcards, quizzes and AI-powered answers.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/register"
            className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-500"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Home;
