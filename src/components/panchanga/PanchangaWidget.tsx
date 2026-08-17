import { useMemo } from "react";
import { CalendarDays, Moon, Sun, Star } from "lucide-react";
import { calculatePanchanga, getUpcomingFestival, getTodayFestival } from "@/lib/panchanga";

function PanchangaItem({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-gold/20 bg-[#b67a1b]/[0.06]">
        <Icon className="h-4 w-4 text-gold-light" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-faint">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-ink">{value}</p>
        {sub && <p className="text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );
}

export function PanchangaWidget() {
  const today = useMemo(() => new Date(), []);
  const p = useMemo(() => calculatePanchanga(today), [today]);
  const festival = useMemo(() => getTodayFestival(today), [today]);
  const upcoming = useMemo(() => getUpcomingFestival(today), [today]);

  const displayDate = today.toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  // Days until upcoming festival
  let upcomingText: string | undefined;
  if (upcoming) {
    const diff = Math.round((new Date(upcoming.date).getTime() - today.getTime()) / 86400000);
    if (diff === 0) {
      upcomingText = "Today!";
    } else if (diff === 1) {
      upcomingText = "Tomorrow";
    } else if (diff <= 7) {
      upcomingText = `in ${diff} days`;
    } else {
      upcomingText = new Date(upcoming.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }
  }

  return (
    <div className="rounded-3xl border border-gold/20 bg-surface/70 p-5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-gold/15 pb-3">
        <div>
          <h3 className="font-serif text-base text-ink">Today&apos;s Panchanga</h3>
          <p className="mt-0.5 text-xs text-faint">{displayDate}</p>
        </div>
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-gold/20 bg-[#b67a1b]/[0.06]">
          <CalendarDays className="h-5 w-5 text-gold-light" />
        </div>
      </div>

      {/* Festival today */}
      {festival && (
        <div className="mt-3 rounded-2xl border border-gold/30 bg-gold/[0.06] px-4 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold-light">✨ Today&apos;s Festival</p>
          <p className="mt-0.5 font-serif text-base text-ink">{festival.name}</p>
        </div>
      )}

      {/* Panchanga grid */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <PanchangaItem
          icon={Moon}
          label="Tithi"
          value={p.tithi}
          sub={`${p.paksha} Paksha · ${p.tithiNumber}`}
        />
        <PanchangaItem
          icon={Star}
          label="Nakshatra"
          value={p.nakshatra}
          sub={`Nakshatra ${p.nakshatraNumber}`}
        />
        <PanchangaItem
          icon={Sun}
          label="Paksha"
          value={`${p.paksha} Paksha`}
          sub={p.paksha === "Shukla" ? "Bright fortnight" : "Dark fortnight"}
        />
        <PanchangaItem
          icon={CalendarDays}
          label="Vara"
          value={p.vara}
          sub={p.varaEn}
        />
      </div>

      {/* Upcoming festival */}
      {upcoming && !festival && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-gold/15 bg-[#b67a1b]/[0.03] px-4 py-2.5">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-faint">Next Festival</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{upcoming.name}</p>
          </div>
          <span className="rounded-full border border-gold/25 px-2.5 py-1 text-xs font-medium text-gold-light">
            {upcomingText}
          </span>
        </div>
      )}

      <p className="mt-3 text-center text-[0.65rem] text-faint">
        Lahiri ayanamsa · IST calculations
      </p>
    </div>
  );
}
