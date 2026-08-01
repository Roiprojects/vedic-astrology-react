import { z } from "zod";

export type BookingVariant = "consultation" | "homam" | "birth-chart" | "chat" | "contact";

export const bookingSchema = z.object({
  name: z.string().min(2, { error: "Name is required" }),
  email: z.string().email({ error: "Valid email required" }),
  phone: z.string().min(10, { error: "Valid phone number required" }),
  service: z.string().optional(),
  message: z.string().min(10, { error: "Please share more details" }),
  birthDetails: z.string().optional(),
  preferredDate: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export function refineForVariant(variant: BookingVariant) {
  if (variant === "consultation") {
    return bookingSchema.refine(
      (d) => d.birthDetails && d.birthDetails.length > 5,
      { error: "Please share your birth details", path: ["birthDetails"] }
    );
  }
  if (variant === "birth-chart") {
    return bookingSchema.refine(
      (d) => d.birthDetails && d.birthDetails.length > 5,
      { error: "Please share your birth details", path: ["birthDetails"] }
    );
  }
  return bookingSchema;
}

export const enquirySchema = z.object({
  name: z.string().min(2, { error: "Name is required" }),
  email: z.string().email({ error: "Valid email required" }),
  phone: z.string().min(10, { error: "Valid phone number required" }),
  service: z.string().optional(),
  message: z.string().min(10, { error: "Please share more details" }),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
