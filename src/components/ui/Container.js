import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
export function Container({ className, children, }) {
    return _jsx("div", { className: cn("container-x", className), children: children });
}
