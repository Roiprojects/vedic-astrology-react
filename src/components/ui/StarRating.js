import { jsx as _jsx } from "react/jsx-runtime";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
export function StarRating({ rating, className, size = 16, }) {
    return (_jsx("div", { className: cn("flex items-center gap-0.5", className), "aria-label": `${rating} out of 5 stars`, children: Array.from({ length: 5 }).map((_, i) => (_jsx(Star, { style: { width: size, height: size }, className: cn(i < Math.round(rating)
                ? "fill-gold text-gold"
                : "fill-transparent text-gold/30") }, i))) }));
}
