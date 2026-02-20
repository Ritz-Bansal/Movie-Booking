import type { Request, Response } from "express";
import { Show, Booking, User } from "../models/db.js";
import { Signin, Signup } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT = process.env.JWT_SECRET!;

export async function signupController(req: Request, res: Response) {
  const { username, email, password, role } = req.body;
  const { success } = Signup.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "username, email and password are required",
    });
  }

  if (req.body.role == undefined) {
    return res.status(400).json({
      message: "role must be either user or admin",
    });
  }

  try {
    // const user = await User.findOneAndUpdate(
    //   { $or: [{ username: username }, { email: email }] },
    //   {
    //     $setOnInsert: {
    //   username: username,
    //   email: email,
    //   password: password,
    //   role: role,
    //     },
    //   },
    //   { upsert: true, returnDocument: "after" },
    // );

    const user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (user) {
      return res.status(409).json({
        message: "User with this email or username already exists",
      });
    }

    const data = await User.create({
      username: username,
      email: email,
      password: password,
      role: role,
    });

    return res.status(201).json({
      message: "Signup successful",
      userId: data?._id,
      role: data?.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function signinController(req: Request, res: Response) {
  const { email, password } = req.body;
  const { success } = Signin.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "email and password are required",
    });
  }

  try {
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.password == password) {
      const token = jwt.sign(
        {
          userId: user._id,
          role: user.role,
        },
        JWT,
      );

      return res.status(200).json({
        message: "Login successful",
        token: token,
        userId: user._id,
        role: user.role,
      });
    } else {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
