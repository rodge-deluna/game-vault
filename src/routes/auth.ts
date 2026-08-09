import { Router } from "express";
import { login } from "../controllers/authController.js";
import { loginSchema } from "../validators/loginValidator.js";
import {
    validateBody,
} from "../middleware/validate.js";

const router = Router();

router.post("/login", validateBody(loginSchema), login);

export default router;