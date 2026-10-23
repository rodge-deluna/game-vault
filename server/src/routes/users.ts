import { Router } from "express";
import { createUser, deleteUser, getMyReviews, getUserById, getUsers, updateUser } from "../controllers/usersController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { createUserSchema, userIdParamSchema } from "../validators/userValidator.js";

const router = Router();

router.get("/", getUsers);

router.post("/", validateBody(createUserSchema), createUser);

router.get("/me/reviews", authenticate, getMyReviews);

router.put("/me", authenticate, validateBody(createUserSchema), updateUser);

router.delete("/me", authenticate, deleteUser);

router.get("/:userId", validateParams(userIdParamSchema), getUserById);

export default router;