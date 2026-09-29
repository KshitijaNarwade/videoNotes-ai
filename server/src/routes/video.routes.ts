import { Router } from "express";
import {
  createVideo,
  getVideos,
  getVideoById,
  processVideo,
  deleteVideo,
} from "../controllers/video.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/", createVideo);

router.get("/", getVideos);

router.get("/:id", getVideoById);

router.delete("/:id", deleteVideo);

router.post("/:id/process", processVideo);

export default router;
