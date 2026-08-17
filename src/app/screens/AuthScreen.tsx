import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppUser } from "@/hooks/useAppUser";
import { AppButton, AppLink, Screen } from "@/app/components/AppUI";

export function AuthScreen() {
  const { signIn, signUp, profile } = useAppUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState(profile.email || "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(profile.name || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    setError("");
    try {
      if (mode === "login") await signIn(email, password);
      else await signUp(email, password, name);
      navigate("/app", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen className="flex min-h-full flex-col pb-8 pt-12">
      <p className="text-center font-display text-xs tracking-[0.3em] text-[#D6AE57]">VEDIC ASTROLOGY</p>
      <h1 className="mt-4 text-center font-serif text-4xl">
        {mode === "login" ? "Welcome back" : "Create account"}
      </h1>
      <p className="mt-2 text-center text-sm text-[#F3D899]/70">
        Your session stays on this device and in a secure account.
      </p>
      <form
        className="mt-8 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        {mode === "signup" && (
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
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </AppButton>
      </form>
      <button
        type="button"
        className="mt-4 min-h-11 w-full text-sm text-[#F3D899]/80"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
      <div className="mt-auto pt-6">
        <AppLink to="/app" variant="ghost" block>
          Continue as guest
        </AppLink>
      </div>
    </Screen>
  );
}
