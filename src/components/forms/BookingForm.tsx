import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import {
  refineForVariant,
  type BookingInput,
  type BookingVariant,
} from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Input, Label, Select, Textarea, FieldError } from "@/components/forms/fields";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import { apiFetch } from "@/lib/api";

const titles: Record<BookingVariant, string> = {
  consultation: "Book Your Consultation",
  homam: "Book This Homam",
  "birth-chart": "Request Your Birth Chart PDF",
  chat: "Start Your Chat Booking",
  contact: "Send Us a Message",
};

type FieldErrors = Record<string, { message?: string }>;

export function BookingForm({
  variant,
  subject,
  className,
}: {
  variant: BookingVariant;
  subject?: string;
  className?: string;
}) {
  const schema = useMemo(
    () => refineForVariant(variant) as z.ZodType<BookingInput>,
    [variant]
  );
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // @ts-ignore react-hook-form / zod type mismatch (zod v3 + rhf v7)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: { variant, subject: subject ?? "" },
  });

  const needBirth = variant === "consultation" || variant === "birth-chart";
  const errs = errors as FieldErrors;

  // @ts-ignore onSubmit generic type mismatch
  async function onSubmit(values: unknown) {
    setServerError(null);
    try {
      const res = await apiFetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong");
      setReference(data.reference);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Could not submit. Please try WhatsApp."
      );
    }
  }

  function waFallback() {
    const v = getValues();
    const lines = [
      `Namaste Guruji, I would like to enquire${subject ? ` about ${subject}` : ""}.`,
      v.name && `Name: ${v.name}`,
      v.phone && `Phone: ${v.phone}`,
      v.dob && `DOB: ${v.dob}`,
      v.tob && `Time of birth: ${v.tob}`,
      v.pob && `Place of birth: ${v.pob}`,
      v.message && `Message: ${v.message}`,
    ].filter(Boolean);
    return whatsappLink(siteConfig.whatsapp, lines.join("\n"));
  }

  if (reference) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-online" />
        <h3 className="mt-4 font-serif text-2xl text-ink">Request Received</h3>
        <p className="mt-2 text-sm text-muted">
          Your reference is{" "}
          <span className="font-semibold text-gold-light">{reference}</span>. Guruji
          will review your details and reach out to you shortly.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href={waFallback()} external variant="whatsapp" size="md">
            <WhatsAppIcon className="h-4 w-4" />
            Confirm on WhatsApp
          </Button>
          <Button
            variant="gold"
            size="md"
            onClick={() => {
              setReference(null);
            }}
          >
            Submit Another
          </Button>
        </div>
      </div>
    );
  }

  const fieldError = (msg: string | undefined) =>
    msg ? <p className="mt-1 text-xs text-danger">{msg}</p> : null;

  return (
    <form
      // @ts-ignore onSubmit type mismatch with zod v4/v3
      onSubmit={handleSubmit(onSubmit)}
      className={className}
      noValidate
    >
      <h3 className="font-serif text-2xl text-ink">{titles[variant]}</h3>
      <p className="mt-1 text-sm text-faint">
        Fill in your details — all information stays strictly confidential.
      </p>

      <input type="hidden" {...register("variant")} />
      <input type="hidden" {...register("subject")} />
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
        {...register("website")}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name" required>Full Name</Label>
          <Input id="name" placeholder="Your name" {...register("name")} />
          {fieldError(errs.name?.message)}
        </div>

        <div>
          <Label htmlFor="phone" required>Phone</Label>
          <Input id="phone" type="tel" placeholder="+91 90000 00000" {...register("phone")} />
          {fieldError(errs.phone?.message)}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@email.com" {...register("email")} />
          {fieldError(errs.email?.message)}
        </div>

        {needBirth && (
          <>
            <div>
              <Label htmlFor="dob" required>Date of Birth</Label>
              <Input id="dob" type="date" {...register("dob")} />
              {fieldError(errs.dob?.message)}
            </div>
            <div>
              <Label htmlFor="tob" required>Time of Birth</Label>
              <Input id="tob" type="time" {...register("tob")} />
              {fieldError(errs.tob?.message)}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="pob" required>Place of Birth</Label>
              <Input id="pob" placeholder="City, State, Country" {...register("pob")} />
              {fieldError(errs.pob?.message)}
            </div>
          </>
        )}

        {variant === "birth-chart" && (
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select id="gender" defaultValue="" {...register("gender")}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>
        )}

        {variant === "consultation" && (
          <div>
            <Label htmlFor="preferredMode">Preferred Mode</Label>
            <Select id="preferredMode" defaultValue="" {...register("preferredMode")}>
              <option value="">Select</option>
              <option value="phone">Phone Call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="video">Video Call</option>
              <option value="chat">Chat</option>
            </Select>
          </div>
        )}

        {variant === "homam" && (
          <div>
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input id="preferredDate" type="date" {...register("preferredDate")} />
          </div>
        )}

        {variant === "contact" && (
          <>
            <div>
              <Label htmlFor="serviceInterested">Service Interested In</Label>
              <Select id="serviceInterested" defaultValue="" {...register("serviceInterested")}>
                <option value="">Select</option>
                <option value="astrology-consultation">Astrology Consultation</option>
                <option value="homam">Homam Booking</option>
                <option value="birth-chart">Birth Chart PDF</option>
                <option value="chat">Chat with Guruji</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredContact">Preferred Contact</Label>
              <Select id="preferredContact" defaultValue="" {...register("preferredContact")}>
                <option value="">Select</option>
                <option value="phone">Phone</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </Select>
            </div>
          </>
        )}

        <div className="sm:col-span-2">
          <Label htmlFor="message" required={variant === "contact"}>
            {variant === "contact"
              ? "Message"
              : needBirth
                ? "Your Question / Concern"
                : "Message (optional)"}
          </Label>
          <Textarea
            id="message"
            placeholder="Share your concern or any details you'd like Guruji to know…"
            {...register("message")}
          />
          {fieldError(errs.message?.message)}
        </div>
      </div>

      {serverError && (
        <p className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger">
          {serverError}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Submit Request
            </>
          )}
        </Button>
        <Button
          href={whatsappLink(
            siteConfig.whatsapp,
            `Namaste Guruji, I would like to enquire${subject ? ` about ${subject}` : ""}.`
          )}
          external
          variant="whatsapp"
          size="lg"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp Instead
        </Button>
      </div>
      <p className="mt-3 text-center text-xs text-faint sm:text-left">
        {siteConfig.disclaimer}
      </p>
    </form>
  );
}
