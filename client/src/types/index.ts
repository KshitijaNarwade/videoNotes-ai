export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type VideoStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface Chapter {
  title: string;
  timestamp: number;
  description?: string;
}

export interface Note {
  title: string;
  content: string;
  timestamp?: number;
}

export interface KeyConcept {
  title: string;
  explanation: string;
}

export interface Flashcard {
  question: string;
  answer: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Video {
  _id: string;

  youtubeUrl: string;

  youtubeId: string;

  title: string;

  description?: string;

  thumbnailUrl?: string;

  duration?: number;

  status: VideoStatus;

  transcript?: string;

  summary?: string;

  chapters: Chapter[];

  notes: Note[];

  keyConcepts: KeyConcept[];

  flashcards: Flashcard[];

  quiz: QuizQuestion[];

  processingError?: string;

  createdAt: string;

  updatedAt: string;
}
