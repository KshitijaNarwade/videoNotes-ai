import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import type { Video } from "../types";

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function VideoWorkspace() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [video, setVideo] = useState<Video | null>(null);

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);

      setVideo(response.data.video);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  useEffect(() => {
    if (!video || video.status !== "PROCESSING") {
      return;
    }

    const interval = setInterval(() => {
      fetchVideo();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [video?.status]);

  const handleProcess = async () => {
    try {
      setProcessing(true);

      await api.post(`/videos/${id}/process`);

      await fetchVideo();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to process video");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading...
      </main>
    );
  }

  if (!video) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Video not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-slate-400 hover:text-white"
          >
            ← Back
          </button>

          <h1 className="font-semibold">VideoNotes AI</h1>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-3xl font-bold">{video.title}</h2>

        <p className="mt-2 text-slate-400">Status: {video.status}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allowFullScreen
              />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            {video.status === "PENDING" && (
              <div>
                <h3 className="text-xl font-semibold">Ready to analyze</h3>

                <p className="mt-2 text-slate-400">
                  Generate notes, chapters, flashcards and a quiz from this
                  video.
                </p>

                <button
                  onClick={handleProcess}
                  disabled={processing}
                  className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold disabled:opacity-50"
                >
                  {processing ? "Starting..." : "Analyze Video"}
                </button>
              </div>
            )}

            {video.status === "PROCESSING" && (
              <div>
                <h3 className="text-xl font-semibold">Analyzing video...</h3>

                <p className="mt-2 text-slate-400">
                  We're extracting the transcript and generating your learning
                  material.
                </p>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-500" />
                </div>
              </div>
            )}

            {video.status === "FAILED" && (
              <div>
                <h3 className="text-xl font-semibold text-red-400">
                  Processing failed
                </h3>

                <p className="mt-2 text-slate-400">
                  {video.processingError || "Something went wrong."}
                </p>

                <button
                  onClick={handleProcess}
                  className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 font-semibold"
                >
                  Try Again
                </button>
              </div>
            )}

            {video.status === "COMPLETED" && (
              <div>
                <h3 className="text-xl font-semibold">Analysis complete 🎉</h3>

                <p className="mt-2 text-slate-400">
                  Your video has been converted into structured learning
                  material.
                </p>
              </div>
            )}
          </section>
        </div>

        {video.status === "COMPLETED" && (
          <section className="mt-8 space-y-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">Summary</h3>

              <p className="mt-4 whitespace-pre-line leading-7 text-slate-300">
                {video.summary}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-xl font-semibold">Chapters</h3>

              <div className="mt-4 space-y-3">
                {video.chapters?.map((chapter, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-lg bg-slate-800 p-4"
                  >
                    <span className="font-mono text-indigo-400">
                      {formatTime(chapter.timestamp)}
                    </span>

                    <div>
                      <h4 className="font-medium">{chapter.title}</h4>

                      <p className="mt-1 text-sm text-slate-400">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default VideoWorkspace;
