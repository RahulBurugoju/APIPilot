import { Router } from "express";
import {
  createProject,
  deleteProject,
  getProject,
  getUserProjects,
  updateProject
} from "../controllers/project.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.route("/create").post(validate(createProjectSchema), createProject);

router.route("/").get(getUserProjects);

router.route("/:projectId")
.get(getProject)
.patch(validate(updateProjectSchema),updateProject)
.delete(deleteProject)
export default router;
