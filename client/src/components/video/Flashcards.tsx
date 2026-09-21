import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type Flashcard = {
  question: string;
  answer: string;
  difficulty?: string;
};

type FlashcardsProps = {
  flashcards?: Flashcard[];
};

function Flashcards({ flashcards = [] }: FlashcardsProps) {
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // --------------------------------------------------
  // NO FLASHCARDS
  // --------------------------------------------------

  if (!flashcards.length) {
    return (
      <div className="py-10 text-center text-slate-500">
        No flashcards available.
      </div>
    );
  }

  const currentFlashcard = flashcards[flashcardIndex];

  // --------------------------------------------------
  // NEXT
  // --------------------------------------------------

  const handleNext = () => {
    setFlashcardIndex((prev) =>
      prev === flashcards.length - 1 ? 0 : prev + 1,
    );

    setShowAnswer(false);
  };

  // --------------------------------------------------
  // PREVIOUS
  // --------------------------------------------------

  const handlePrevious = () => {
    setFlashcardIndex((prev) =>
      prev === 0 ? flashcards.length - 1 : prev - 1,
    );

    setShowAnswer(false);
  };

  // --------------------------------------------------
  // RESET CURRENT CARD
  // --------------------------------------------------

  const handleReset = () => {
    setShowAnswer(false);
  };

  return (
    <section className="mx-auto max-w-3xl">
      {/* ================================================
          HEADER
      ================================================= */}

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Flashcards</h2>

        <p className="mt-2 text-sm text-slate-500">
          Test your recall before revealing the answer.
        </p>
      </div>

      {/* ================================================
          CARD INFO
      ================================================= */}

      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Card {flashcardIndex + 1} of {flashcards.length}
        </span>

        {currentFlashcard.difficulty && (
          <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300">
            {currentFlashcard.difficulty}
          </span>
        )}
      </div>

      {/* ================================================
          FLASHCARD
      ================================================= */}

      <div className="flex min-h-[360px] flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/70 p-7 shadow-2xl shadow-black/20 md:p-10">
        {/* QUESTION */}

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">
            Question
          </p>

          <h3 className="mt-5 text-xl font-semibold leading-8 text-white md:text-2xl">
            {currentFlashcard.question}
          </h3>
        </div>

        {/* ANSWER / SHOW ANSWER */}

        {showAnswer ? (
          <div className="mt-4 border-t border-slate-800 pt-7">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Answer
              </p>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-300 cursor-pointer"
              >
                <RotateCcw size={13} />
                Hide
              </button>
            </div>

            <p className="mt-4 leading-7 text-slate-300">
              {currentFlashcard.answer}
            </p>
          </div>
        ) : (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAnswer(true)}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 cursor-pointer"
            >
              Show Answer
            </button>
          </div>
        )}
      </div>

      {/* ================================================
          NAVIGATION
      ================================================= */}

      <div className="mt-6 flex items-center justify-between">
        {/* PREVIOUS */}

        <button
          onClick={handlePrevious}
          className="flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900"
        >
          <ChevronLeft size={17} />
          Previous
        </button>

        {/* DOT INDICATORS */}

        <div className="flex items-center gap-1.5">
          {flashcards.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                flashcardIndex === index
                  ? "w-6 bg-indigo-500"
                  : "w-1.5 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* NEXT */}

        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-900"
        >
          Next
          <ChevronRight size={17} />
        </button>
      </div>
    </section>
  );
}

export default Flashcards;
