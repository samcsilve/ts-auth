import express from "express";
import user from "./user.routes";
import auth from "./auth.routes";

const Router = express.Router();

Router.get("/healthcheck", (_, res) => res.sendStatus(200));
Router.use(user);
Router.use(auth);

export default Router;
