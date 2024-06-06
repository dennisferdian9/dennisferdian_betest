import { Router, Request, Response } from "express";
export const Route = Router();
import users from "./users";
import auth from "./auth";

Route.use("/users", users);

Route.use("/auth", auth);

export default Route;
