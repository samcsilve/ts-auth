import {
  createUserHandler,
  getCurrentUserHandler,
} from "./../controller/user.controller";
import express from "express";
import validateResource from "../middleware/validateResource";
import { createUserSchema } from "../schema/user.schema";
import requireUser from "../middleware/requireUser";

const Router = express.Router();

Router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

Router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default Router;
