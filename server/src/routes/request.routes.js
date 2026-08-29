import {Router} from "express"
import requestController from "../controllers/request.controller.js";
import { verifyCollectionAndProject } from "../middlewares/verifyRequestBelongs.middleware.js";
import {authenticate} from "../middlewares/auth.middleware.js"

const router = Router({mergeParams:true})

router.use(authenticate)

router.route('/')
      .post(requestController.createRequest)
      .get(requestController.getCollectionRequests)

router.route("/:requestId")
      .get(requestController.getRequest)
      .patch(requestController.updateRequest)
      .delete(requestController.deleteRequest)      

export default router