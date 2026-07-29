import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to GameVault!");
});

app.get("/games", (req, res) => {
    console.log(req.method);
    console.log(req.url);

    res.send("Games");
});

app.get("/about", (req, res) => {
  res.send("This is my GameVault API.");
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});