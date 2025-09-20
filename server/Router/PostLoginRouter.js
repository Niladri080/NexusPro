import {Router} from 'express'
import { aiSuggestions, currentAffairs, fetchRoadmap, get_tip, RoadmapGen, SaveRoadmap } from '../Controllers/PostLoginController.js';
const router=Router()
router.get("/get-tip",get_tip);
router.get("/suggestions",aiSuggestions);
router.get("/current-affairs",currentAffairs)
router.post("/roadmap",RoadmapGen);
router.post("/save-roadmap",SaveRoadmap)
router.post("/fetch-roadmap",fetchRoadmap);
export default router;