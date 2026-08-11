import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";

import authRouter from "./routes/auth.js";
import gamesRouter from "./routes/games.js";
import gameReviewsRouter from "./routes/gamesReview.js";
import gamesBacklogRouter from "./routes/gamesBacklog.js";
import reviewsRouter from "./routes/reviews.js";
import usersRouter from "./routes/users.js";
import usersBacklogRouter from "./routes/usersBacklog.js";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);

app.use("/games", gamesRouter);
app.use("/games", gameReviewsRouter);
app.use("/games", gamesBacklogRouter);

app.use("/users", usersRouter);
app.use("/users/me", usersBacklogRouter);

app.use("/reviews", reviewsRouter);

app.get("/about", (req, res) => {
    res.send("This is my GameVault API.");
});

app.use(errorHandler);

export default app;