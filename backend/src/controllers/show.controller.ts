import type { Request, Response } from "express";
import { createShowSchema } from "../validators/show.validator.js";
import { Show } from "../models/db.js";

export async function createShowController(req: Request, res: Response) {
  const role = req.role;
  if (role !== "admin") {
    return res.status(403).json({
      message: "Only admin can create shows",
    });
  }

  const { movieName, showTime, ticketPrice, availableTickets } = req.body;
  const newDate = new Date(showTime);

  const { success } = createShowSchema.safeParse({
    movieName: movieName,
    showTime: newDate,
    ticketPrice: ticketPrice,
    availableTickets: availableTickets
  });

  if (!success) {
    return res.status(400).json({
      message:
        "movieName, showTime, ticketPrice and availableTickets are required",
    });
  }

  if (ticketPrice <= 0 || availableTickets <= 0) {
    return res.status(400).json({
      message: "ticketPrice and availableTickets must be greater than 0",
    });
  }

  try {
    const show = await Show.create({
      movieName: movieName,
      showTime: newDate,
      ticketPrice: ticketPrice,
      ticketsAvailable: availableTickets,
    });

    return res.status(201).json({
      message: "Show created successfully",
      showId: show._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getShowsController(req: Request, res: Response) {
  try {
    const shows = await Show.find();
    return res.status(200).json(shows);
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getSpecificShowController(req: Request, res: Response) {
  const showId = req.params.showId;
  try {
    const show = await Show.findOne({
      _id: showId,
    });

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    return res.status(200).json(show);
  } catch {
    return res.status(500).json({
      message: "Show not found", // Case when you give invalid objectID, error will be thrown
    });
  }
}
