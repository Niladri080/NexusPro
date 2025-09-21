import { Router } from "express";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });
import {
  aiSuggestions,
  currentAffairs,
  deleteRoadmap,
  fetchRoadmap,
  get_tip,
  getUserRoadmap,
  markComplete,
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
export default router;
