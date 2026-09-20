// components/video/KeyConcepts.tsx

import { Lightbulb } from "lucide-react";

type KeyConceptsProps = {
  concepts?: {
    title: string;
    explanation: string;
  }[];
};

function KeyConcepts({ concepts }: KeyConceptsProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Key Concepts</h2>

        <p className="mt-2 text-sm text-slate-500">
          Core ideas worth remembering from this video.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {concepts?.map((concept, index) => (
          <article
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Lightbulb size={19} />
            </div>

            <h3 className="font-semibold text-white">{concept.title}</h3>

            <p className="mt-3 leading-7 text-slate-400">
              {concept.explanation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default KeyConcepts;
