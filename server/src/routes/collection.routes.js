import { Router } from "express";
import collectionController from "../controllers/collection.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createCollectionSchema,
  updateCollectionSchema,
} from "../validators/collection.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { verifyProjectOwner } from "../middlewares/verifyOwner.middleware.js";

const router = Router({ mergeParams: true });

router.use(authenticate);

router
  .route("/")
  .all(verifyProjectOwner)
  .post(validate(createCollectionSchema), collectionController.createCollection)
  .get(collectionController.getProjectCollections);


router.route("/collections/:collectionId")
  .all(verifyProjectOwner)
  .patch(validate(updateCollectionSchema), collectionController.updateCollection);

export default router;
