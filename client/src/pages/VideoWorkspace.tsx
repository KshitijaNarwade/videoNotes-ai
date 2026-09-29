import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  FileText,
  Layers3,
  Lightbulb,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import type { Video } from "../types/index";
import LanguageSelect from "../components/LanguageSelect";
import type { LanguageCode } from "../utils/languages";

import Overview from "../components/video/Overview";
import Notes from "../components/video/Notes";
import KeyConcepts from "../components/video/KeyConcepts";
import Flashcards from "../components/video/Flashcards";
import Quiz from "../components/video/Quiz";
import { useNotice } from "../context/useNotice";

type Tab = "overview" | "notes" | "concepts" | "flashcards" | "quiz";

const VideoWorkspace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openNotice } = useNotice();

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [language, setLanguage] = useState<LanguageCode>("en");

  // --------------------------------------------------
  // FETCH VIDEO
  // --------------------------------------------------
  useEffect(() => {
    openNotice();
  }, [error, openNotice]);
  const fetchVideo = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const response = await api.get(`/videos/${id}`);

      setVideo(response.data.video);
    } catch (error) {
      console.error("Failed to fetch video:", error);
      setVideo(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // --------------------------------------------------
  // INITIAL FETCH
  // --------------------------------------------------

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVideo();
  }, [fetchVideo]);

  // --------------------------------------------------
  // POLL WHILE PROCESSING
  // --------------------------------------------------

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
  }, [video, fetchVideo]);

  // --------------------------------------------------
  // PROCESS VIDEO
  // --------------------------------------------------

  const handleProcess = async () => {
    if (!id || processing) return;

    try {
      setProcessing(true);

      await api.post(`/videos/${id}/process`, {
        language,
      });

      await fetchVideo();
    } catch (error) {
      console.error("Failed to process video:", error);

      if (isAxiosError(error)) {
        console.error("Server error:", error.response?.data?.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  // --------
  const handleDelete = async () => {
    if (!id || deleting) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this video? This will also remove its generated study material.",
    );
    if (!confirmed) return;
    try {
      setDeleting(true);
      await api.delete(`/videos/${id}`);
      navigate("/videos");
    } catch (error) {
      console.error("Failed to delete video:", error);
      if (isAxiosError(error)) {
        console.error("Server error:", error.response?.data?.message);
      }
      window.alert("Failed to delete the video. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // --------------------------------------------------
  // TABS
  // --------------------------------------------------

  const tabs: {
    id: Tab;
    label: string;
    icon: typeof BookOpen;
  }[] = [
    {
      id: "overview",
      label: "Overview",
      icon: BookOpen,
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
    },
    {
      id: "concepts",
      label: "Key Concepts",
      icon: Lightbulb,
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: Layers3,
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: Brain,
    },
  ];

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
            <Loader2 size={28} className="animate-spin text-indigo-400" />
          </div>

          <p className="text-sm text-slate-400">Loading your workspace...</p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // VIDEO NOT FOUND
  // --------------------------------------------------

  if (!video) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <FileText size={22} />
          </div>

          <h2 className="mt-5 text-xl font-semibold">Video not found</h2>

          <p className="mt-2 text-sm text-slate-500">
            The video you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-indigo-400 transition hover:text-indigo-300 cursor-pointer"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // STATUS
  // --------------------------------------------------

  const isPending = video.status === "PENDING";
  const isProcessing = video.status === "PROCESSING";
  const isFailed = video.status === "FAILED";
  const isCompleted = video.status === "COMPLETED";

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* ==================================================
          BACK TO DASHBOARD
      ================================================== */}

      <div className="mx-auto max-w-7xl px-5 pt-5 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {/* =================================================
            TITLE
        ================================================= */}

        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                isCompleted
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                  : isFailed
                    ? "border-red-500/20 bg-red-500/10 text-red-400"
                    : "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
              }`}
            >
              {video.status}
            </span>

            <span className="text-sm text-slate-500">
              AI Learning Workspace
            </span>
          </div>

          <div className="flex items-start justify-between gap-5">
            <h1 className="max-w-4xl text-2xl font-bold leading-tight tracking-tight text-white md:text-3xl">
              {video.title}
            </h1>

            <button
              onClick={handleDelete}
              disabled={deleting}
              title="Delete video"
              className="flex shrink-0 items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={16} />

              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        {/* =================================================
            VIDEO + STATUS
        ================================================= */}
        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
          {/* =================================================
              YOUTUBE PLAYER
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">
            <div className="aspect-video bg-black">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>

          {/* =================================================
              ANALYSIS PANEL
          ================================================= */}

          <section className="flex min-h-[280px] flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div>
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Sparkles size={21} />
              </div>

              {/* PENDING */}

              {isPending && (
                <>
                  <h2 className="text-xl font-semibold text-white">
                    Ready to analyze
                  </h2>

                  <p className="mt-2 leading-6 text-slate-400">
                    Turn this video into structured notes, chapters, flashcards,
                    concepts and a quiz.
                  </p>
                </>
              )}

              {/* PROCESSING */}

              {isProcessing && (
                <>
                  <h2 className="text-xl font-semibold text-white">
                    Creating your study material
                  </h2>

                  <p className="mt-2 leading-6 text-slate-400">
                    We're analyzing the transcript and organizing the important
                    information.
                  </p>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-indigo-500" />
                  </div>
                </>
              )}

              {/* FAILED */}

              {isFailed && (
                <>
                  <h2 className="text-xl font-semibold text-red-400">
                    Analysis failed
                  </h2>

                  <p className="mt-2 leading-6 text-slate-400">
                    {video.processingError || "Something went wrong."}
                  </p>
                </>
              )}

              {/* COMPLETED */}

              {isCompleted && (
                <>
                  <h2 className="text-xl font-semibold text-white">
                    Your study material is ready
                  </h2>

                  <p className="mt-2 leading-6 text-slate-400">
                    Explore the summary, notes, concepts, flashcards and quiz
                    generated from this video.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xl font-semibold text-white">
                        {video.chapters?.length || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">Chapters</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xl font-semibold text-white">
                        {video.flashcards?.length || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">Flashcards</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xl font-semibold text-white">
                        {video.keyConcepts?.length || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">Concepts</p>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                      <p className="text-xl font-semibold text-white">
                        {video.quiz?.length || 0}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">Quiz</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* =================================================
                PENDING ACTION
            ================================================= */}

            {isPending && (
              <div className="mt-6 space-y-4">
                <LanguageSelect value={language} onChange={setLanguage} />

                <button
                  onClick={handleProcess}
                  disabled={processing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                >
                  <Play size={17} />

                  {processing ? "Starting..." : "Analyze Video"}
                </button>
              </div>
            )}

            {/* =================================================
                FAILED ACTION
            ================================================= */}

            {isFailed && (
              <div className="mt-6">
                <LanguageSelect value={language} onChange={setLanguage} />

                <button
                  onClick={handleProcess}
                  disabled={processing}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw size={17} />

                  {processing ? "Starting..." : "Try Again"}
                </button>
              </div>
            )}
          </section>
        </div>
        {/* ==================================================
            LEARNING WORKSPACE
        ================================================== */}
        {isCompleted && (
          <section className="mt-10">
            {/* =================================================
                TABS
            ================================================= */}

            <div className="border-b border-slate-800">
              <div className="flex items-center gap-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition cursor-pointer ${
                        activeTab === tab.id
                          ? "border-indigo-500 text-white"
                          : "border-transparent text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Icon size={17} />

                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                TAB CONTENT
            ================================================= */}

            <div className="py-8">
              {/* OVERVIEW */}

              {activeTab === "overview" && (
                <Overview summary={video.summary} chapters={video.chapters} />
              )}

              {/* NOTES */}

              {activeTab === "notes" && <Notes notes={video.notes} />}

              {/* KEY CONCEPTS */}

              {activeTab === "concepts" && (
                <KeyConcepts concepts={video.keyConcepts} />
              )}

              {/* FLASHCARDS */}

              {activeTab === "flashcards" && (
                <Flashcards flashcards={video.flashcards} />
              )}

              {/* QUIZ */}

              {activeTab === "quiz" && <Quiz quiz={video.quiz} />}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default VideoWorkspace;
