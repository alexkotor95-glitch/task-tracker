"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChartGrid, CompassDial, CompassNeedle } from "./icons/compass-graphics";
import { ArrowRight } from "./icons/nav-icons";

const HERO_TASKS = [
  { id: 1, title: "Подготовить квартальный отчёт", tag: "Рабочие", date: "Сегодня", priority: "high", angle: -36 },
  { id: 2, title: "Созвон с командой дизайна", tag: "Рабочие", date: "Сегодня", priority: "high", angle: 12 },
  { id: 3, title: "Записаться к стоматологу", tag: "Личные", date: "Завтра", priority: "med", angle: 56 },
  { id: 4, title: "Подобрать подарок маме", tag: "Личные", date: "15 мая", priority: "low", angle: 110 },
  { id: 5, title: "Прочитать главу книги", tag: "Личные", date: "Когда-нибудь", priority: "low", angle: 180, done: true },
  { id: 6, title: "Зарядка 20 минут", tag: "Личные", date: "Сегодня", priority: "med", angle: 232 },
  { id: 7, title: "Оплатить аренду", tag: "Рабочие", date: "1 июня", priority: "high", angle: 290 },
];

const tagColor = (tag: string) =>
  tag === "Рабочие" ? "var(--steel)" : tag === "Личные" ? "var(--brass)" : "var(--rose)";

function HeroCompass() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(HERO_TASKS[0].angle);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) return;
    const id = setInterval(() => {
      setActiveIdx((i) => {
        const next = (i + 1) % HERO_TASKS.length;
        setNeedleAngle(HERO_TASKS[next].angle);
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, [hovered]);

  const onMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const a = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    setNeedleAngle(a);
    let best = 0, bestD = 9999;
    HERO_TASKS.forEach((t, i) => {
      const d = Math.abs(((a - t.angle + 540) % 360) - 180);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActiveIdx(best);
  };

  const taskPos = (angle: number, r = 38) => {
    const a = ((angle - 90) * Math.PI) / 180;
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  };

  const active = HERO_TASKS[activeIdx];

  return (
    <div
      ref={wrapRef}
      className="lp-hero-compass"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={onMove}
    >
      <ChartGrid opacity={0.55} lat={14} lon={14} withCompassPoints />

      <div style={{ position: "absolute", inset: 0 }}>
        <CompassDial style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>

      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        transform: `rotate(${needleAngle}deg)`,
        transformOrigin: "50% 50%",
        transition: hovered ? "transform 0.06s linear" : "transform 1.6s cubic-bezier(.5,1.6,.4,1)",
      }}>
        <CompassNeedle style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>

      {HERO_TASKS.map((t, i) => {
        const pos = taskPos(t.angle, 38);
        const isActive = i === activeIdx;
        return (
          <div
            key={t.id}
            style={{
              position: "absolute",
              left: `${pos.x}%`, top: `${pos.y}%`,
              transform: `translate(-50%, -50%) scale(${isActive ? 1.2 : 1})`,
              width: 14, height: 14,
              borderRadius: "50%",
              background: t.done ? "var(--bg)" : tagColor(t.tag),
              border: `2px solid ${t.done ? tagColor(t.tag) : "var(--bg)"}`,
              boxShadow: isActive
                ? `0 0 0 6px color-mix(in oklab, ${tagColor(t.tag)} 25%, transparent)`
                : "none",
              transition: "transform .25s, box-shadow .25s",
              opacity: t.done ? 0.6 : 1,
              cursor: "pointer",
              zIndex: 3,
            }}
            onMouseEnter={() => { setActiveIdx(i); setNeedleAngle(t.angle); }}
          />
        );
      })}

      {/* Center card */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%, -50%)",
        width: "44%",
        background: "color-mix(in oklab, var(--bg) 88%, white 12%)",
        border: "1px solid var(--line-soft)",
        borderRadius: 14,
        padding: "14px 14px 12px",
        boxShadow: "0 24px 60px -30px rgba(15,26,44,0.35), 0 2px 6px -2px rgba(15,26,44,0.1)",
        zIndex: 4,
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div className="lp-mono" style={{ fontSize: 9, letterSpacing: ".15em", color: "var(--muted)", textTransform: "uppercase" }}>
            ПРИОРИТЕТ {String(activeIdx + 1).padStart(2, "0")}
          </div>
          <div className="lp-mono" style={{ fontSize: 9, color: "var(--brass)" }}>
            ↑ {Math.round((needleAngle + 360) % 360).toString().padStart(3, "0")}°
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, lineHeight: 1.25, minHeight: "2.5em" }}>
          {active.title}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 8px", borderRadius: 999,
            background: `color-mix(in oklab, ${tagColor(active.tag)} 14%, transparent)`,
            color: tagColor(active.tag),
            fontSize: 10.5, fontWeight: 500,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: tagColor(active.tag) }} />
            {active.tag}
          </span>
          <span className="lp-mono" style={{
            padding: "2px 8px", borderRadius: 999,
            background: "color-mix(in oklab, var(--ink) 6%, transparent)",
            fontSize: 10, color: "var(--ink-2)",
          }}>
            {active.date}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "var(--muted)", marginBottom: 4 }}>
          <span className="lp-mono">25% ВЫПОЛНЕНО</span>
          <span className="lp-mono">3 / {HERO_TASKS.length}</span>
        </div>
        <div style={{ height: 3, background: "var(--line-faint)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "25%", background: "linear-gradient(90deg, var(--steel), var(--brass))" }} />
        </div>
      </div>

      {/* Degree labels */}
      <div className="lp-mono" style={{ position: "absolute", left: "50%", top: -2, transform: "translateX(-50%)", fontSize: 10, color: "var(--brass)", letterSpacing: ".2em" }}>000°</div>
      <div className="lp-mono" style={{ position: "absolute", right: -2, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--brass)" }}>090°</div>
      <div className="lp-mono" style={{ position: "absolute", left: "50%", bottom: -2, transform: "translateX(-50%)", fontSize: 10, color: "var(--brass)" }}>180°</div>
      <div className="lp-mono" style={{ position: "absolute", left: -2, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: "var(--brass)" }}>270°</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="lp-hero" id="hero">
      <div className="lp-container lp-hero-grid">
        <div className="lp-hero-text">
          <div className="lp-hero-badge">
            <span>Бесплатно</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Без рекламы</span>
          </div>

          <h1 className="lp-display lp-hero-h1">
            Задачи,<br />
            которые{" "}
            <span className="lp-arrow-underline">
              делаются
              <svg viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 4 Q 50 8, 95 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M88 1 L95 4 L88 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </h1>

          <p className="lp-lead">
            Compass помогает расставить приоритеты, отследить сроки и видеть полную картину — простой бесплатный таск-трекер, который держит курс.
          </p>

          <div className="lp-hero-ctas">
            <Link
              href="/login"
              className="lp-btn lp-btn-primary"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
                e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
              }}
            >
              Начать бесплатно <ArrowRight />
            </Link>
            <Link href="/login" className="lp-btn lp-btn-ghost">Войти</Link>
          </div>

          <div className="lp-hero-meta">
            <div className="lp-hero-meta-item"><span className="lp-dot" /> Email или Telegram</div>
            <div className="lp-hero-meta-item"><span className="lp-dot" /> Открытый код</div>
            <div className="lp-hero-meta-item"><span className="lp-dot" /> Без трекеров</div>
          </div>
        </div>

        <HeroCompass />
      </div>
    </section>
  );
}
