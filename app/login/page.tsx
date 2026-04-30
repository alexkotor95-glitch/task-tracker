"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthTab  = "email-login" | "email-register" | "phone";
type PhoneStep = "input" | "code";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPhone(raw: string): string {
  // Keep only + and digits
  return raw.replace(/[^\d+]/g, "");
}

// ─── Small reusable components ────────────────────────────────────────────────

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
      <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 16 16">
        <path d="M8 5v4M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <p className="text-xs text-red-600">{msg}</p>
    </div>
  );
}

function SubmitBtn({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 mt-1"
    >
      {loading ? loadingLabel : label}
    </button>
  );
}

// ─── Email form ───────────────────────────────────────────────────────────────

function EmailForm({ mode, onSwitch }: { mode: "login" | "register"; onSwitch: () => void }) {
  const router = useRouter();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (password !== password2) { setError("Пароли не совпадают"); return; }
      if (password.length < 6)    { setError("Пароль минимум 6 символов"); return; }

      setLoading(true);
      const res  = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) { setError(data.error || "Ошибка регистрации"); return; }
    }

    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (res?.error) { setError("Неверный email или пароль"); }
    else { router.push("/"); router.refresh(); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === "register" && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Имя <span className="text-gray-400 font-normal">(необязательно)</span>
          </label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Иван Иванов" autoComplete="name"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
        <input
          type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com" required autoComplete="email"
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Пароль</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••" required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
        />
        {mode === "register" && <p className="text-[11px] text-gray-400 mt-1">Минимум 6 символов</p>}
      </div>

      {mode === "register" && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Повторите пароль</label>
          <input
            type="password" value={password2} onChange={(e) => setPassword2(e.target.value)}
            placeholder="••••••••" required autoComplete="new-password"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
        </div>
      )}

      {error && <ErrorBox msg={error} />}

      <SubmitBtn
        loading={loading}
        label={mode === "login" ? "Войти" : "Зарегистрироваться"}
        loadingLabel={mode === "login" ? "Входим..." : "Создаём аккаунт..."}
      />

      <p className="text-center text-xs text-gray-400">
        {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
        <button type="button" onClick={onSwitch} className="text-gray-700 hover:underline font-medium">
          {mode === "login" ? "Зарегистрироваться" : "Войти"}
        </button>
      </p>
    </form>
  );
}

// ─── Phone form ───────────────────────────────────────────────────────────────

const RESEND_TIMEOUT = 60; // seconds

function PhoneForm() {
  const router = useRouter();

  const [step, setStep]       = useState<PhoneStep>("input");
  const [phone, setPhone]     = useState("");
  const [code, setCode]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (resendIn <= 0) return;
    timerRef.current = setInterval(() => {
      setResendIn((v) => {
        if (v <= 1) { clearInterval(timerRef.current!); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [resendIn]);

  // Auto-focus code input when step changes
  useEffect(() => {
    if (step === "code") setTimeout(() => codeRef.current?.focus(), 80);
  }, [step]);

  async function sendCode() {
    setError("");
    const cleaned = phone.trim();

    if (!cleaned) { setError("Введите номер телефона"); return; }
    if (!/^\+[1-9]\d{6,14}$/.test(cleaned)) {
      setError("Неверный формат. Пример: +79001234567");
      return;
    }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/phone/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleaned }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка отправки");
        if (res.status === 429 && data.retryAfter) setResendIn(data.retryAfter);
      } else {
        setStep("code");
        setResendIn(RESEND_TIMEOUT);
      }
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!code.trim()) { setError("Введите код"); return; }

    setLoading(true);
    try {
      const res  = await fetch("/api/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка проверки кода");
        if (data.status === "code_max_attempts_exceeded" || data.status === "expired") {
          setStep("input");
          setCode("");
        }
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Нет связи с сервером");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 1: phone input ──────────────────────────────────────────────────
  if (step === "input") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Номер телефона
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            onKeyDown={(e) => e.key === "Enter" && sendCode()}
            placeholder="+79001234567"
            autoComplete="tel"
            inputMode="tel"
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
          <p className="text-[11px] text-gray-400 mt-1">
            Формат E.164 — с кодом страны, например <span className="font-mono">+79001234567</span>
          </p>
        </div>

        {error && <ErrorBox msg={error} />}

        <button
          type="button"
          disabled={loading || resendIn > 0}
          onClick={sendCode}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
        >
          {/* Telegram icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.1 13.415l-2.963-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.05.144z"/>
          </svg>
          {loading ? "Отправляем..." : resendIn > 0 ? `Повторить через ${resendIn} с` : "Получить код"}
        </button>

        <p className="text-center text-[11px] text-gray-400">
          Код придёт через Telegram на указанный номер
        </p>
      </div>
    );
  }

  // ── Step 2: code input ───────────────────────────────────────────────────
  return (
    <form onSubmit={verifyCode} className="flex flex-col gap-4">
      {/* Back */}
      <button
        type="button"
        onClick={() => { setStep("input"); setCode(""); setError(""); }}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors self-start"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Изменить номер
      </button>

      <div>
        <p className="text-xs text-gray-500 mb-3">
          Код отправлен на{" "}
          <span className="font-semibold text-gray-800 font-mono">{phone}</span>
          {" "}через Telegram
        </p>
        <label className="block text-xs font-medium text-gray-700 mb-1.5">Код подтверждения</label>
        <input
          ref={codeRef}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="· · · · · ·"
          autoComplete="one-time-code"
          className="w-full px-3 py-3 rounded-xl border border-gray-200 text-lg tracking-[0.5em] text-center text-gray-800 placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-mono"
        />
      </div>

      {error && <ErrorBox msg={error} />}

      <SubmitBtn loading={loading} label="Подтвердить" loadingLabel="Проверяем..." />

      <div className="text-center">
        <button
          type="button"
          disabled={resendIn > 0 || loading}
          onClick={() => { setCode(""); setError(""); setStep("input"); }}
          className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {resendIn > 0 ? `Отправить повторно через ${resendIn} с` : "Отправить код повторно"}
        </button>
      </div>
    </form>
  );
}

// ─── Root page ────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const [tab, setTab] = useState<AuthTab>("email-login");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-2xl mb-4 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Task Tracker</h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-4">
          <button
            onClick={() => setTab("email-login")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
              tab === "email-login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Войти
          </button>
          <button
            onClick={() => setTab("email-register")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
              tab === "email-register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Регистрация
          </button>
          <button
            onClick={() => setTab("phone")}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1 ${
              tab === "phone" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.1 13.415l-2.963-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.05.144z"/>
            </svg>
            Телефон
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {tab === "email-login" && (
            <EmailForm mode="login"    onSwitch={() => setTab("email-register")} />
          )}
          {tab === "email-register" && (
            <EmailForm mode="register" onSwitch={() => setTab("email-login")} />
          )}
          {tab === "phone" && <PhoneForm />}
        </div>
      </div>
    </div>
  );
}
