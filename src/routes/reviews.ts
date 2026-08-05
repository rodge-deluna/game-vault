import { Router } from "express";
import { deleteReview, getReviewById, updateReview } from "../controllers/reviewsController.js";
import { validateBody } from "../middleware/validate.js";
import { createReviewSchema } from "../validators/reviewValidator.js";

const router = Router();

router.get("/:reviewId", getReviewById);

router.put("/:reviewId", validateBody(createReviewSchema), updateReview);

router.delete("/:reviewId", deleteReview);

export default router;