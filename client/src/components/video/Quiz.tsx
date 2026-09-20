import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  XCircle,
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};

type QuizProps = {
  quiz?: Question[];
};

function Quiz({ quiz = [] }: QuizProps) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // --------------------------------------------------
  // NO QUIZ
  // --------------------------------------------------

  if (!quiz.length) {
    return (
      <div className="py-10 text-center text-slate-500">No quiz available.</div>
    );
  }

  const currentQuestion = quiz[quizIndex];

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  // --------------------------------------------------
  // SELECT ANSWER
  // --------------------------------------------------

  const handleAnswer = (answer: string) => {
    // Prevent changing answer after selecting one
    if (selectedAnswer) return;

    setSelectedAnswer(answer);

    setQuizAnswers((prev) => ({
      ...prev,
      [quizIndex]: answer,
    }));
  };

  // --------------------------------------------------
  // NEXT QUESTION
  // --------------------------------------------------

  const handleNext = () => {
    // User must answer before continuing
    if (!selectedAnswer) return;

    // Last question
    if (quizIndex === quiz.length - 1) {
      setQuizFinished(true);
      return;
    }

    const nextIndex = quizIndex + 1;

    setQuizIndex(nextIndex);

    // Restore previously selected answer if user goes back
    setSelectedAnswer(quizAnswers[nextIndex] || null);
  };

  // --------------------------------------------------
  // PREVIOUS QUESTION
  // --------------------------------------------------

  const handlePrevious = () => {
    if (quizIndex === 0) return;

    const previousIndex = quizIndex - 1;

    setQuizIndex(previousIndex);

    setSelectedAnswer(quizAnswers[previousIndex] || null);
  };

  // --------------------------------------------------
  // RESTART QUIZ
  // --------------------------------------------------

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizAnswers({});
    setQuizFinished(false);
  };

  // --------------------------------------------------
  // CALCULATE SCORE
  // --------------------------------------------------

  const getScore = () => {
    return quiz.reduce((score, question, index) => {
      return quizAnswers[index] === question.correctAnswer ? score + 1 : score;
    }, 0);
  };

  const score = getScore();

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <section className="mx-auto max-w-3xl">
      {!quizFinished ? (
        <>
          {/* ============================================
              QUIZ HEADER
          ============================================ */}

          <div className="mb-7 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">
                Knowledge Quiz
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Choose the best answer for each question.
              </p>
            </div>

            <span className="text-sm text-slate-500">
              {quizIndex + 1} / {quiz.length}
            </span>
          </div>

          {/* ============================================
              PROGRESS BAR
          ============================================ */}

          <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{
                width: `${((quizIndex + 1) / quiz.length) * 100}%`,
              }}
            />
          </div>

          {/* ============================================
              QUESTION CARD
          ============================================ */}

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm md:p-8">
            <p className="text-sm font-medium text-indigo-400">
              Question {quizIndex + 1}
            </p>

            <h3 className="mt-3 text-xl font-semibold leading-8">
              {currentQuestion.question}
            </h3>

            {/* ==========================================
                OPTIONS
            =========================================== */}

            <div className="mt-7 space-y-3">
              {currentQuestion.options.map((option, index) => {
                const selected = selectedAnswer === option;

                const correct =
                  selectedAnswer && option === currentQuestion.correctAnswer;

                const incorrect =
                  selected && option !== currentQuestion.correctAnswer;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={Boolean(selectedAnswer)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      correct
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : incorrect
                          ? "border-red-500/50 bg-red-500/10"
                          : selected
                            ? "border-indigo-500 bg-indigo-500/10"
                            : "border-slate-700 bg-slate-950/40 hover:border-slate-600 hover:bg-slate-800/50"
                    }`}
                  >
                    {/* OPTION LETTER */}

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-xs font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>

                    {/* OPTION TEXT */}

                    <span className="flex-1 text-sm text-slate-300">
                      {option}
                    </span>

                    {/* CORRECT ICON */}

                    {correct && (
                      <CheckCircle2 size={19} className="text-emerald-400" />
                    )}

                    {/* INCORRECT ICON */}

                    {incorrect && (
                      <XCircle size={19} className="text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ==========================================
                ANSWER FEEDBACK
            =========================================== */}

            {selectedAnswer && (
              <div
                className={`mt-6 rounded-xl border p-5 ${
                  isCorrect
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <XCircle size={18} className="text-red-400" />
                  )}

                  <p
                    className={`font-semibold ${
                      isCorrect ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isCorrect ? "Correct answer" : "Not quite"}
                  </p>
                </div>

                {/* SHOW CORRECT ANSWER */}

                {!isCorrect && (
                  <p className="mt-3 text-sm text-slate-300">
                    Correct answer:{" "}
                    <span className="font-medium text-white">
                      {currentQuestion.correctAnswer}
                    </span>
                  </p>
                )}

                {/* EXPLANATION */}

                {currentQuestion.explanation && (
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ============================================
              NAVIGATION
          ============================================= */}

          <div className="mt-6 flex justify-between">
            {/* PREVIOUS */}

            <button
              onClick={handlePrevious}
              disabled={quizIndex === 0}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={17} />
              Previous
            </button>

            {/* NEXT / FINISH */}

            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {quizIndex === quiz.length - 1 ? "Finish Quiz" : "Next Question"}

              <ChevronRight size={17} />
            </button>
          </div>
        </>
      ) : (
        /* ================================================
           QUIZ RESULT
        ================================================= */

        <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-14 text-center text-white shadow-sm">
          {/* ICON */}

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Brain size={27} />
          </div>

          {/* TITLE */}

          <p className="mt-6 text-sm font-medium text-indigo-400">
            Quiz complete
          </p>

          {/* SCORE */}

          <h2 className="mt-2 text-3xl font-bold">
            {score} / {quiz.length}
          </h2>

          <p className="mt-3 text-slate-400">
            You answered {score} out of {quiz.length} questions correctly.
          </p>

          {/* ACTIONS */}

          <div className="mt-8 flex justify-center">
            <button
              onClick={restartQuiz}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              <RotateCcw size={17} />
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Quiz;
