import { z } from "zod";

export const urlFormSchema = z.object({
  url: z
    .string()
    .min(1, "Field Required")
    .url("Not a valid Github Repo URL")
    .regex(
      /^(https:\/\/)(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+.*\/?$/, // This regex includes the possibility of having a path & query params after the repo name
      "Not a valid Github Repo URL"
    ),
});
