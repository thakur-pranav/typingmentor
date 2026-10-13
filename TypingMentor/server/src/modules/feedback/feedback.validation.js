import { z } from "zod";

export const createFeedbackSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("A valid email address is required"),
  category: z.enum(["suggestion", "bug", "query"], {
    required_error: "Please select a category (suggestion, bug, or query)",
  }),
  subject: z
    .string({ required_error: "Subject is required" })
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(120, "Subject must be at most 120 characters"),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(3000, "Message cannot exceed 3000 characters"),
});
