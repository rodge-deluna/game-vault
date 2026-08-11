import { Router } from "express";
import { createUser, getUserById, updateUser, deleteUser, getUsers, getMyReviews } from "../controllers/usersController.js";
import { validateBody } from "../middleware/validate.js";
import { createUserSchema } from "../validators/userValidator.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/", getUsers);

router.get("/me/reviews", authenticate, getMyReviews)

router.post("/", validateBody(createUserSchema), createUser);

router.get("/:userId", getUserById);

router.put("/:userId", authenticate, validateBody(createUserSchema), updateUser);

router.delete("/:userId", authenticate, deleteUser);

export default router;