import mongoose, { Document, Schema, Types } from "mongoose";

export interface IVideoReference {
  timestamp: number;
  text: string;
}

export interface IKeyConcept {
  title: string;
  explanation: string;
}

export interface IChapter {
  title: string;
  timestamp: number;
  description?: string;
}

export interface INote {
  title: string;
  content: string;
  timestamp?: number | undefined;
}

export interface IFlashcard {
  question: string;
  answer: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export type VideoStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface IChapter {
  title: string;
  timestamp: number;
  description?: string;
}

export interface INote {
  title: string;
  content: string;
  timestamp?: number;
}

export interface IFlashcard {
  question: string;
  answer: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface IQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface IVideo extends Document {
  userId: Types.ObjectId;

  youtubeUrl: string;
  youtubeId: string;

  title: string;
  description?: string;
  thumbnailUrl?: string;

  duration?: number;

  status: VideoStatus;

  transcript?: string;

  summary?: string;

  chapters: IChapter[];

  notes: INote[];

  flashcards: IFlashcard[];

  quiz: IQuizQuestion[];
  keyConcepts: IKeyConcept[];
  references: IVideoReference[];
  processingError?: string;

  createdAt: Date;
  updatedAt: Date;
}

const chapterSchema = new Schema<IChapter>(
  {
    title: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Number,
      required: true,
    },

    description: String,
  },
  { _id: false },
);

const noteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    timestamp: Number,
  },
  { _id: false },
);

const flashcardSchema = new Schema<IFlashcard>(
  {
    question: {
      type: String,
      required: true,
    },

    answer: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
    },
  },
  { _id: false },
);

const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    question: {
      type: String,
      required: true,
    },

    options: {
      type: [String],
      required: true,
    },

    correctAnswer: {
      type: String,
      required: true,
    },

    explanation: String,
  },
  { _id: false },
);

const keyConceptSchema = new Schema<IKeyConcept>(
  {
    title: {
      type: String,
      required: true,
    },

    explanation: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const referenceSchema = new Schema<IVideoReference>(
  {
    timestamp: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },
  },
  { _id: false },
);

const videoSchema = new Schema<IVideo>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    youtubeUrl: {
      type: String,
      required: true,
      trim: true,
    },

    youtubeId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    thumbnailUrl: String,

    duration: Number,

    status: {
      type: String,
      enum: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },

    transcript: String,

    summary: String,

    chapters: {
      type: [chapterSchema],
      default: [],
    },

    notes: {
      type: [noteSchema],
      default: [],
    },

    flashcards: {
      type: [flashcardSchema],
      default: [],
    },

    quiz: {
      type: [quizQuestionSchema],
      default: [],
    },

    keyConcepts: {
      type: [keyConceptSchema],
      default: [],
    },

    references: {
      type: [referenceSchema],
      default: [],
    },

    processingError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export const Video = mongoose.model<IVideo>("Video", videoSchema);
