/** Enquiry / Booking API route. */
import { Router } from "express";
import { refineForVariant, type BookingVariant } from "../../src/lib/validation";

const router = Router();

router.post("/", (req, res) => {
  const variant = (req.body?.variant || "contact") as BookingVariant;
  const parsed = refineForVariant(variant).safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      ok: false,
      error: "Validation failed",
      issues: parsed.error.flatten(),
    });
  }

  if ((parsed.data as { website?: string }).website) {
    return res.json({ ok: true, id: "ignored" });
  }

  const reference = `VA-${Date.now().toString(36).toUpperCase()}`;
  console.info("[enquiry] received", { reference, variant });

  return res.json({ ok: true, reference });
});

export default router;