import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Pusher from "pusher";
import cors from "cors";
import Messages from "./dbMessages.js";
dotenv.config();

// Config
const PORT = process.env.PORT;
const app = express();
const pusher = new Pusher({
  appId: "1635930",
  key: "99d008bc0050e9123c67",
  secret: "fb8377401118a265a9f5",
  cluster: "ap2",
  useTLS: true,
});

// Middlewares
app.use(cors(
    {
        origin: ["https://whatsapp-mern-api.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
));
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
  const msgCollection = db.collection("messagecontents");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const msgDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        message: msgDetails.message,
        name: msgDetails.name,
        received: msgDetails.received,
        timestamp: msgDetails.timestamp,
      });
    } else {
      console.error("Pusher Error");
    }
  });
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
  const dbMessage = req.body;
  Messages.create(dbMessage)
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});

app.listen(PORT, console.log(`Server at: http://localhost:${PORT}`));
