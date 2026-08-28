import { Router } from "express";
import { createUser, deleteUser, getMyReviews, getUserById, getUsers, updateUser } from "../controllers/usersController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody } from "../middleware/validate.js";
import { createUserSchema } from "../validators/userValidator.js";

const router = Router();

router.get("/", getUsers);

router.post("/", validateBody(createUserSchema), createUser);

router.get("/me/reviews", authenticate, getMyReviews)

router.put("/me", authenticate, validateBody(createUserSchema), updateUser);

router.delete("/me", authenticate, deleteUser);

router.get("/:userId", getUserById);

export default router;