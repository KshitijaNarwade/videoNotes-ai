import { AlertTriangle, X } from "lucide-react";

import { useNotice } from "../context/useNotice";

function AiNotice() {
  const { isNoticeOpen, closeNotice } = useNotice();

  if (!isNoticeOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex animate-[fadeIn_0.2s_ease-out] items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-[scaleIn_0.2s_ease-out] rounded-2xl border border-white/[0.08] bg-[#0b1120] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.06] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <AlertTriangle size={22} className="text-amber-400" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-white">
                AI Processing Notice
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                Video analysis depends on an external AI provider, so occasional
                availability or usage-limit errors may occur.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeNotice}
            aria-label="Close notice"
            className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-sm leading-6 text-slate-300">
            If you encounter an AI processing error, please use the demo account
            below. It contains pre-tested videos where you can explore the
            generated{" "}
            <span className="text-indigo-300">
              Summary, Notes, Key Concepts, Flashcards, and Quiz.
            </span>
          </p>

          {/* Demo credentials */}
          <div className="mt-4 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Demo Account
            </p>

            <div className="mt-3 space-y-2">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                <span className="w-20 text-xs text-slate-500">Email</span>

                <span className="font-mono text-sm text-slate-200">
                  kshitija@gmail.com
                </span>
              </div>

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center">
                <span className="w-20 text-xs text-slate-500">Password</span>

                <span className="font-mono text-sm text-slate-200">123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/[0.06] p-4">
          <button
            type="button"
            onClick={closeNotice}
            className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiNotice;
