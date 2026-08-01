import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
const inputCls = "w-full rounded-xl border border-gold/30 bg-overlay px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold/70";
const labelCls = "mb-1.5 block text-sm font-medium text-ink";
const hintCls = "mt-1 text-xs text-faint";
function Section({ title, description, children, }) {
    return (_jsxs("section", { className: "rounded-3xl border border-gold/20 bg-surface/60 p-6 sm:p-7", children: [_jsx("h2", { className: "font-serif text-xl text-ink", children: title }), description && _jsx("p", { className: "mt-1 text-sm text-muted", children: description }), _jsx("div", { className: "mt-5 space-y-5", children: children })] }));
}
function ListEditor({ label, items, onChange, placeholder, }) {
    return (_jsxs("div", { children: [_jsx("label", { className: labelCls, children: label }), _jsx("div", { className: "space-y-2", children: items.map((item, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: inputCls, value: item, placeholder: placeholder, onChange: (e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it))) }), _jsx("button", { type: "button", "aria-label": "Remove item", onClick: () => onChange(items.filter((_, idx) => idx !== i)), className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/25 text-faint transition-colors hover:border-danger/50 hover:text-danger", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }, i))) }), _jsxs("button", { type: "button", onClick: () => onChange([...items, ""]), className: "mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-medium text-gold-light transition-colors hover:border-gold/70", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), "Add item"] })] }));
}
export function HomamForm({ mode, initial, }) {
    const navigate = useNavigate();
    const [form, setForm] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    function update(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }
    function setList(key, next) {
        setForm((f) => ({ ...f, [key]: next }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        const payload = {
            ...form,
            price: Number(form.price) || 0,
            order: Number(form.order) || 0,
            discountPrice: form.discountPrice === null || form.discountPrice === undefined
                ? null
                : Number(form.discountPrice),
            benefits: form.benefits.map((s) => s.trim()).filter(Boolean),
            suitableFor: form.suitableFor.map((s) => s.trim()).filter(Boolean),
            poojaItems: form.poojaItems.map((s) => s.trim()).filter(Boolean),
            faqs: form.faqs
                .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
                .filter((f) => f.question && f.answer),
        };
        const url = mode === "create" ? "/api/admin/homams" : `/api/admin/homams/${initial.slug}`;
        const method = mode === "create" ? "POST" : "PUT";
        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const fieldErrors = data?.issues?.fieldErrors;
                if (fieldErrors) {
                    const msgs = Object.entries(fieldErrors).flatMap(([k, v]) => (v ?? []).map((m) => `${k}: ${m}`));
                    setError(msgs.join(" · ") || data.error || "Validation failed");
                }
                else {
                    setError(data.error ?? "Could not save. Please try again.");
                }
                return;
            }
            navigate("/admin/homams");
            window.location.reload();
        }
        catch {
            setError("Something went wrong. Please try again.");
        }
        finally {
            setSaving(false);
        }
    }
    async function onDelete() {
        if (!window.confirm(`Delete "${initial.name}"? This cannot be undone.`))
            return;
        setDeleting(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/homams/${initial.slug}`, { method: "DELETE" });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error ?? "Could not delete.");
                return;
            }
            navigate("/admin/homams");
            window.location.reload();
        }
        catch {
            setError("Something went wrong. Please try again.");
        }
        finally {
            setDeleting(false);
        }
    }
    return (_jsxs("form", { onSubmit: onSubmit, className: "mt-8 space-y-6", children: [error && (_jsx("div", { className: "rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger", children: error })), _jsxs(Section, { title: "Basics", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Name" }), _jsx("input", { className: inputCls, value: form.name, onChange: (e) => update("name", e.target.value), placeholder: "Ganapathi Homam" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Slug (URL)" }), _jsx("input", { className: inputCls, value: form.slug, onChange: (e) => update("slug", e.target.value), placeholder: "ganapathi-homam" }), _jsxs("p", { className: hintCls, children: ["Shown at /homams/<slug>", mode === "edit" ? " — changing this changes the page URL." : "."] })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Icon (emoji)" }), _jsx("input", { className: inputCls, value: form.icon, onChange: (e) => update("icon", e.target.value), placeholder: "\uD83D\uDD49\uFE0F" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Duration" }), _jsx("input", { className: inputCls, value: form.duration, onChange: (e) => update("duration", e.target.value), placeholder: "2\u20133 hours" })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Short benefit" }), _jsx("textarea", { className: inputCls, rows: 2, value: form.shortBenefit, onChange: (e) => update("shortBenefit", e.target.value), placeholder: "One-line benefit shown on cards." })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Full description" }), _jsx("textarea", { className: inputCls, rows: 4, value: form.fullDescription, onChange: (e) => update("fullDescription", e.target.value) })] })] }), _jsxs(Section, { title: "Pricing & presentation", children: [_jsxs("div", { className: "grid gap-5 sm:grid-cols-3", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Price (\u20B9)" }), _jsx("input", { type: "number", min: 0, className: inputCls, value: form.price, onChange: (e) => update("price", e.target.value === "" ? 0 : Number(e.target.value)) })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Discount price (\u20B9)" }), _jsx("input", { type: "number", min: 0, className: inputCls, value: form.discountPrice ?? "", onChange: (e) => update("discountPrice", e.target.value === "" ? null : Number(e.target.value)), placeholder: "Optional" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Display order" }), _jsx("input", { type: "number", className: inputCls, value: form.order, onChange: (e) => update("order", e.target.value === "" ? 0 : Number(e.target.value)) })] })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Gradient (Tailwind classes)" }), _jsx("input", { className: inputCls, value: form.gradient, onChange: (e) => update("gradient", e.target.value), placeholder: "from-orange-500/30 to-red-600/30" }), _jsx("p", { className: hintCls, children: "Reuse gradient classes already present on other homams so they render correctly." })] })] }), _jsxs(Section, { title: "Content lists", description: "Bullet points shown across the homam page.", children: [_jsx(ListEditor, { label: "Benefits", items: form.benefits, onChange: (n) => setList("benefits", n) }), _jsx(ListEditor, { label: "Suitable for", items: form.suitableFor, onChange: (n) => setList("suitableFor", n) }), _jsx(ListEditor, { label: "Pooja items", items: form.poojaItems, onChange: (n) => setList("poojaItems", n) }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Booking instructions" }), _jsx("textarea", { className: inputCls, rows: 3, value: form.bookingInstructions, onChange: (e) => update("bookingInstructions", e.target.value) })] })] }), _jsxs(Section, { title: "FAQs", children: [_jsx("div", { className: "space-y-4", children: form.faqs.map((faq, i) => (_jsxs("div", { className: "rounded-2xl border border-gold/20 bg-[#b67a1b]/[0.015] p-4", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-medium uppercase tracking-wide text-faint", children: ["FAQ ", i + 1] }), _jsxs("button", { type: "button", onClick: () => update("faqs", form.faqs.filter((_, idx) => idx !== i)), className: "inline-flex items-center gap-1 text-xs text-faint transition-colors hover:text-danger", children: [_jsx(Trash2, { className: "h-3.5 w-3.5" }), " Remove"] })] }), _jsx("input", { className: `${inputCls} mb-2`, value: faq.question, placeholder: "Question", onChange: (e) => update("faqs", form.faqs.map((f, idx) => (idx === i ? { ...f, question: e.target.value } : f))) }), _jsx("textarea", { className: inputCls, rows: 3, value: faq.answer, placeholder: "Answer", onChange: (e) => update("faqs", form.faqs.map((f, idx) => (idx === i ? { ...f, answer: e.target.value } : f))) })] }, i))) }), _jsxs("button", { type: "button", onClick: () => update("faqs", [...form.faqs, { question: "", answer: "" }]), className: "inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-medium text-gold-light transition-colors hover:border-gold/70", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), " Add FAQ"] })] }), _jsx(Section, { title: "Visibility", children: _jsxs("div", { className: "flex flex-col gap-3", children: [_jsxs("label", { className: "flex items-center gap-3 text-sm text-ink", children: [_jsx("input", { type: "checkbox", checked: form.active, onChange: (e) => update("active", e.target.checked), className: "h-4 w-4 accent-saffron" }), "Active \u2014 show this homam on the website"] }), _jsxs("label", { className: "flex items-center gap-3 text-sm text-ink", children: [_jsx("input", { type: "checkbox", checked: form.featured, onChange: (e) => update("featured", e.target.checked), className: "h-4 w-4 accent-saffron" }), "Featured \u2014 include in homepage highlights"] })] }) }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("button", { type: "submit", disabled: saving, className: "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-saffron via-saffron-deep to-gold-deep px-7 py-3 text-sm font-medium text-[#1a0a04] shadow-[0_10px_30px_-10px_rgba(240,132,46,0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50", children: saving ? "Saving…" : mode === "create" ? "Create homam" : "Save changes" }), mode === "edit" && (_jsxs("button", { type: "button", onClick: onDelete, disabled: deleting, className: "inline-flex items-center gap-1.5 rounded-full border border-danger/40 px-5 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/5 disabled:opacity-50", children: [_jsx(Trash2, { className: "h-4 w-4" }), deleting ? "Deleting…" : "Delete"] }))] })] }));
}
