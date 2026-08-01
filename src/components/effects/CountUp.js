import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
/**
 * Animates a numeric value up to its target when scrolled into view.
 * Accepts strings like "50K+", "4.9/5", "100%", "15+" — animates the leading
 * number and keeps the suffix.
 */
export function CountUp({ value, className }) {
    const match = value.match(/^([\d.]+)(.*)$/);
    const target = match ? parseFloat(match[1]) : 0;
    const suffix = match ? match[2] : value;
    const decimals = match && match[1].includes(".") ? 1 : 0;
    const [n, setN] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || !match)
            return;
        const io = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !started.current) {
                started.current = true;
                const start = performance.now();
                const dur = 1500;
                const tick = (t) => {
                    const p = Math.min(1, (t - start) / dur);
                    const eased = 1 - Math.pow(1 - p, 3);
                    setN(target * eased);
                    if (p < 1)
                        requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.4 });
        io.observe(el);
        return () => io.disconnect();
    }, [target, match]);
    if (!match)
        return _jsx("span", { className: className, children: value });
    return (_jsxs("span", { ref: ref, className: className, children: [n.toFixed(decimals), suffix] }));
}
