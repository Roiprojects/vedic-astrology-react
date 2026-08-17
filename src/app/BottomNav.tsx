import { NavLink } from "react-router-dom";
import { Compass, Home, Sparkles, Star, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { hapticLight } from "@/lib/native";

const tabs = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/consult", label: "Consult", icon: Star },
  { to: "/app/guruji", label: "Guruji", icon: Sparkles, raised: true },
  { to: "/app/discover", label: "Discover", icon: Compass },
  { to: "/app/profile", label: "Profile", icon: UserRound },
] as const;

export function BottomNav() {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div
        className="pointer-events-auto mx-auto w-full max-w-lg px-3"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="grid h-[4.5rem] grid-cols-5 items-end overflow-visible rounded-[28px] border border-[#D6AE57]/25 bg-[#080A18]/94 px-1 shadow-[0_-16px_40px_-20px_rgba(8,10,24,0.9)] backdrop-blur-xl">
          {tabs.map((tab) => (
            <TabLink key={tab.to} {...tab} />
          ))}
        </div>
      </div>
    </nav>
  );
}

function TabLink({
  to,
  label,
  icon: Icon,
  end,
  raised,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
  raised?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={() => void hapticLight()}
      aria-label={label}
      className="flex h-full min-w-0 flex-col items-center justify-end pb-2"
    >
      {({ isActive }) =>
        raised ? (
          <>
            <span
              className={cn(
                "-mt-5 mb-1 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-b from-[#F3D899] to-[#D6AE57] text-[#080A18] shadow-[0_8px_24px_-6px_rgba(214,174,87,0.95)]",
                isActive && "ring-2 ring-[#FFF9EE]/30"
              )}
            >
              <span className="font-display text-xl leading-none">✦</span>
            </span>
            <span className={cn("text-[0.58rem] font-semibold uppercase tracking-[0.12em]", isActive ? "text-[#D6AE57]" : "text-[#F3D899]/70")}>
              {label}
            </span>
          </>
        ) : (
          <>
            <Icon className={cn("mb-1 h-[1.15rem] w-[1.15rem]", isActive ? "text-[#D6AE57]" : "text-[#F3D899]/55")} />
            <span className={cn("text-[0.58rem] font-semibold uppercase tracking-[0.12em]", isActive ? "text-[#D6AE57]" : "text-[#F3D899]/55")}>
              {label}
            </span>
          </>
        )
      }
    </NavLink>
  );
}
