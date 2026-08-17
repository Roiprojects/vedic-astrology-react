import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bell, Hand, Moon, ScrollText, Sparkles, Star, Sun } from "lucide-react";
import { useAppUser } from "@/hooks/useAppUser";
import { formatDisplayDate, greetingForNow, moonPhaseName } from "@/lib/cosmic";
import { astrologers } from "@/lib/astrologers";
import { calculatePanchanga } from "@/lib/panchanga";
import { Skeleton } from "@/app/components/ScreenStates";
import { HScroll, IconLink, Screen } from "@/app/components/AppUI";
import { cn } from "@/lib/utils";

const QUICK = [
  { to: "/app/guruji", label: "Guruji", icon: Sparkles },
  { to: "/app/kundli", label: "Kundli", icon: ScrollText },
  { to: "/app/palm", label: "Palm", icon: Hand },
  { to: "/app/discover/horoscope", label: "Horoscope", icon: Sun },
  { to: "/app/discover/compatibility", label: "Match", icon: Star },
  { to: "/app/discover/muhurat", label: "Muhurat", icon: Moon },
];

export function HomeScreen() {
  const { loading, profile } = useAppUser();
  const chart = profile.chart;
  const panchanga = useMemo(() => calculatePanchanga(new Date()), []);
  const live = astrologers.filter((a) => a.online);

  return (
    <Screen className="va-stars">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="app-kicker">{formatDisplayDate()}</p>
          <h1 className="app-title truncate">
            {loading ? <Skeleton className="h-8 w-44" /> : greetingForNow(profile.name)}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <IconLink to="/app/profile/notifications" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </IconLink>
          <Link
            to="/app/profile"
            className="grid h-11 w-11 place-items-center rounded-full border border-[#D6AE57]/35 bg-[#11152F] font-display text-base text-[#F3D899]"
          >
            {(profile.name || "V").slice(0, 1).toUpperCase()}
          </Link>
        </div>
      </div>

      <section className="relative mt-5 overflow-hidden rounded-[1.75rem] border border-[#D6AE57]/25 bg-gradient-to-br from-[#1a1f48] via-[#11152F] to-[#080A18] p-5">
        <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-[#D6AE57]/10 blur-2xl" />
        <p className="app-kicker">Your Cosmic Energy</p>
        {loading || !chart ? (
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Skeleton className="h-[4.25rem]" />
            <Skeleton className="h-[4.25rem]" />
            <Skeleton className="h-[4.25rem]" />
            <Skeleton className="h-[4.25rem]" />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <EnergyCell label="Sun" value={chart.sunSign} />
            <EnergyCell label="Moon" value={chart.moonSign} />
            <EnergyCell label="Ascendant" value={chart.ascendant} />
            <EnergyCell label="Nakshatra" value={chart.nakshatra} />
          </div>
        )}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#27205B]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D6AE57] to-[#F3D899]"
              style={{ width: `${chart?.dailyEnergy ?? 58}%` }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-[#F3D899]">{chart?.dailyEnergy ?? 58}%</span>
        </div>
      </section>

      <section className="mt-4 rounded-[1.75rem] border border-[#D6AE57]/15 bg-[#FFF9EE] p-5 text-[#161616]">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#8a6a22]">Today's Guidance</p>
        <p className="mt-2 font-serif text-[1.2rem] leading-snug">
          {chart?.guidance || "Complete your birth details to receive a personalised reading."}
        </p>
        <p className="mt-3 text-sm text-[#6a5340]">
          {panchanga.tithi} · {panchanga.paksha} Paksha · {panchanga.nakshatra}
        </p>
      </section>

      <div className="mt-5 grid grid-cols-3 gap-2.5">
        {QUICK.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="app-tile"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#D6AE57]/12">
              <item.icon className="h-4 w-4 text-[#D6AE57]" />
            </span>
            <span className="text-[0.72rem] leading-tight text-[#F3D899]">{item.label}</span>
          </Link>
        ))}
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl">Live Astrologers</h2>
          <Link to="/app/consult" className="shrink-0 text-[0.68rem] uppercase tracking-[0.16em] text-[#D6AE57]">
            See all
          </Link>
        </div>
        <HScroll className="-mx-1 px-1">
          {live.map((a) => (
            <Link
              key={a.id}
              to={`/app/consult/${a.id}`}
              className="w-[16.5rem] shrink-0 rounded-[1.5rem] border border-[#D6AE57]/20 bg-[#11152F] p-4"
            >
              <div className="flex items-center gap-3">
                <span className="relative shrink-0">
                  <img src={a.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <span className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-[#11152F]", a.online ? "va-pulse-online bg-[#3ad67f]" : "bg-[#6a5340]")} />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-[#FFF9EE]">
                    {a.name} {a.verified && <span className="text-[#D6AE57]">✓</span>}
                  </p>
                  <p className="text-xs text-[#F3D899]/70">{a.experienceYears} yrs · {a.rating} ★</p>
                </div>
              </div>
              <p className="mt-3 truncate text-xs text-[#F3D899]/70">{a.specialties.slice(0, 2).join(" · ")}</p>
              <p className="mt-0.5 truncate text-xs text-[#F3D899]/50">{a.languages.join(", ")}</p>
              <div className="app-btn-row mt-3">
                <span className="app-btn app-btn-primary text-xs">Chat ₹{a.priceChat}</span>
                <span className="app-btn app-btn-ghost text-xs">Call</span>
              </div>
            </Link>
          ))}
        </HScroll>
      </section>

      <section className="app-card mt-6 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-serif text-2xl">Cosmic Dashboard</h2>
          <Link to="/app/cosmos" className="shrink-0 text-[0.68rem] uppercase tracking-[0.16em] text-[#D6AE57]">
            Open
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5 text-sm">
          <Dash label="Planetary energy" value={`${chart?.dailyEnergy ?? "—"}%`} />
          <Dash label="Moon phase" value={moonPhaseName()} />
          <Dash label="Today" value={panchanga.tithi} />
          <Dash label="Nakshatra" value={panchanga.nakshatra} />
        </div>
      </section>
    </Screen>
  );
}

function EnergyCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[4.25rem] rounded-2xl bg-[#080A18]/55 p-3">
      <p className="text-[0.6rem] uppercase tracking-[0.18em] text-[#D6AE57]/80">{label}</p>
      <p className="mt-1 font-serif text-[0.95rem] leading-snug text-[#FFF9EE]">{value}</p>
    </div>
  );
}

function Dash({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-h-[4.5rem] rounded-2xl border border-[#D6AE57]/15 p-3">
      <p className="text-[0.6rem] uppercase tracking-[0.16em] text-[#D6AE57]/70">{label}</p>
      <p className="mt-1 leading-snug text-[#FFF9EE]">{value}</p>
    </div>
  );
}
