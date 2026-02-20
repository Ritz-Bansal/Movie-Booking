import express from "express";
import {
  createShowController,
  getShowsController,
  getSpecificShowController,
} from "../controllers/show.controller.js";
import { authMiddleware } from "../auth/auth.js";

const showRouter = express.Router();

showRouter.post("/shows", authMiddleware, createShowController);
showRouter.get("/shows", getShowsController);
showRouter.get("/shows/:showId", getSpecificShowController);

export default showRouter;
