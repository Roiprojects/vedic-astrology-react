import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
export function LogoutButton() {
    const navigate = useNavigate();
    async function logout() {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
        navigate("/admin/login");
        window.location.reload();
    }
    return (_jsxs("button", { type: "button", onClick: logout, className: "inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:text-ink", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "Sign out" })] }));
}
