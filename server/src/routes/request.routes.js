import { Router } from "express";
import requestController from "../controllers/request.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  verifyCollectionAndProject,
  verifyRequestBelongs,
} from "../middlewares/verifyRequestBelongs.middleware.js";
import {
  createRequestSchema,
  updateRequestSchema,
} from "../validators/request.validator.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router
  .route("/")
  .all(verifyCollectionAndProject)
  .post(validate(createRequestSchema), requestController.createRequest)
  .get(requestController.getCollectionRequests);

router
  .route("/:requestId")
  .all(verifyRequestBelongs)
  .get(requestController.getRequest)
  .patch(validate(updateRequestSchema), requestController.updateRequest)
  .delete(requestController.deleteRequest);

export default router;