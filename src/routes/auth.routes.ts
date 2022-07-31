import { createSessionHandler, refreshAccessToken } from "./../controller/auth.controller";
import { createSessionSchema } from "./../schema/auth.schema";
import express from "express";
import validateResource from "../middleware/validateResource";

const Router = express.Router();

Router.post(
  "/api/session",
  validateResource(createSessionSchema),
  createSessionHandler
);

Router.post("/api/session/refresh", refreshAccessToken)

export default Router;
