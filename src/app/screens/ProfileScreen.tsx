import { ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppUser } from "@/hooks/useAppUser";
import { siteConfig } from "@/lib/site";
import { AppButton, AppLink, ButtonRow, Screen, ScreenTitle } from "@/app/components/AppUI";

const ITEMS = [
  { to: "/app/profile/me", label: "My Profile" },
  { to: "/app/kundli", label: "My Cosmic Profile" },
  { to: "/app/profile/birth", label: "Birth Details" },
  { to: "/app/profile/saved", label: "Saved Astrologers" },
  { to: "/app/profile/history", label: "Consultation History" },
  { to: "/app/profile/bookings", label: "Bookings" },
  { to: "/app/profile/reports", label: "Reports" },
  { to: "/app/kundli", label: "Kundli" },
  { to: "/app/guruji", label: "AI Conversations" },
  { to: "/app/profile/insights", label: "Saved Insights" },
  { to: "/app/profile/payments", label: "Payments" },
  { to: "/app/profile/notifications", label: "Notifications" },
  { to: "/app/profile/language", label: "Language" },
  { to: "/privacy-policy", label: "Privacy" },
  { to: "/terms-and-conditions", label: "Legal" },
];

export function ProfileScreen() {
  const { profile, signOut, userId } = useAppUser();
  const navigate = useNavigate();

  return (
    <Screen>
      <ScreenTitle kicker="Account" title="Profile" />
      <div className="app-card mt-5 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-[#D6AE57]/35 bg-[#080A18] font-display text-xl text-[#F3D899]">
            {(profile.name || "V").slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-serif text-2xl">{profile.name || "Guest"}</p>
            <p className="truncate text-sm text-[#F3D899]/70">{profile.email || "Local cosmic profile"}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-[#F3D899]/50">
          {userId ? "Synced with secure account" : "Saved on this device"}
        </p>
        <ButtonRow className="mt-4">
          <AppLink to="/app/auth" variant="primary">
            {userId ? "Account" : "Sign in"}
          </AppLink>
          <AppLink to="/app/onboarding" variant="ghost">
            Edit journey
          </AppLink>
        </ButtonRow>
      </div>

      <div className="app-list mt-4">
        {ITEMS.map((item) => (
          <Link key={item.label} to={item.to}>
            <span>{item.label}</span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[#D6AE57]/70" />
          </Link>
        ))}
      </div>

      <AppButton
        variant="danger"
        block
        className="mt-6"
        onClick={async () => {
          await signOut();
          navigate("/app/auth");
        }}
      >
        Logout
      </AppButton>
      <p className="mt-4 text-center text-[0.65rem] leading-relaxed text-[#F3D899]/40">{siteConfig.disclaimer}</p>
    </Screen>
  );
}
