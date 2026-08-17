import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { astrologers } from "@/lib/astrologers";
import { useAppUser } from "@/hooks/useAppUser";
import { formatINR } from "@/lib/utils";
import { openWhatsApp } from "@/lib/whatsapp";
import { ScreenError } from "@/app/components/ScreenStates";
import { AppButton, BackLink, ButtonRow, Screen } from "@/app/components/AppUI";
import { RazorpayButton } from "@/components/payment/RazorpayButton";

export function AstrologerProfileScreen() {
  const { id } = useParams();
  const astrologer = astrologers.find((a) => a.id === id);
  const { toggleSavedAstrologer, savedAstrologers, addConsult, profile } = useAppUser();
  const navigate = useNavigate();
  const [paid, setPaid] = useState(false);

  if (!astrologer) {
    return (
      <ScreenError
        title="Astrologer unavailable"
        message="This profile could not be found."
        onRetry={() => navigate("/app/consult")}
      />
    );
  }

  const person = astrologer;
  const saved = savedAstrologers.includes(person.id);

  async function start(mode: "chat" | "call" | "book") {
    await addConsult({
      astrologerId: person.id,
      astrologerName: person.name,
      mode,
      status: person.online ? "connecting" : "unavailable",
    });
    navigate(`/app/session/${person.id}?mode=${mode}`);
  }

  return (
    <Screen>
      <BackLink to="/app/consult">← Consult</BackLink>
      <div className="mt-4 flex items-center gap-4">
        <img
          src={astrologer.image}
          alt=""
          className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-[#D6AE57]/40"
        />
        <div className="min-w-0">
          <h1 className="app-title truncate">{astrologer.name}</h1>
          <p className="app-sub">{astrologer.title}</p>
          <p className="mt-1 text-xs text-[#F3D899]/60">
            {astrologer.rating} ★ · {astrologer.experienceYears} years · {astrologer.languages.join(", ")}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#FFF9EE]/80">{astrologer.about}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {astrologer.specialties.map((s) => (
          <span key={s} className="app-chip pointer-events-none">
            {s}
          </span>
        ))}
      </div>

      <ButtonRow className="mt-6">
        <AppButton onClick={() => void start("chat")} variant="primary">
          Chat
        </AppButton>
        <AppButton onClick={() => void start("call")} variant="ghost">
          Call
        </AppButton>
        <AppButton onClick={() => void start("book")} variant="ghost">
          Book
        </AppButton>
      </ButtonRow>

      <div className="app-card mt-5 p-4">
        <p className="app-kicker">Consultation payment</p>
        <p className="mt-1 font-serif text-2xl">{formatINR(astrologer.priceChat)}</p>
        {paid ? (
          <p className="mt-3 text-sm text-[#3ad67f]">Payment received. You can start the session.</p>
        ) : (
          <div className="mt-3">
            <RazorpayButton
              amount={astrologer.priceChat}
              serviceName={`${astrologer.name} consultation`}
              customerName={profile.name}
              onSuccess={() => setPaid(true)}
              label="Pay & continue"
              className="w-full from-[#F3D899] via-[#D6AE57] to-[#c1912f] text-[#080A18] shadow-none"
            />
          </div>
        )}
      </div>

      <ButtonRow className="mt-4">
        <AppButton onClick={() => void toggleSavedAstrologer(astrologer.id)} variant="ghost">
          {saved ? "Saved" : "Save"}
        </AppButton>
        <AppButton
          variant="whatsapp"
          onClick={() => void openWhatsApp(`Namaste, I would like to consult ${astrologer.name} regarding my chart.`)}
        >
          WhatsApp
        </AppButton>
      </ButtonRow>
    </Screen>
  );
}
