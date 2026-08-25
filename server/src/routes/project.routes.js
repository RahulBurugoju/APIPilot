import {Router} from 'express'
import { createProject, getUserProjects } from '../controllers/project.controller.js'

import { validate } from '../middlewares/validate.middleware.js'
import { createProjectSchema } from '../validators/project.validator.js'
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authenticate);

router.route("/create").post(
    validate(createProjectSchema),
    createProject
    )

    router.route('/').get(getUserProjects)
export default router;