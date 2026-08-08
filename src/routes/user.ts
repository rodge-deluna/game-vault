import { Router } from "express";
import { createUser, getUserById, updateUser, deleteUser, getUsers } from "../controllers/usersController.js";
import { validateBody } from "../middleware/validate.js";
import { createUserSchema } from "../validators/userValidator.js";

const router = Router();

router.get("/", getUsers);

router.get("/:userId", getUserById);

router.post("/", validateBody(createUserSchema), createUser);

router.put("/:userId", validateBody(createUserSchema), updateUser);

router.delete("/:userId", deleteUser);

export default router;