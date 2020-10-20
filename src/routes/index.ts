import { Router, Request, Response } from "express";
import user from "./user";
import auth from "./auth";
import post from "./post";
import comment from "./comment";
import message from "./message";
import conversation from "./conversation";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/post", post);
routes.use("/comment", comment);
routes.use("/message", message);
routes.use("/conversation", conversation);

export default routes;
