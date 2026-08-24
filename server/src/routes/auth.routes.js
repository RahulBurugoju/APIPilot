import {Router} from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {registerSchema,loginSchema} from "../validators/auth.validator.js"
import {validate} from "../middlewares/validate.middleware.js"
import { 
    registerController, 
    loginController, 
    getMeController, 
    logoutController,
    refreshTokensController 
} from "../controllers/auth.controller.js";


const router = Router();

router.route('/register').post(
    validate(registerSchema),
    registerController
)

router.route('/login').post(
    validate(loginSchema),
    loginController
)

router.route('/logout').post(
    authenticate,
    logoutController
)

router.route("/me").get(
    authenticate,
    getMeController
)

router.route("/refresh-token").post(
    refreshTokensController
)

    
export default router
