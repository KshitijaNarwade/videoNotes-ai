import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { isAxiosError } from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //here the FormEvent tells TypeScript that the 'e' parameter will be a React form event
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8"
      >
        <h1 className="text-3xl font-bold">Welcome back</h1>

        <p className="mt-2 text-slate-400">
          Login to your VideoNotes workspace.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-400">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}

export default Login;
