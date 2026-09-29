import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  FileText,
  Play,
  Sparkles,
  Video as VideoIcon,
  X,
} from "lucide-react";

import api from "../services/api";
import type { Video } from "../types";
function Dashboard() {
  const navigate = useNavigate();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  // const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get("/videos");
        setVideos(response.data.videos || []);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };
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
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.message || "Failed to add video");
      } else {
        alert("Failed to add video");
      }
    } finally {
      setLoading(false);
    }
  };

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };

  const completedVideos = videos.filter(
    (video) => video.status === "COMPLETED",
  ).length;

  const processingVideos = videos.filter(
    (video) => video.status === "PROCESSING" || video.status === "PENDING",
  ).length;

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      {/* ================= CONTENT ================= */}

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {/* ================= HERO ================= */}

        <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-indigo-500/[0.12] via-slate-900/80 to-purple-500/[0.06] p-7 sm:p-10">
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium text-indigo-300">
              <Sparkles size={13} />
              AI-powered learning workspace
            </div>

            <h1 className=" text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Turn videos into
              <span className="pb-2 block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                structured knowledge.
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Paste a YouTube video and let VideoNotes AI transform it into
              summaries, chapters, notes, key concepts, flashcards, and quizzes.
            </p>

            {/* Add video form */}
            <form
              onSubmit={handleAddVideo}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Play
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <div className="animate-[pulse_2s_ease-in-out_infinite] rounded-xl">
                  <input
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="Paste a YouTube URL..."
                    className=" h-13 w-full rounded-xl border border-indigo-500/50 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/10 "
                  />
                </div>
                {youtubeUrl && (
                  <button
                    type="button"
                    onClick={() => setYoutubeUrl("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-13 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <Sparkles size={17} />

                {loading ? "Adding..." : "Add Video"}

                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="mt-3 text-xs text-red-500 ">
              Supports YouTube videos with accessible transcripts.
            </p>
          </div>
        </div>

        {/* ================= STATS ================= */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Total videos
                </p>

                <p className="mt-2 text-2xl font-bold">{videos.length}</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <VideoIcon size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-2xl font-bold">{completedVideos}</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <BookOpen size={19} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-slate-900/40 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Processing
                </p>

                <p className="mt-2 text-2xl font-bold">{processingVideos}</p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Clock3 size={19} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= LIBRARY ================= */}
        {/* ================= RECENT VIDEOS ================= */}

        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent videos</h2>

              <p className="mt-1 text-sm text-slate-500">
                Continue exploring your recently analyzed videos.
              </p>
            </div>

            {videos.length > 0 && (
              <Link
                to="/videos"
                className="
          flex items-center gap-1.5
          text-sm font-medium
          text-indigo-400
          transition
          hover:text-indigo-300
        "
              >
                View all
                <ArrowRight size={15} />
              </Link>
            )}
          </div>

          {videos.length > 0 ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.slice(0, 3).map((video) => (
                <Link
                  key={video._id}
                  to={`/videos/${video._id}`}
                  className="
            group
            overflow-hidden
            rounded-2xl
            border border-white/[0.06]
            bg-slate-900/50
            transition duration-300
            hover:-translate-y-1
            hover:border-indigo-500/30
            hover:bg-slate-900
          "
                >
                  {/* Thumbnail */}

                  <div
                    className="
            relative
            aspect-video
            overflow-hidden
            bg-slate-800
          "
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="
                h-full
                w-full
                object-cover
                transition
                duration-500
                group-hover:scale-105
              "
                    />

                    {/* Gradient */}

                    <div
                      className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/70
              via-transparent
              to-transparent
            "
                    />

                    {/* Status */}

                    <div className="absolute right-3 top-3">
                      <StatusBadge status={video.status} />
                    </div>

                    {/* Play */}

                    <div
                      className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              opacity-0
              transition
              group-hover:opacity-100
            "
                    >
                      <div
                        className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-indigo-600
                shadow-xl
              "
                      >
                        <Play size={17} fill="currentColor" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}

                  <div className="p-4">
                    <h3
                      className="
              line-clamp-2
              text-sm
              font-semibold
              leading-5
              text-white
              transition
              group-hover:text-indigo-300
            "
                    >
                      {video.title}
                    </h3>

                    <div
                      className="
              mt-4
              flex
              items-center
              justify-between
              text-xs
              text-slate-600
            "
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText size={13} />
                        AI Notes
                      </span>

                      <span
                        className="
                flex
                items-center
                gap-1
                text-indigo-400
                opacity-0
                transition
                group-hover:opacity-100
              "
                      >
                        Open
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="
      mt-6
      rounded-2xl
      border
      border-dashed
      border-white/[0.08]
      bg-slate-900/20
      p-10
      text-center
    "
            >
              <div
                className="
        mx-auto
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-xl
        bg-indigo-500/10
        text-indigo-400
      "
              >
                <VideoIcon size={21} />
              </div>

              <h3 className="mt-4 text-sm font-semibold">No videos yet</h3>

              <p
                className="
        mx-auto
        mt-2
        max-w-md
        text-xs
        leading-5
        text-slate-500
      "
              >
                Paste a YouTube URL above to create your first AI-powered video
                analysis.
              </p>
            </div>
          )}
        </section>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-8">
        <p className="text-center text-xs text-slate-600">
          VideoNotes AI · Turn learning into structured knowledge
        </p>
      </footer>
    </main>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",

    PROCESSING: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",

    PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/20",

    FAILED: "bg-red-500/15 text-red-400 border-red-500/20",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
        styles[status] || "bg-slate-500/15 text-slate-400 border-slate-500/20"
      }`}
    >
      {status}
    </span>
  );
}

export default Dashboard;
