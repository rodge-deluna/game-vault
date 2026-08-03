import express from "express";
import gamesRouter from "./routes/games.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/games", gamesRouter);

app.get("/about", (req, res) => {
	res.send("This is my GameVault API.");
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});