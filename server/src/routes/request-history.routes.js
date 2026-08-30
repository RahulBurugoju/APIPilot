import { Router } from "express";
import requestHistoryController from "../controllers/request-history.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { verifyRequestHistoryAccess } from "../middlewares/verifyRequestHistoryAccess.middleware.js";


const router = Router({ mergeParams: true });

// Enforce authentication & 4-tier authorization chain across all history endpoints
router.use(authenticate);
router.use(verifyRequestHistoryAccess);

router
    .route("/")
    .get(requestHistoryController.getRequestHistory)
    .delete(requestHistoryController.clearRequestHistory);

router
    .route("/:executionId")
    .get(requestHistoryController.getExecutionById)
    .delete(requestHistoryController.deleteExecution);

export default router;
