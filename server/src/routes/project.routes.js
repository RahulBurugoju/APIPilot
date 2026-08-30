import { Router } from "express";
import projectController from "../controllers/project.controller.js";
import collectionRouter from "./collection.routes.js";
import environmentRouter from "./environment.routes.js";
import requestHistoryRouter from "./request-history.routes.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(authenticate);

// Project Collection Nested Routes
router.use("/:projectId/collections", collectionRouter);
// Project Environments Nested Routes
router.use("/:projectId/environments", environmentRouter);
// Project Request History Nested Routes
router.use("/:projectId/requests/:requestId/history", requestHistoryRouter);

// Project Routes
router
  .route("/create")
  .post(validate(createProjectSchema), projectController.createProject);

router.route("/").get(projectController.getUserProjects);

router
  .route("/:projectId")
  .get(projectController.getProject)
  .patch(validate(updateProjectSchema), projectController.updateProject)
  .delete(projectController.deleteProject);

export default router;
