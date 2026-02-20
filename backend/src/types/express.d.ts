import type { Types } from "mongoose";

declare global {
  namespace Express {
    export interface Request {
      role?: string;
      userId?: Types.ObjectId;
    }
  }
}
