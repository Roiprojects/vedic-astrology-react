import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppUser } from "@/hooks/useAppUser";
import { AppButton, AppLink, Screen } from "@/app/components/AppUI";

type Step = "email" | "otp" | "name";

export function AuthScreen() {
  const { sendOtp, verifyOtp, signIn, signUp, profile } = useAppUser();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"otp" | "password">("otp");
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(profile.email || "");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState(profile.name || "");
  const [password, setPassword] = useState("");
  const [pwMode, setPwMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // ── OTP flow ──────────────────────────────────────────────────────────────

  async function handleSendOtp() {
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    setBusy(true); setError("");
    try {
      await sendOtp(email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length < 6) { setError("Enter the 6-digit code from your email."); return; }
    setBusy(true); setError("");
    try {
      await verifyOtp(email, otp, name || undefined);
      navigate("/app", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      // If user doesn't have a name yet ask for it then retry
      if (msg.toLowerCase().includes("name") || (!name && !profile.name)) {
        setIsNewUser(true);
        setStep("name");
        setBusy(false);
        return;
      }
      setError(msg);
    } finally {
      setBusy(false);
    }
  }

  async function handleNameThenVerify() {
    if (!name.trim()) { setError("Please enter your name."); return; }
    setBusy(true); setError("");
    try {
      await verifyOtp(email, otp, name);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue");
    } finally {
      setBusy(false);
    }
  }

  // ── Password flow ─────────────────────────────────────────────────────────

  async function handlePassword() {
    setBusy(true); setError("");
    try {
      if (pwMode === "login") await signIn(email, password);
      else await signUp(email, password, name);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue");
    } finally {
      setBusy(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <Screen className="flex min-h-full flex-col pb-8 pt-12">
      <p className="text-center font-display text-xs tracking-[0.3em] text-[#D6AE57]">VEDIC ASTROLOGY</p>
      <h1 className="mt-4 text-center font-serif text-4xl">
        {mode === "otp"
          ? step === "email" ? "Sign in" : step === "name" ? "Welcome!" : "Enter code"
          : pwMode === "login" ? "Welcome back" : "Create account"}
      </h1>
      <p className="mt-2 text-center text-sm text-[#F3D899]/70">
        {mode === "otp" && step === "email" && "We'll send a code to your email — no password needed."}
        {mode === "otp" && step === "otp" && `Code sent to ${email}`}
        {mode === "otp" && step === "name" && "Just one more thing — what's your name?"}
        {mode === "password" && "Sign in with your email and password."}
      </p>

      {/* ── OTP mode ── */}
      {mode === "otp" && (
        <div className="mt-8 space-y-3">
          {step === "email" && (
            <>
              <input
                className="app-input !mt-0"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void handleSendOtp()}
              />
              {error && <p className="text-sm text-[#e5484d]">{error}</p>}
              <AppButton block disabled={busy} onClick={() => void handleSendOtp()}>
                {busy ? "Sending…" : "Send sign-in code"}
              </AppButton>
            </>
          )}

          {step === "otp" && (
            <>
              <input
                className="app-input !mt-0 text-center text-2xl tracking-[0.5em] font-mono"
                type="number"
                inputMode="numeric"
                placeholder="——————"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                onKeyDown={(e) => e.key === "Enter" && void handleVerifyOtp()}
                autoFocus
              />
              {error && <p className="text-sm text-[#e5484d]">{error}</p>}
              <AppButton block disabled={busy} onClick={() => void handleVerifyOtp()}>
                {busy ? "Verifying…" : "Verify code"}
              </AppButton>
              <button
                type="button"
                className="mt-2 w-full text-sm text-[#F3D899]/60"
                onClick={() => { setStep("email"); setOtp(""); setError(""); }}
              >
                Use a different email
              </button>
              <button
                type="button"
                className="mt-1 w-full text-sm text-[#D6AE57]/80"
                onClick={() => void handleSendOtp()}
                disabled={busy}
              >
                Resend code
              </button>
            </>
          )}

          {step === "name" && (
            <>
              {isNewUser && (
                <p className="rounded-xl border border-[#D6AE57]/20 bg-[#D6AE57]/8 px-4 py-3 text-sm text-[#F3D899]/80">
                  Account created! Tell us your name so Guruji can address you personally.
                </p>
              )}
              <input
                className="app-input !mt-0"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void handleNameThenVerify()}
                autoFocus
              />
              {error && <p className="text-sm text-[#e5484d]">{error}</p>}
              <AppButton block disabled={busy} onClick={() => void handleNameThenVerify()}>
                {busy ? "Please wait…" : "Continue"}
              </AppButton>
            </>
          )}
        </div>
      )}

      {/* ── Password mode ── */}
      {mode === "password" && (
        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => { e.preventDefault(); void handlePassword(); }}
        >
          {pwMode === "signup" && (
            <input
              className="app-input !mt-0"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            className="app-input !mt-0"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="app-input !mt-0"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-[#e5484d]">{error}</p>}
          <AppButton type="submit" block disabled={busy}>
            {busy ? "Please wait…" : pwMode === "login" ? "Sign in" : "Create account"}
          </AppButton>
          <button
            type="button"
            className="mt-4 min-h-11 w-full text-sm text-[#F3D899]/80"
            onClick={() => setPwMode(pwMode === "login" ? "signup" : "login")}
          >
            {pwMode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </form>
      )}

      {/* ── Mode switcher ── */}
      <div className="mt-4 text-center">
        <button
          type="button"
          className="text-xs text-[#F3D899]/50 underline"
          onClick={() => { setMode(mode === "otp" ? "password" : "otp"); setError(""); setStep("email"); }}
        >
          {mode === "otp" ? "Sign in with password instead" : "Sign in with email code (no password)"}
        </button>
      </div>

      <div className="mt-auto pt-6">
        <AppLink to="/app" variant="ghost" block>
          Continue as guest
        </AppLink>
      </div>
    </Screen>
  );
}
