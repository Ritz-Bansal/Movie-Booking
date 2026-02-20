import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import type { Types } from "mongoose";

const JWT = process.env.JWT_SECRET;

interface JWTPayload {
  userId: Types.ObjectId;
  role: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (JWT == undefined) {
    throw new Error("JWT not found");
  }


  try {
    const header = req.headers.authorization;
    const authToken = header?.split(" ")[1];
    
    if (!authToken) {
      throw new Error("Auth token not found");
    }

    const decode = jwt.verify(authToken, JWT) as JWTPayload;
    req.role = decode.role;
    req.userId = decode.userId;
    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}
