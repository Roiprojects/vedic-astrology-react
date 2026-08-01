import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Hand, Loader2, RefreshCw, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/forms/fields";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { siteConfig } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
export function PalmReader() {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [base64, setBase64] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [name, setName] = useState("");
    const [question, setQuestion] = useState("");
    const [status, setStatus] = useState("idle");
    const [reading, setReading] = useState("");
    const [error, setError] = useState("");
    function handleFile(file) {
        if (!file)
            return;
        if (!file.type.startsWith("image/")) {
            setError("Please choose an image file.");
            setStatus("error");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Please choose an image under 5 MB.");
            setStatus("error");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            setPreview(dataUrl);
            setBase64(dataUrl.split(",")[1] ?? "");
            setMediaType(file.type);
            setError("");
            setStatus("idle");
        };
        reader.readAsDataURL(file);
    }
    async function analyze() {
        if (!base64 || !mediaType) {
            setError("Please upload a photo of your palm first.");
            setStatus("error");
            return;
        }
        setStatus("loading");
        setError("");
        setReading("");
        try {
            const res = await apiFetch("/api/palm-reading", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64: base64, mediaType, name, question }),
            });
            const data = await res.json();
            if (!res.ok || !data.ok)
                throw new Error(data.error || "Could not read the palm.");
            setReading(data.reading);
            setStatus("done");
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
            setStatus("error");
        }
    }
    function reset() {
        setPreview(null);
        setBase64(null);
        setMediaType(null);
        setReading("");
        setError("");
        setStatus("idle");
    }
    return (_jsxs("div", { className: "mx-auto grid max-w-5xl gap-6 lg:grid-cols-2", children: [_jsxs("div", { className: "rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-8", children: [_jsx("h3", { className: "font-serif text-2xl text-ink", children: "Upload Your Palm" }), _jsx("p", { className: "mt-1 text-sm text-faint", children: "A clear, well-lit photo of your open dominant hand works best." }), _jsx("button", { type: "button", onClick: () => inputRef.current?.click(), className: "group mt-5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-gold/30 bg-overlay/40 transition-colors hover:border-gold/60", children: preview ? (_jsx("img", { src: preview, alt: "Palm preview", className: "h-full w-full object-cover" })) : (_jsxs("span", { className: "flex flex-col items-center gap-2 text-faint", children: [_jsx(Upload, { className: "h-8 w-8 text-gold/70" }), _jsx("span", { className: "text-sm", children: "Tap to upload a palm photo" }), _jsx("span", { className: "text-xs", children: "JPG / PNG / WebP \u00B7 max 5 MB" })] })) }), _jsx("input", { ref: inputRef, type: "file", accept: "image/*", className: "hidden", onChange: (e) => handleFile(e.target.files?.[0]) }), _jsxs("div", { className: "mt-5 space-y-4", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "palm-name", children: "Your Name (optional)" }), _jsx(Input, { id: "palm-name", placeholder: "Your name", value: name, onChange: (e) => setName(e.target.value) })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "palm-q", children: "What would you like to know? (optional)" }), _jsx(Textarea, { id: "palm-q", placeholder: "e.g. career direction, marriage, health\u2026", value: question, onChange: (e) => setQuestion(e.target.value) })] })] }), _jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row", children: [_jsx(Button, { variant: "primary", size: "lg", onClick: analyze, disabled: status === "loading", className: "flex-1", children: status === "loading" ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), " Reading your palm\u2026"] })) : (_jsxs(_Fragment, { children: [_jsx(Sparkles, { className: "h-4 w-4" }), " Read My Palm"] })) }), preview && (_jsxs(Button, { variant: "gold", size: "lg", onClick: reset, children: [_jsx(RefreshCw, { className: "h-4 w-4" }), " Reset"] }))] }), error && (_jsx("p", { className: "mt-4 rounded-xl border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger", children: error }))] }), _jsxs("div", { className: "rounded-3xl border border-gold/25 bg-surface/60 p-6 sm:p-8", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Hand, { className: "h-5 w-5 text-gold" }), _jsx("h3", { className: "font-serif text-2xl text-ink", children: "Your Palm Reading" })] }), status === "done" && reading ? (_jsxs("div", { className: "mt-5 space-y-3 text-sm leading-relaxed text-muted", children: [reading.split("\n").filter(Boolean).map((line, i) => {
                                const isHeading = /^[0-9]?\.?\s?[A-Z][A-Za-z &—-]+$/.test(line.trim()) && line.length < 60;
                                return isHeading ? (_jsx("h4", { className: "pt-2 font-serif text-base text-gold-light", children: line.replace(/^\d+\.\s*/, "") }, i)) : (_jsx("p", { children: line }, i));
                            }), _jsxs("div", { className: "mt-6 flex flex-col gap-3 sm:flex-row", children: [_jsx(Button, { href: "/contact-us", variant: "primary", size: "md", children: "Book a Full Consultation" }), _jsxs(Button, { href: whatsappLink(siteConfig.whatsapp, "Namaste Guruji, I scanned my palm and would like a personal consultation."), external: true, variant: "whatsapp", size: "md", children: [_jsx(WhatsAppIcon, { className: "h-4 w-4" }), " Ask Guruji"] })] })] })) : (_jsx("div", { className: "mt-5 flex min-h-[16rem] flex-col items-center justify-center rounded-2xl border border-gold/10 bg-overlay/30 p-6 text-center", children: status === "loading" ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-gold" }), _jsx("p", { className: "mt-3 text-sm text-muted", children: "Guruji's Assistant is studying the lines of your palm\u2026" })] })) : (_jsxs(_Fragment, { children: [_jsx(Hand, { className: "h-10 w-10 text-gold/40" }), _jsx("p", { className: "mt-3 text-sm text-faint", children: "Your personalized palm reading will appear here." })] })) })), _jsxs("p", { className: "mt-6 text-xs leading-relaxed text-faint", children: [siteConfig.disclaimer, " Instant palm readings are for reflection and guidance and are not a substitute for a personal consultation."] })] })] }));
}
