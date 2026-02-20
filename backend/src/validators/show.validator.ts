import zod from "zod";

export const createShowSchema = zod.object({
  movieName: zod.string(),
  showTime: zod.date(),
  ticketPrice: zod.number(),
  availableTickets: zod.number(),
});
