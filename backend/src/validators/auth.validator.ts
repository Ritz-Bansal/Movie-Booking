import zod from "zod";

const userRoles = ["user", "admin"];

export const Signup = zod.object({
  username: zod.string(),
  email: zod.email(),
  password: zod.string(),
  role: zod.enum(userRoles).default("user"),
});

export const Signin = zod.object({
  email: zod.email(),
  password: zod.string(),
});
