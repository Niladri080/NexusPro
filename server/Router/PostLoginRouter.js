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
  addComment,
  aiSuggestions,
  CreatePost,
  currentAffairs,
  DailyQuestion,
  DashResource,
  deletePost,
  deleteRoadmap,
  fetchJobs,
  fetchMyLearning,
  fetchPost,
  fetchQuestion,
  fetchResources,
  fetchResume,
  fetchRoadmap,
  FetchStats,
  fetchSteps,
  findJobs,
  get_tip,
  getPostDetails,
  getUserRoadmap,
  markComplete,
  ResubmitResume,
  RoadmapGen,
  SaveRoadmap,
  SubmitDaily,
  submitWrong,
  toggleLike,
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
router.post("/fetch-resume",fetchResume);
router.post("/resubmit-resume",ResubmitResume);
router.post("/fetch-data",fetchMyLearning);
router.post("/fetch-resources",fetchResources);
router.post("/fetch-steps",fetchSteps);
router.post("/dash-resource",DashResource);
router.post("/create-post",CreatePost)
router.get("/fetch-posts",fetchPost)
router.post("/like-post/:postId", toggleLike);
router.post("/add-comment/:postId", addComment);
router.get("/post-details/:postId", getPostDetails);
router.delete('/delete-post/:postId', deletePost); 
router.post("/get-jobs",findJobs)
router.post("/fetch-jobs",fetchJobs)
router.get("/daily-question",fetchQuestion)
router.post("/fetch-daily",DailyQuestion)
router.post("/submit-right",SubmitDaily)
router.post("/submit-wrong",submitWrong)
router.post("/fetch-stats",FetchStats);
export default router;
