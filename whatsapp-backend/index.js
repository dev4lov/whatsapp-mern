import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import Messages from "./dbMessages.js";
dotenv.config();

// Config
const PORT = process.env.PORT;
const app = express();

// Middlewares
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Database Connected...");
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.get("/messages/sync", (req, res) => {
  Messages.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(500).send(err));
});

app.post("/messages/new", (req, res) => {
  const dbMessage = { ...req.body };
  Messages.create(dbMessage)
});

app.listen(PORT, console.log(`Server at: http://localhost:${PORT}`));
