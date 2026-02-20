import mongoose, { Types } from "mongoose";
import { Schema } from "mongoose";
import "dotenv/config";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("Database URL not found");
}

mongoose.connect(DATABASE_URL);

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
  },
});

const showSchema = new Schema({
  movieName: String,
  showTime: Date,
  ticketPrice: Number,
  ticketsAvailable: Number,
  createdAt: Date,
});

const bookingSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
  },
  seats: Number,
  totalAmount: Number,
  bookingDate: Date,
});

const User = mongoose.model("User", userSchema);
const Show = mongoose.model("Show", showSchema);
const Booking = mongoose.model("Booking", bookingSchema);

export { User, Show, Booking };
