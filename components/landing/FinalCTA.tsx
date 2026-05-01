"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { CompassDial, CompassNeedle, RadialRays } from "./icons/compass-graphics";
import { ArrowRight } from "./icons/nav-icons";

export default function FinalCTA() {
  const [angle, setAngle] = useState(45);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = 0, end = 135, dur = 2200;
          const t0 = performance.now();
          const tick = (now: number) => {
            const k = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - k, 4);
            setAngle(start + (end - start) * eased + Math.sin(k * Math.PI * 4) * 30 * (1 - k));
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="lp-section-pad" id="cta" ref={ref} style={{ position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(1100px, 110vw)", aspectRatio: "1/1", opacity: 0.5,
        pointerEvents: "none",
      }}>
        <RadialRays count={64} opacity={0.18} />
        <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <circle cx="50" cy="50" r="30" fill="none" stroke="var(--ink)" strokeWidth="0.06" opacity="0.4" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--ink)" strokeWidth="0.06" opacity="0.3" />
          <circle cx="50" cy="50" r="48" fill="none" stroke="var(--ink)" strokeWidth="0.06" opacity="0.2" />
        </svg>
      </div>

      <div className="lp-container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center", position: "relative", padding: "60px 40px" }}>
          {/* Big background compass */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%,-50%)",
            width: "min(420px, 85vw)", aspectRatio: "1/1",
            zIndex: 0, opacity: 0.85, pointerEvents: "none",
          }}>
            <CompassDial style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            <div style={{
              position: "absolute", inset: 0,
              transform: `rotate(${angle}deg)`,
              transformOrigin: "50% 50%",
              transition: "transform 0.05s linear",
            }}>
              <CompassNeedle length={32} width={5}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            </div>
          </div>

          {/* Foreground content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="lp-eyebrow" style={{ marginBottom: 16 }}>— ОТПРАВЛЕНИЕ —</div>
            <h2 className="lp-display" style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              margin: "0 0 18px", letterSpacing: "-0.025em",
            }}>
              Готовы<br />держать курс?
            </h2>
            <p style={{ color: "var(--ink-2)", fontSize: 18, maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.5 }}>
              Создайте аккаунт за 30 секунд — через email или номер телефона. Бесплатно, без рекламы, без подписки.
            </p>
            <Link
              href="/login"
              className="lp-btn lp-btn-primary"
              style={{ padding: "18px 28px", fontSize: 16, position: "relative" }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
                e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
              }}
            >
              Создать аккаунт <ArrowRight size={18} />
            </Link>
            <div className="lp-mono" style={{ marginTop: 24, fontSize: 11, color: "var(--muted)", letterSpacing: ".2em" }}>
              EMAIL · TELEGRAM · GITHUB
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
