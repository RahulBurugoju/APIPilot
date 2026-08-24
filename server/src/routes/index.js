import {Router} from "express";
import authRouter from './auth.routes.js'
const router = Router();

router.route('/health').get( (req, res) => {
  res.status(200).json({
    success: true,
    message: "APIPilot API is healthy , this from routes index.js",
  });
})

router.use('/auth',authRouter)

export default router