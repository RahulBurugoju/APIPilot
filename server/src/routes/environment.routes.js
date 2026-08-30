import { Router } from "express";

const router = Router({ mergeParams: true });

// POST   /projects/:projectId/environments
// GET    /projects/:projectId/environments
router
  .route("/")
  .post((req, res) => {})
  .get((req, res) => {});

// GET    /projects/:projectId/environments/:environmentId
// PATCH  /projects/:projectId/environments/:environmentId
// DELETE /projects/:projectId/environments/:environmentId
router
  .route("/:environmentId")
  .get((req, res) => {})
  .patch((req, res) => {})
  .delete((req, res) => {});

// PATCH  /projects/:projectId/environments/:environmentId/activate
router
  .route("/:environmentId/activate")
  .patch((req, res) => {});

export default router;