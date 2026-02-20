import zod from "zod";

export const bookingSchema = zod.object({
  showId: zod.string(),
  seats: zod.number(),
});
