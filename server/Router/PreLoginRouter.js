import {Router} from 'express'
import { sendMailController } from '../Controllers/PreLoginController.js';
const router=Router()
router.post("/sendEmail",sendMailController);
export default router;