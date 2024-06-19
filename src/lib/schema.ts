import { z } from "zod";

export const urlFormSchema = z.object({
  url: z
    .string()
    .min(1, { message: "A valid URL is required." })
    .url("Not a valid Github repo URL, try again.")
    .regex(
      /^(https:\/\/)(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+.*\/?$/, // This regex includes the possibility of having a path & query params after the repo name
      "Not a valid Github repo URL"
    ),
});
