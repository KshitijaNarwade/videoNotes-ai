import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import type { Video } from "../types";
import { Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchVideos = async () => {
    try {
      const response = await api.get("/videos");

      setVideos(response.data.videos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddVideo = async (e: FormEvent) => {
    e.preventDefault();

    if (!youtubeUrl.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/videos", {
        youtubeUrl,
      });

      setYoutubeUrl("");

      navigate(`/videos/${response.data.video._id}`);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold">VideoNotes AI</h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user.name}</span>

            <button onClick={logout} className="text-sm text-red-400">
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold">Your Video Library</h2>

        <p className="mt-2 text-slate-400">
          Turn videos into structured knowledge.
        </p>

        <form onSubmit={handleAddVideo} className="mt-8 flex gap-3">
          <input
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Paste a YouTube URL..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-indigo-500"
          />

          <button
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-6 font-semibold hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Analyze"}
          </button>
        </form>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/videos/${video._id}`}
              className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 transition hover:-translate-y-1 hover:border-indigo-500"
            >
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="aspect-video w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-semibold">{video.title}</h3>

                <p className="mt-2 text-sm text-slate-500">{video.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
