import {Router} from 'express'
import { aiSuggestions, currentAffairs, get_tip } from '../Controllers/PostLoginController.js';
const router=Router()
router.get("/get-tip",get_tip);
router.get("/suggestions",aiSuggestions);
router.get("/current-affairs",currentAffairs)
export default router;