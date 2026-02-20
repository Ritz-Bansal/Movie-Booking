import express from "express";
import {
  createBookingController,
  getBookingsController,
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../auth/auth.js";

export const bookingRouter = express.Router();

bookingRouter.use(authMiddleware);
bookingRouter.post("/bookings", createBookingController);
bookingRouter.get("/bookings", getBookingsController);
