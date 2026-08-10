import { Router } from "express";
import { deleteReview, getReviewById, updateReview } from "../controllers/reviewsController.js";
import { validateBody } from "../middleware/validate.js";
import { createReviewSchema } from "../validators/reviewValidator.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.get("/:reviewId", getReviewById);

router.put("/:reviewId", authenticate, validateBody(createReviewSchema), updateReview);

router.delete("/:reviewId", authenticate, deleteReview);

export default router;