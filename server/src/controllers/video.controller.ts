import type { Request, Response } from "express";
import { Video } from "../models/Video.js";
import { Types } from "mongoose"; // this is used for the Types.ObjecId for the mongooose Id e.g userId:Types.objectId; (This is used to specify the userID is a special id created by the mongoose)

import {
  extractYouTubeId,
  getYouTubeMetadata,
  getYouTubeTranscript,
  transcriptToText,
} from "../services/youtube.service.js";

import { analyzeVideo } from "../services/ai.service.js";

export const createVideo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { youtubeUrl } = req.body;

    if (!youtubeUrl) {
      res.status(400).json({
        success: false,
        message: "YouTube URL is required",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const youtubeId = extractYouTubeId(youtubeUrl);

    if (!youtubeId) {
      res.status(400).json({
        success: false,
        message: "Invalid YouTube URL",
      });
      return;
    }

    const metadata = await getYouTubeMetadata(youtubeId);

    const video = await Video.create({
      userId: req.user._id,

      youtubeUrl,

      youtubeId,

      title: metadata.title,

      description: metadata.description,

      thumbnailUrl: metadata.thumbnailUrl,

      status: "PENDING",

      chapters: [],

      notes: [],

      keyConcepts: [],

      flashcards: [],

      quiz: [],

      references: [],
    });

    res.status(201).json({
      success: true,
      message: "Video added successfully",

      video,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add video",
    });
  }
};

export const getVideos = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const videos = await Video.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch videos",
    });
  }
};

// export const processVideo = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     if (!req.user) {
//       res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//       return;
//     }

//     const { id } = req.params;

//     if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id)) {
//       res.status(400).json({
//         success: false,
//         message: "Invalid video ID",
//       });
//       return;
//     }

//     const video = await Video.findOne({
//       _id: id,
//       userId: req.user._id,
//     });

//     if (!video) {
//       res.status(404).json({
//         success: false,
//         message: "Video not found",
//       });
//       return;
//     }

//     if (video.status === "PROCESSING") {
//       res.status(409).json({
//         success: false,
//         message: "Video is already being processed",
//       });
//       return;
//     }

//     video.status = "PROCESSING";
//     video.processingError = "";

//     await video.save();

//     res.status(202).json({
//       success: true,
//       message: "Video processing started",
//     });

//     try {
//       const youtubeId = extractYouTubeId(video.youtubeUrl);

//       if (!youtubeId) {
//         throw new Error("Invalid YouTube URL");
//       }

//       const metadata = await getYouTubeMetadata(youtubeId);

//       const transcript = await getYouTubeTranscript(youtubeId);

//       if (!transcript.length) {
//         throw new Error("No transcript available for this video");
//       }

//       const transcriptText = transcriptToText(transcript);

//       const analysis = await analyzeVideo(transcriptText);
//       console.log("Analysis by the gemini : ", analysis);
//       video.title = metadata.title;

//       video.description = metadata.description;

//       video.thumbnailUrl = metadata.thumbnailUrl;

//       video.transcript = transcriptText;

//       video.summary = analysis.summary;

//       video.chapters = analysis.chapters;

//       video.keyConcepts = analysis.keyConcepts;

//       video.notes = analysis.notes;

//       video.flashcards = analysis.flashcards;

//       video.quiz = analysis.quiz;

//       video.status = "COMPLETED";

//       video.processingError = "";

//       await video.save();
//     } catch (error) {
//       console.error("Video processing failed:", error);

//       video.status = "FAILED";

//       video.processingError =
//         error instanceof Error ? error.message : "Unknown processing error";

//       await video.save();
//     }
//   } catch (error) {
//     console.error(error);

//     if (!res.headersSent) {
//       res.status(500).json({
//         success: false,
//         message: "Failed to start video processing",
//       });
//     }
//   }
// };

export const processVideo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // get the language
    const { language = "en" } = req.body;

    // 1. Authentication
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Please log in to process this video.",
      });
      return;
    }

    // 2. Validate MongoDB video ID
    const { id } = req.params;

    if (!id || typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid video ID.",
      });
      return;
    }

    // 3. Find user's video
    const video = await Video.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!video) {
      res.status(404).json({
        success: false,
        message: "Video not found.",
      });
      return;
    }

    // 4. Prevent duplicate processing
    if (video.status === "PROCESSING") {
      res.status(409).json({
        success: false,
        message: "This video is already being processed. Please wait.",
      });
      return;
    }

    // 5. Mark video as processing
    video.status = "PROCESSING";
    video.processingError = "";

    await video.save();

    // 6. Tell frontend processing has started
    res.status(202).json({
      success: true,
      message: "Video processing has started.",
    });

    // 7. Background processing
    try {
      const youtubeId = extractYouTubeId(video.youtubeUrl);

      if (!youtubeId) {
        throw new Error("The YouTube URL is invalid or unsupported.");
      }

      const metadata = await getYouTubeMetadata(youtubeId);

      const transcript = await getYouTubeTranscript(youtubeId);

      if (!transcript.length) {
        throw new Error(
          "No transcript is available for this video. Please try a video with captions.",
        );
      }

      const transcriptText = transcriptToText(transcript);

      const analysis = await analyzeVideo(transcriptText, language);

      console.log("Analysis by Gemini:", analysis);

      // Save successful result
      video.title = metadata.title;
      video.description = metadata.description;
      video.thumbnailUrl = metadata.thumbnailUrl;
      video.transcript = transcriptText;

      video.summary = analysis.summary;
      video.chapters = analysis.chapters;
      video.keyConcepts = analysis.keyConcepts;
      video.notes = analysis.notes;
      video.flashcards = analysis.flashcards;
      video.quiz = analysis.quiz;

      video.status = "COMPLETED";
      video.processingError = "";

      await video.save();
    } catch (error) {
      console.error("Video processing failed:", error);

      video.status = "FAILED";

      let processingError =
        "We couldn't process this video right now. Please try again.";

      // Gemini / API errors
      if (error && typeof error === "object" && "status" in error) {
        const status = error.status;

        if (status === 503) {
          processingError =
            "AI processing is temporarily busy. Please try again in a few moments.";
        } else if (status === 429) {
          processingError =
            "AI usage limit has been reached. Please try again later.";
        } else if (status === 401 || status === 403) {
          processingError =
            "The AI service is currently unavailable. Please try again later.";
        }
      }

      // Our own known errors
      else if (error instanceof Error) {
        processingError = error.message;
      }

      video.processingError = processingError;

      await video.save();
    }
  } catch (error) {
    console.error("Failed to start video processing:", error);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to start video processing. Please try again.",
      });
    }
  }
};
export const getVideoById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const video = await Video.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!video) {
      res.status(404).json({
        success: false,
        message: "Video not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch video",
    });
  }
};
