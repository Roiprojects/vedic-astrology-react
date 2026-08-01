import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
export function Section({ id, className, containerClassName, children, }) {
    return (_jsx("section", { id: id, className: cn("relative py-16 sm:py-20 lg:py-24", className), children: _jsx(Container, { className: containerClassName, children: children }) }));
}
