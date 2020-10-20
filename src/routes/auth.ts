import { Router } from "express";
import AuthController from "../controllers/auth-controller";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", AuthController.changePassword);

export default router;