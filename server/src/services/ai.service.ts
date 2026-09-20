import { GoogleGenAI } from "@google/genai";
import { z, ZodType } from "zod";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
  apiKey,
});

const videoAnalysisSchema = z.object({
  summary: z.string(),

  chapters: z.array(
    z.object({
      title: z.string(),
      timestamp: z.number(),
      description: z.string(),
    }),
  ),

  keyConcepts: z.array(
    z.object({
      title: z.string(),
      explanation: z.string(),
    }),
  ),

  notes: z.array(
    z.object({
      title: z.string(),
      content: z.string(),
      timestamp: z.number().optional(),
    }),
  ),

  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    }),
  ),

  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctAnswer: z.string(),
      explanation: z.string(),
    }),
  ),
});

// const buildAnalysisPrompt = (transcript: string, language:string): string => {
//   return `
// You are an expert educational content analyst.

// Analyze the following YouTube video transcript.

// Generate all learning material in ${language}.

// Your task is to convert the transcript into
// structured learning material.

// IMPORTANT RULES:

// 1. Use ONLY information contained in the transcript.
// 2. Do not invent facts.
// 3. Preserve useful timestamps.
// 4. Make notes useful for studying.
// 5. Keep explanations clear and technically accurate.
// 6. Generate useful flashcards.
// 7. Generate exactly 10 quiz questions.
// 8. Each quiz question must have exactly 4 options.
// 9. correctAnswer must exactly match one of the options.
// 10. Chapters should contain meaningful sections.
// 11. Do not reproduce the entire transcript.

// TRANSCRIPT:

// ${transcript}
// `;
// };

const buildAnalysisPrompt = (transcript: string, language: string): string => {
  return `

You are an expert educational content analyst.

Analyze the following YouTube video transcript.

Generate all learning material in ${language}.

The following content must be generated in ${language}:
- Summary
- Chapter titles
- Chapter descriptions
- Notes
- Key concepts and explanations
- Flashcard questions and answers
- Quiz questions
- Quiz options
- Quiz explanations

IMPORTANT RULES:

1. Use ONLY information contained in the transcript.
2. Do not invent facts or information.
3. Preserve useful timestamps from the transcript.
4. Make notes useful for studying.
5. Keep explanations clear and technically accurate.
6. Generate useful flashcards based only on the transcript.
7. Generate exactly 10 quiz questions.
8. Each quiz question must have exactly 4 options.
9. correctAnswer must exactly match one of the options.
10. Chapters should contain meaningful sections from the video.
11. Do not reproduce the entire transcript.
12. Keep programming keywords, function names, variable names, library names, API names, commands, and code in their original form where appropriate.
13. Translate natural-language explanations, but do not unnecessarily translate technical terms or code.
14. Maintain the same JSON structure required by the response schema.

TRANSCRIPT:

${transcript}

`;
};

export const analyzeVideo = async (transcript: string, language: string) => {
  const prompt = buildAnalysisPrompt(transcript, language);

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",

    contents: prompt,

    config: {
      responseMimeType: "application/json", // you are telling the gemini to return the response as Json

      // responseSchema : you are telling the Gemini what structure the response should follow.
      responseSchema: {
        type: "object",

        properties: {
          summary: {
            type: "string",
          },

          chapters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                timestamp: {
                  type: "number",
                },
                description: {
                  type: "string",
                },
              },
              required: ["title", "timestamp", "description"],
            },
          },

          keyConcepts: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                explanation: {
                  type: "string",
                },
              },
              required: ["title", "explanation"],
            },
          },

          notes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                },
                content: {
                  type: "string",
                },
                timestamp: {
                  type: "number",
                },
              },
              required: ["title", "content"],
            },
          },

          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                },
                answer: {
                  type: "string",
                },
                difficulty: {
                  type: "string",
                  enum: ["EASY", "MEDIUM", "HARD"],
                },
              },
              required: ["question", "answer", "difficulty"],
            },
          },

          quiz: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: {
                  type: "string",
                },
                options: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
                correctAnswer: {
                  type: "string",
                },
                explanation: {
                  type: "string",
                },
              },
              required: ["question", "options", "correctAnswer", "explanation"],
            },
          },
        },

        required: [
          "summary",
          "chapters",
          "keyConcepts",
          "notes",
          "flashcards",
          "quiz",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed = JSON.parse(response.text);

  return videoAnalysisSchema.parse(parsed);
};
