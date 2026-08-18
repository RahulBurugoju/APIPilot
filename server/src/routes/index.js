import {Router} from "express";

const router = Router();

router.route('/health').get( (req, res) => {
  res.status(200).json({
    success: true,
    message: "APIPilot API is healthy , this from routes index.js",
  });
})

export default router