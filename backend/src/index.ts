import express from "express";
import cors from "cors";
import userRouter from "./routes/auth.routes.js";
import showRouter from "./routes/show.routes.js";
import { bookingRouter } from "./routes/booking.routes.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("", userRouter);
app.use("", showRouter);
app.use("", bookingRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
