import * as z from "zod"

export const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
  budget: z.enum(["<$5K", "$5K-$10K", "$10K-$20K", "$20K+"]).optional(),
  services: z.array(z.string()).min(1, {
    message: "Please select at least one service.",
  }),
}) 