// components/video/Overview.tsx

import { Sparkles } from "lucide-react";

type OverviewProps = {
  summary?: string;
  chapters?: {
    timestamp: number;
    title: string;
    description?: string;
  }[];
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function Overview({ summary, chapters }: OverviewProps) {
  return (
    <div className="space-y-10">
      {/* Summary */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
            <Sparkles size={18} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">AI Summary</h2>

            <p className="text-sm text-slate-500">
              A concise overview of the video
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:p-8">
          <p className="whitespace-pre-line text-[15px] leading-8 text-slate-300">
            {summary}
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Chapters</h2>

          <p className="mt-1 text-sm text-slate-500">
            Navigate through the important sections of the video.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          {chapters?.map((chapter, index) => (
            <div
              key={index}
              className="flex gap-5 border-b border-slate-800 p-5 last:border-b-0 hover:bg-slate-800/40"
            >
              <span className="h-fit shrink-0 rounded-lg bg-indigo-500/10 px-3 py-2 font-mono text-sm text-indigo-400">
                {formatTime(chapter.timestamp)}
              </span>

              <div>
                <h3 className="font-semibold text-slate-100">
                  {chapter.title}
                </h3>

                {chapter.description && (
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {chapter.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Overview;
