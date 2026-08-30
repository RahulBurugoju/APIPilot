import { Router } from "express";
import guestController from "../controllers/guest.controller.js";

const router = Router();

// Public guest execution route (no authentication required)
router.route("/execute").post(guestController.executeGuestRequest);

export default router;
