import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { ASTROLOGER_CATEGORIES, filterAstrologers } from "@/lib/astrologers";
import { AppLink, ButtonRow, Chip, HScroll, Screen, ScreenTitle } from "@/app/components/AppUI";
import { EmptyState } from "@/app/components/ScreenStates";
import { cn } from "@/lib/utils";

export function ConsultScreen() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [language, setLanguage] = useState("all");
  const [sort, setSort] = useState<"rating" | "price" | "experience">("rating");
  const [onlineOnly, setOnlineOnly] = useState(false);

  const list = useMemo(
    () => filterAstrologers({ query, specialty, language, sort, onlineOnly }),
    [query, specialty, language, sort, onlineOnly]
  );

  return (
    <Screen>
      <ScreenTitle
        kicker="Verified guides"
        title="Consult"
        subtitle="Chat, call, or book a private Vedic reading."
      />

      <label className="mt-5 flex min-h-12 items-center gap-2 rounded-2xl border border-[#D6AE57]/25 bg-[#11152F] px-3">
        <Search className="h-4 w-4 shrink-0 text-[#D6AE57]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, language, specialty"
          className="h-12 w-full bg-transparent text-sm text-[#FFF9EE] outline-none placeholder:text-[#F3D899]/40"
        />
      </label>

      <HScroll className="mt-3">
        <Chip active={specialty === "all"} onClick={() => setSpecialty("all")}>
          All
        </Chip>
        {ASTROLOGER_CATEGORIES.map((c) => (
          <Chip key={c} active={specialty === c} onClick={() => setSpecialty(c)}>
            {c}
          </Chip>
        ))}
      </HScroll>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="app-input app-input-select !mt-0 h-11 min-h-11 px-3 text-xs"
        >
          <option value="rating">Rating</option>
          <option value="price">Price</option>
          <option value="experience">Experience</option>
        </select>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="app-input app-input-select !mt-0 h-11 min-h-11 px-3 text-xs"
        >
          <option value="all">Language</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Kannada</option>
          <option>Tamil</option>
          <option>Telugu</option>
          <option>Malayalam</option>
          <option>Marathi</option>
        </select>
        <button
          type="button"
          onClick={() => setOnlineOnly((v) => !v)}
          className={cn(
            "app-chip h-11 w-full justify-center",
            onlineOnly && "app-chip-active"
          )}
        >
          Online
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {list.length === 0 ? (
          <EmptyState title="No matches" message="Try another language, specialty, or turn off Online." />
        ) : (
          list.map((a) => (
            <article key={a.id} className="app-card p-4">
              <Link to={`/app/consult/${a.id}`} className="flex gap-3">
                <span className="relative shrink-0">
                  <img src={a.image} alt="" className="h-14 w-14 rounded-full object-cover" />
                  <span
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-[#11152F]",
                      a.online ? "va-pulse-online bg-[#3ad67f]" : "bg-[#6a5340]"
                    )}
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate font-medium">
                      {a.name} {a.verified && <span className="text-[#D6AE57]">✓</span>}
                    </p>
                    <p className="shrink-0 text-sm text-[#D6AE57]">₹{a.priceChat}</p>
                  </div>
                  <p className="text-xs text-[#F3D899]/70">
                    {a.title} · {a.experienceYears} yrs · {a.rating} ★
                  </p>
                  <p className="mt-1 truncate text-xs text-[#F3D899]/55">{a.specialties.join(" · ")}</p>
                  <p className="truncate text-xs text-[#F3D899]/45">{a.languages.join(", ")}</p>
                </div>
              </Link>
              <ButtonRow className="mt-3">
                <AppLink to={`/app/session/${a.id}?mode=chat`} variant="primary" className="app-btn-sm">
                  Chat
                </AppLink>
                <AppLink to={`/app/session/${a.id}?mode=call`} variant="ghost" className="app-btn-sm">
                  Call
                </AppLink>
                <AppLink to={`/app/consult/${a.id}`} variant="ghost" className="app-btn-sm">
                  Book
                </AppLink>
              </ButtonRow>
            </article>
          ))
        )}
      </div>
    </Screen>
  );
}
