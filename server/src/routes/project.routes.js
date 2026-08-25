import {Router} from 'express'
import { createProject } from '../controllers/project.controller.js'

import { validate } from '../middlewares/validate.middleware.js'
import { createProjectSchema } from '../validators/project.validator.js'
import { authenticate } from '../middlewares/auth.middleware.js';
const router = Router();

router.route("/create").post(
    authenticate,
    validate(createProjectSchema),
    createProject
    )

export default router;