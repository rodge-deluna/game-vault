import { Router } from "express";
import { deleteReview, getReviewById, updateReview } from "../controllers/reviewsController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import { createReviewSchema, reviewIdParamSchema } from "../validators/reviewValidator.js";

const router = Router();

router.get("/:reviewId", validateParams(reviewIdParamSchema), getReviewById);

router.put("/:reviewId", authenticate, validateParams(reviewIdParamSchema), validateBody(createReviewSchema), updateReview);

router.delete("/:reviewId", authenticate, validateParams(reviewIdParamSchema), deleteReview);

export default router;