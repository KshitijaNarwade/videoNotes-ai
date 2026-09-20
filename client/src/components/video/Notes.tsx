// components/video/Notes.tsx

type NotesProps = {
  notes?: {
    title: string;
    content: string;
    timestamp?: number;
  }[];
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
}

function Notes({ notes }: NotesProps) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Study Notes</h2>

        <p className="mt-2 text-sm text-slate-500">
          Important points extracted from the video.
        </p>
      </div>

      <div className="space-y-4">
        {notes?.map((note, index) => (
          <article
            key={index}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6"
          >
            <div className="flex items-start justify-between gap-5">
              <div className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-sm font-semibold text-indigo-400">
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold text-slate-100">{note.title}</h3>

                  <p className="mt-3 leading-7 text-slate-400">
                    {note.content}
                  </p>
                </div>
              </div>

              {note.timestamp !== undefined && (
                <span className="shrink-0 font-mono text-xs text-indigo-400">
                  {formatTime(note.timestamp)}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Notes;
