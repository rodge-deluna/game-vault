import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import gamesRouter from "./routes/games.js";
import gameReviewsRouter from "./routes/gamesReview.js";
import reviewsRouter from "./routes/reviews.js";
import usersRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import backlogRouter from "./routes/backlog.js"

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/games", gamesRouter);
app.use("/games", gameReviewsRouter);
app.use("/reviews", reviewsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/games", backlogRouter);

app.get("/about", (req, res) => {
	res.send("This is my GameVault API.");
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});