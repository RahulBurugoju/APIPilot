import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import collectionController from "../controllers/collection.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";
import { createCollectionSchema } from "../validators/collection.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

router.route("/create").post(validate(createProjectSchema), projectController.createProject);

router.route("/").get(projectController.getUserProjects);

router.route("/:projectId")
.get(projectController.getProject)
.patch(validate(updateProjectSchema),projectController.updateProject)
.delete(projectController.deleteProject)

router.route("/:projectId/collections")
.post(validate(createCollectionSchema),collectionController.createCollection)
.get(collectionController.getProjectCollections)

export default router;
