import type { Request, Response } from "express";
import { bookingSchema } from "../validators/booking.validator.js";
import { Booking, Show } from "../models/db.js";
import { localTime } from "../services/localTime.js";
import mongoose from "mongoose";

export async function createBookingController(req: Request, res: Response) {
  const role = req.role;
  const userId = req.userId;

  if (userId == undefined) {
    throw new Error("userId not found");
  }

  if (role !== "user") {
    return res.status(403).json({
      message: "Admins cannot book tickets",
    });
  }

  const { showId, seats } = req.body;
  const { success } = bookingSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "showId and seats are required",
    });
  }

  if (seats <= 0) {
    return res.status(400).json({
      message: "seats must be greater than 0",
    });
  }

  try {
    const show = await Show.findOne({
      _id: showId,
    });

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    if (show.ticketsAvailable == null || show.ticketsAvailable == undefined) {
      throw new Error("Tickets available undefined");
    }

    if (show.ticketsAvailable < seats) {
      return res.status(400).json({
        message: "Not enough tickets available",
      });
    }
    const pricePerTicket = show.ticketPrice;
    if (pricePerTicket == null || pricePerTicket == undefined) {
      throw new Error("Tickets price undefined");
    }

    const session = await mongoose.startSession();
    let booking;

    try {
      session.startTransaction();

      const price = pricePerTicket * seats;
      const date = new Date();
      booking = await Booking.create({
        userId: userId,
        showId: show._id,
        seats: seats,
        totalAmount: price,
        bookingDate: date,
      });

      await booking.save({ session });

      await Show.updateOne(
        {
          _id: showId,
        },
        {
          $inc: {
            ticketsAvailable: -seats,
          },
        },
        { session },
      );

      await session.commitTransaction();
    } catch {
      session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        message: "Internal server error",
      });
    } finally {
      session.endSession();
    }

    const ist = localTime({ utc: show.showTime, timeZone: "Asia/Kolkata" });
    return res.status(201).json({
      message: "Booking successful",
      bookingId: booking._id,
      movieName: show.movieName,
      showTime: ist,
      seats: booking.seats,
      totalAmount: booking.totalAmount,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getBookingsController(req: Request, res: Response) {
  try {
    const bookings = await Booking.find({}).select("-__v -userId");

    return res.status(200).json({
      bookings,
    });
  } catch {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
