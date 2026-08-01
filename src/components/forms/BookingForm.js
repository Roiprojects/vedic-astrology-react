import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { refineForVariant, } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { Input, Label, Select, Textarea } from "@/components/forms/fields";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
const titles = {
    consultation: "Book Your Consultation",
    homam: "Book This Homam",
    "birth-chart": "Request Your Birth Chart PDF",
    chat: "Start Your Chat Booking",
    contact: "Send Us a Message",
};
export function BookingForm({ variant, subject, className, }) {
    const schema = useMemo(() => refineForVariant(variant), [variant]);
    const [reference, setReference] = useState(null);
    const [serverError, setServerError] = useState(null);
    // @ts-ignore react-hook-form / zod type mismatch (zod v3 + rhf v7)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { register, handleSubmit, getValues, formState: { errors, isSubmitting }, } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { variant, subject: subject ?? "" },
    });
    const needBirth = variant === "consultation" || variant === "birth-chart";
    const errs = errors;
    // @ts-ignore onSubmit generic type mismatch
    async function onSubmit(values) {
        setServerError(null);
        try {
            const res = await apiFetch("/api/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await res.json();
            if (!res.ok || !data.ok)
                throw new Error(data.error || "Something went wrong");
            setReference(data.reference);
        }
        catch (err) {
            setServerError(err instanceof Error ? err.message : "Could not submit. Please try WhatsApp.");
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
        return (_jsxs("div", { className: "glass-card rounded-3xl p-8 text-center", children: [_jsx(CheckCircle2, { className: "mx-auto h-14 w-14 text-online" }), _jsx("h3", { className: "mt-4 font-serif text-2xl text-ink", children: "Request Received" }), _jsxs("p", { className: "mt-2 text-sm text-muted", children: ["Your reference is", " ", _jsx("span", { className: "font-semibold text-gold-light", children: reference }), ". Guruji will review your details and reach out to you shortly."] }), _jsxs("div", { className: "mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center", children: [_jsxs(Button, { href: waFallback(), external: true, variant: "whatsapp", size: "md", children: [_jsx(WhatsAppIcon, { className: "h-4 w-4" }), "Confirm on WhatsApp"] }), _jsx(Button, { variant: "gold", size: "md", onClick: () => {
                                setReference(null);
                            }, children: "Submit Another" })] })] }));
    }
    const fieldError = (msg) => msg ? _jsx("p", { className: "mt-1 text-xs text-danger", children: msg }) : null;
    return (_jsxs("form", { 
        // @ts-ignore onSubmit type mismatch with zod v4/v3
        onSubmit: handleSubmit(onSubmit), className: className, noValidate: true, children: [_jsx("h3", { className: "font-serif text-2xl text-ink", children: titles[variant] }), _jsx("p", { className: "mt-1 text-sm text-faint", children: "Fill in your details \u2014 all information stays strictly confidential." }), _jsx("input", { type: "hidden", ...register("variant") }), _jsx("input", { type: "hidden", ...register("subject") }), _jsx("input", { type: "text", tabIndex: -1, autoComplete: "off", className: "hidden", "aria-hidden": true, ...register("website") }), _jsxs("div", { className: "mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsxs("div", { className: "sm:col-span-2", children: [_jsx(Label, { htmlFor: "name", required: true, children: "Full Name" }), _jsx(Input, { id: "name", placeholder: "Your name", ...register("name") }), fieldError(errs.name?.message)] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "phone", required: true, children: "Phone" }), _jsx(Input, { id: "phone", type: "tel", placeholder: "+91 90000 00000", ...register("phone") }), fieldError(errs.phone?.message)] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, { id: "email", type: "email", placeholder: "you@email.com", ...register("email") }), fieldError(errs.email?.message)] }), needBirth && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "dob", required: true, children: "Date of Birth" }), _jsx(Input, { id: "dob", type: "date", ...register("dob") }), fieldError(errs.dob?.message)] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "tob", required: true, children: "Time of Birth" }), _jsx(Input, { id: "tob", type: "time", ...register("tob") }), fieldError(errs.tob?.message)] }), _jsxs("div", { className: "sm:col-span-2", children: [_jsx(Label, { htmlFor: "pob", required: true, children: "Place of Birth" }), _jsx(Input, { id: "pob", placeholder: "City, State, Country", ...register("pob") }), fieldError(errs.pob?.message)] })] })), variant === "birth-chart" && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "gender", children: "Gender" }), _jsxs(Select, { id: "gender", defaultValue: "", ...register("gender"), children: [_jsx("option", { value: "", children: "Select" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" })] })] })), variant === "consultation" && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "preferredMode", children: "Preferred Mode" }), _jsxs(Select, { id: "preferredMode", defaultValue: "", ...register("preferredMode"), children: [_jsx("option", { value: "", children: "Select" }), _jsx("option", { value: "phone", children: "Phone Call" }), _jsx("option", { value: "whatsapp", children: "WhatsApp" }), _jsx("option", { value: "video", children: "Video Call" }), _jsx("option", { value: "chat", children: "Chat" })] })] })), variant === "homam" && (_jsxs("div", { children: [_jsx(Label, { htmlFor: "preferredDate", children: "Preferred Date" }), _jsx(Input, { id: "preferredDate", type: "date", ...register("preferredDate") })] })), variant === "contact" && (_jsxs(_Fragment, { children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "serviceInterested", children: "Service Interested In" }), _jsxs(Select, { id: "serviceInterested", defaultValue: "", ...register("serviceInterested"), children: [_jsx("option", { value: "", children: "Select" }), _jsx("option", { value: "astrology-consultation", children: "Astrology Consultation" }), _jsx("option", { value: "homam", children: "Homam Booking" }), _jsx("option", { value: "birth-chart", children: "Birth Chart PDF" }), _jsx("option", { value: "chat", children: "Chat with Guruji" }), _jsx("option", { value: "other", children: "Other" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "preferredContact", children: "Preferred Contact" }), _jsxs(Select, { id: "preferredContact", defaultValue: "", ...register("preferredContact"), children: [_jsx("option", { value: "", children: "Select" }), _jsx("option", { value: "phone", children: "Phone" }), _jsx("option", { value: "whatsapp", children: "WhatsApp" }), _jsx("option", { value: "email", children: "Email" })] })] })] })), _jsxs("div", { className: "sm:col-span-2", children: [_jsx(Label, { htmlFor: "message", required: variant === "contact", children: variant === "contact"
                                    ? "Message"
                                    : needBirth
                                        ? "Your Question / Concern"
                                        : "Message (optional)" }), _jsx(Textarea, { id: "message", placeholder: "Share your concern or any details you'd like Guruji to know\u2026", ...register("message") }), fieldError(errs.message?.message)] })] }), serverError && (_jsx("p", { className: "mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger", children: serverError })), _jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row", children: [_jsx(Button, { type: "submit", variant: "primary", size: "lg", disabled: isSubmitting, className: "flex-1", children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Submitting\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(Send, { className: "h-4 w-4" }), " Submit Request"] })) }), _jsxs(Button, { href: whatsappLink(siteConfig.whatsapp, `Namaste Guruji, I would like to enquire${subject ? ` about ${subject}` : ""}.`), external: true, variant: "whatsapp", size: "lg", children: [_jsx(WhatsAppIcon, { className: "h-5 w-5" }), "WhatsApp Instead"] })] }), _jsx("p", { className: "mt-3 text-center text-xs text-faint sm:text-left", children: siteConfig.disclaimer })] }));
}
