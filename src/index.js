import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";

const app = express();

app.use(bodyParser.json());

dotenv.config();

const MONGOURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/crud";
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/user", userRoute);
