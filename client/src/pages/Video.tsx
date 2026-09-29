import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Play,
  Search,
  Video as VideoIcon,
  X,
} from "lucide-react";

import api from "../services/api";
import type { Video } from "../types";

function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

  const filteredVideos = useMemo(() => {
    if (!search.trim()) return videos;

    return videos.filter((video) =>
      video.title?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [videos, search]);

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <section className="mx-auto max-w-7xl px-5 py-5 lg:px-8">
        {/* ================= HEADER ================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="
                mb-4
                inline-flex
                items-center
                gap-2
                text-xs
                text-slate-500
                transition
                hover:text-white
              "
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Your videos
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Browse and manage all your analyzed videos.
            </p>
          </div>

          {/* Search */}

          {videos.length > 0 && (
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-slate-600
                "
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search videos..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-white/[0.07]
                  bg-slate-900/50
                  pl-10
                  pr-10
                  text-sm
                  outline-none
                  placeholder:text-slate-600
                  transition
                  focus:border-indigo-500/50
                  focus:ring-4
                  focus:ring-indigo-500/[0.06]
                "
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-slate-600
                    hover:text-white
                  "
                >
                  <X size={15} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ================= DIVIDER ================= */}

        <div className="my-8 h-px bg-white/[0.05]" />

        {/* ================= RESULT INFO ================= */}

        {videos.length > 0 && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-300">
                {filteredVideos.length}
              </span>{" "}
              {filteredVideos.length === 1 ? "video" : "videos"}
            </p>
          </div>
        )}

        {/* ================= VIDEO GRID ================= */}

        {filteredVideos.length > 0 ? (
          <div
            className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
          >
            {filteredVideos.map((video) => (
              <Link
                key={video._id}
                to={`/videos/${video._id}`}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/[0.06]
                  bg-slate-900/50
                  transition
                  duration-300
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
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      bg-indigo-600
                      shadow-xl
                    "
                    >
                      <Play size={19} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Content */}

                <div className="p-5">
                  <h2
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
                  </h2>

                  <div
                    className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    border-t
                    border-white/[0.05]
                    pt-4
                  "
                  >
                    <span
                      className="
                      flex
                      items-center
                      gap-1.5
                      text-xs
                      text-slate-600
                    "
                    >
                      <FileText size={13} />
                      AI Notes
                    </span>

                    <span
                      className="
                      flex
                      items-center
                      gap-1
                      text-xs
                      font-medium
                      text-indigo-400
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
          /* ================= EMPTY STATE ================= */

          <div
            className="
            flex
            min-h-[350px]
            flex-col
            items-center
            justify-center
            rounded-2xl
            border
            border-dashed
            border-white/[0.08]
            bg-slate-900/20
            px-6
            text-center
          "
          >
            <div
              className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-indigo-500/10
              text-indigo-400
            "
            >
              <VideoIcon size={24} />
            </div>

            <h3 className="mt-5 text-base font-semibold">
              {search ? "No videos found" : "No videos yet"}
            </h3>

            <p
              className="
              mt-2
              max-w-md
              text-sm
              leading-6
              text-slate-500
            "
            >
              {search
                ? "Try searching with a different title."
                : "Go back to the dashboard and analyze your first YouTube video."}
            </p>

            {search ? (
              <button
                onClick={() => setSearch("")}
                className="
                  mt-5
                  text-sm
                  font-medium
                  text-indigo-400
                  hover:text-indigo-300
                "
              >
                Clear search
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-indigo-600
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  transition
                  hover:bg-indigo-500
                "
              >
                Go to dashboard
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        )}
      </section>
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
      className={`
        rounded-full
        border
        px-2.5
        py-1
        text-[10px]
        font-semibold
        uppercase
        tracking-wider
        backdrop-blur-md
        ${
          styles[status] || "bg-slate-500/15 text-slate-400 border-slate-500/20"
        }
      `}
    >
      {status}
    </span>
  );
}

export default Videos;
