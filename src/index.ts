import { config } from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";

config();

import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/db_dennisferdian_betest").then(
  () => {
    console.log("mongodb is connected");
  },
  (err) => {
    console.log("error:", err);
  }
);



import './config/redisClient'
import './config/kafka'
const app: Application = express();
app.use(express.json());
app.use(express.urlencoded())
import router from "./router";
app.use("/", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "user application",
  });
});

export default app;
