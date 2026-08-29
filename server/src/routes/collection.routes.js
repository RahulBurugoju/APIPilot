import { Router } from "express";
import collectionController from "../controllers/collection.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCollectionSchema,
  updateCollectionSchema,
} from "../validators/collection.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { verifyProjectOwner } from "../middlewares/verifyOwner.middleware.js";
import requestRouter from './request.routes.js'

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use('/:collectionId/requests',requestRouter)
router
  .route("/")
  .all(verifyProjectOwner)
  .post(validate(createCollectionSchema), collectionController.createCollection)
  .get(collectionController.getProjectCollections);


router.route("/:collectionId")
  .all(verifyProjectOwner)
  .patch(collectionController.updateCollection)
  .delete(collectionController.deleteCollection);


export default router;
