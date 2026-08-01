import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
const inputCls = "w-full rounded-xl border border-gold/30 bg-overlay px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold/70";
const labelCls = "mb-1.5 block text-sm font-medium text-ink";
function Section({ title, children }) {
    return (_jsxs("section", { className: "rounded-3xl border border-gold/20 bg-surface/60 p-6 sm:p-7", children: [_jsx("h2", { className: "font-serif text-xl text-ink", children: title }), _jsx("div", { className: "mt-5 space-y-5", children: children })] }));
}
export function PageContentForm({ pageId, initial, config, }) {
    const navigate = useNavigate();
    const [form, setForm] = useState(initial);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [saved, setSaved] = useState(false);
    function update(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
        setSaved(false);
    }
    async function onSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSaved(false);
        const payload = {
            ...form,
            price: form.price === null || form.price === undefined ? null : Number(form.price),
            includes: form.includes.map((s) => s.trim()).filter(Boolean),
            faqs: form.faqs
                .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
                .filter((f) => f.question && f.answer),
        };
        try {
            const res = await fetch(`/api/admin/pages/${pageId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.error ?? "Could not save.");
                return;
            }
            setSaved(true);
            window.location.reload();
        }
        catch {
            setError("Something went wrong. Please try again.");
        }
        finally {
            setSaving(false);
        }
    }
    return (_jsxs("form", { onSubmit: onSubmit, className: "mt-8 space-y-6", children: [error && (_jsx("div", { className: "rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-sm text-danger", children: error })), saved && (_jsx("div", { className: "rounded-2xl border border-online/40 bg-online/5 px-4 py-3 text-sm text-online", children: "Saved. Changes are live on the page." })), _jsxs(Section, { title: "Hero", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Eyebrow" }), _jsx("input", { className: inputCls, value: form.eyebrow, onChange: (e) => update("eyebrow", e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Title" }), _jsx("input", { className: inputCls, value: form.title, onChange: (e) => update("title", e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Subtitle" }), _jsx("textarea", { className: inputCls, rows: 2, value: form.subtitle, onChange: (e) => update("subtitle", e.target.value) })] })] }), config.pricing && (_jsx(Section, { title: "Pricing", children: _jsxs("div", { className: "grid gap-5 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Price (\u20B9)" }), _jsx("input", { type: "number", min: 0, className: inputCls, value: form.price ?? "", onChange: (e) => update("price", e.target.value === "" ? null : Number(e.target.value)), placeholder: "Leave blank to hide" })] }), _jsxs("div", { children: [_jsx("label", { className: labelCls, children: "Price note" }), _jsx("input", { className: inputCls, value: form.priceNote, onChange: (e) => update("priceNote", e.target.value), placeholder: "Delivered in 24\u201348 hours" })] })] }) })), config.includes && (_jsxs(Section, { title: "Report includes", children: [_jsx("div", { className: "space-y-2", children: form.includes.map((item, i) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { className: inputCls, value: item, onChange: (e) => update("includes", form.includes.map((it, idx) => (idx === i ? e.target.value : it))) }), _jsx("button", { type: "button", "aria-label": "Remove", onClick: () => update("includes", form.includes.filter((_, idx) => idx !== i)), className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold/25 text-faint transition-colors hover:border-danger/50 hover:text-danger", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }, i))) }), _jsxs("button", { type: "button", onClick: () => update("includes", [...form.includes, ""]), className: "inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-medium text-gold-light transition-colors hover:border-gold/70", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), " Add item"] })] })), config.faqs && (_jsxs(Section, { title: "FAQs", children: [_jsx("div", { className: "space-y-4", children: form.faqs.map((faq, i) => (_jsxs("div", { className: "rounded-2xl border border-gold/20 bg-[#b67a1b]/[0.015] p-4", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsxs("span", { className: "text-xs font-medium uppercase tracking-wide text-faint", children: ["FAQ ", i + 1] }), _jsxs("button", { type: "button", onClick: () => update("faqs", form.faqs.filter((_, idx) => idx !== i)), className: "inline-flex items-center gap-1 text-xs text-faint transition-colors hover:text-danger", children: [_jsx(Trash2, { className: "h-3.5 w-3.5" }), " Remove"] })] }), _jsx("input", { className: `${inputCls} mb-2`, value: faq.question, placeholder: "Question", onChange: (e) => update("faqs", form.faqs.map((f, idx) => (idx === i ? { ...f, question: e.target.value } : f))) }), _jsx("textarea", { className: inputCls, rows: 3, value: faq.answer, placeholder: "Answer", onChange: (e) => update("faqs", form.faqs.map((f, idx) => (idx === i ? { ...f, answer: e.target.value } : f))) })] }, i))) }), _jsxs("button", { type: "button", onClick: () => update("faqs", [...form.faqs, { question: "", answer: "" }]), className: "inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-medium text-gold-light transition-colors hover:border-gold/70", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), " Add FAQ"] })] })), _jsx("button", { type: "submit", disabled: saving, className: "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-saffron via-saffron-deep to-gold-deep px-7 py-3 text-sm font-medium text-[#1a0a04] shadow-[0_10px_30px_-10px_rgba(240,132,46,0.6)] transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50", children: saving ? "Saving…" : "Save changes" })] }));
}
