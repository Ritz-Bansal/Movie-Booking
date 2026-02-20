import express from "express";
import {
  signinController,
  signupController,
} from "../controllers/auth.controller.js";

const userRouter = express.Router();

userRouter.post("/signup", signupController);
userRouter.post("/signin", signinController);

export default userRouter;
