import { Router } from "express";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
import {
  aiSuggestions,
  currentAffairs,
  deleteRoadmap,
  fetchMyLearning,
  fetchResources,
  fetchResume,
  fetchRoadmap,
  fetchSteps,
  get_tip,
  getUserRoadmap,
  markComplete,
  ResubmitResume,
  RoadmapGen,
  SaveRoadmap,
  uploadResume,
} from "../Controllers/PostLoginController.js";
const router = Router();
router.get("/get-tip", get_tip);
router.get("/suggestions", aiSuggestions);
router.get("/current-affairs", currentAffairs);
router.post("/roadmap", RoadmapGen);
router.post("/save-roadmap", SaveRoadmap);
router.post("/fetch-roadmap", fetchRoadmap);
router.get("/get-roadmap", getUserRoadmap);
router.post("/delete-roadmap", deleteRoadmap);
router.post("/mark-as-complete", markComplete);
router.post("/analyze-resume", upload.single("resume"), uploadResume);
router.post("/fetch-resume",fetchResume)
router.post("/resubmit-resume",ResubmitResume)
router.post("/fetch-data",fetchMyLearning)
router.post("/fetch-resources",fetchResources);
router.post("/fetch-steps",fetchSteps)
export default router;
