import { Router } from "express";
import environmentController from "../controllers/environment.controller.js";
const router = Router({ mergeParams: true });

// POST   /projects/:projectId/environments
// GET    /projects/:projectId/environments
router
  .route("/")
  .post(environmentController.createEnvironment)
  .get(environmentController.getProjectEnvironments);

// GET    /projects/:projectId/environments/:environmentId
// PATCH  /projects/:projectId/environments/:environmentId
// DELETE /projects/:projectId/environments/:environmentId
router
  .route("/:environmentId")
  .get(environmentController.getEnvironmentById)
  .patch(environmentController.updateEnvironment)
  .delete(environmentController.deleteEnvironment);

// PATCH  /projects/:projectId/environments/:environmentId/activate
router
  .route("/:environmentId/activate")
  .patch(environmentController.setActiveEnvironment);

export default router;