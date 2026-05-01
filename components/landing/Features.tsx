"use client";

import React, { useRef, useEffect, useState } from "react";
import { ChartGrid, CompassDial, CompassNeedle, RadialRays } from "./icons/compass-graphics";
import { Bullet } from "./icons/nav-icons";

// ── Feature 1: Priorities compass ─────────────────────────────────────────
function FeaturePriorities() {
  const [angle, setAngle] = useState(-50);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const start = -50, end = -36, total = 1400;
          const startTime = performance.now();
          const tick = (now: number) => {
            const k = Math.min(1, (now - startTime) / total);
            const eased = 1 - Math.pow(1 - k, 3);
            const overshoot = Math.sin(k * Math.PI * 2) * 90 * (1 - k);
            setAngle(start + (end - start) * eased + overshoot);
            if (k < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const tasks = [
    { angle: -36, label: "Отчёт Q2", urgency: "urgent" },
    { angle: 30, label: "Созвон", urgency: "soon" },
    { angle: 100, label: "Стоматолог", urgency: "later" },
    { angle: 180, label: "Книга", urgency: "ever" },
    { angle: 250, label: "Зарядка", urgency: "soon" },
    { angle: 310, label: "Аренда", urgency: "later" },
  ];

  const urgencyColor = (u: string) =>
    u === "urgent" ? "var(--rose)" : u === "soon" ? "var(--brass)" : "var(--muted)";

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", maxWidth: 480, height: 480, margin: "0 auto" }}>
      <ChartGrid opacity={0.4} lat={10} lon={10} />
      <CompassDial style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />

      <div className="lp-mono" style={{ position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)", fontSize: 9, letterSpacing: ".25em", color: "var(--rose)" }}>СРОЧНО</div>
      <div className="lp-mono" style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%) rotate(90deg)", fontSize: 9, letterSpacing: ".25em", color: "var(--brass)" }}>СКОРО</div>
      <div className="lp-mono" style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", fontSize: 9, letterSpacing: ".25em", color: "var(--muted)" }}>ПОТОМ</div>
      <div className="lp-mono" style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%) rotate(-90deg)", fontSize: 9, letterSpacing: ".25em", color: "var(--steel)" }}>ОЖИДАЕТ</div>

      <div style={{
        position: "absolute", inset: 0,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "50% 50%",
        transition: "transform 0.05s linear",
      }}>
        <CompassNeedle style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      </div>

      {tasks.map((t, i) => {
        const a = ((t.angle - 90) * Math.PI) / 180;
        const r = 36;
        const x = 50 + r * Math.cos(a);
        const y = 50 + r * Math.sin(a);
        const color = urgencyColor(t.urgency);
        return (
          <div key={i} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}>
            <div style={{
              width: 12, height: 12, borderRadius: "50%",
              background: color,
              boxShadow: t.urgency === "urgent" ? `0 0 0 6px color-mix(in oklab, ${color} 30%, transparent)` : "none",
            }} />
          </div>
        );
      })}

      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
        width: "30%", aspectRatio: "1/1", borderRadius: "50%",
        background: "color-mix(in oklab, var(--bg) 92%, white 8%)",
        border: "1px solid var(--line-soft)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "0 8px",
      }}>
        <div className="lp-mono" style={{ fontSize: 9, color: "var(--muted)", letterSpacing: ".2em" }}>СЕЙЧАС ВАЖНО</div>
        <div className="lp-display" style={{ fontSize: 18, fontWeight: 500, marginTop: 4 }}>Отчёт Q2</div>
        <div className="lp-mono" style={{ fontSize: 10, color: "var(--rose)", marginTop: 2 }}>через 4ч 12м</div>
      </div>
    </div>
  );
}

// ── Feature 2: Eisenhower matrix ───────────────────────────────────────────
type QuadrantKey = "N" | "E" | "S" | "W";

interface Task { id: string; t: string; tag: string; }

function FeatureMatrix() {
  const [tasks, setTasks] = useState<Record<QuadrantKey, Task[]>>({
    N: [{ id: "a", t: "Отчёт Q2", tag: "work" }, { id: "b", t: "Звонок клиенту", tag: "work" }],
    E: [{ id: "c", t: "Стратегия найма", tag: "work" }, { id: "d", t: "Зарядка", tag: "life" }],
    S: [{ id: "e", t: "Ответы на письма", tag: "work" }],
    W: [{ id: "f", t: "Соц. сети", tag: "life" }],
  });
  const [drag, setDrag] = useState<{ id: string; from: QuadrantKey } | null>(null);

  const labels: Record<QuadrantKey, { name: string; desc: string; color: string }> = {
    N: { name: "СРОЧНО · ВАЖНО", desc: "Делать сейчас", color: "var(--rose)" },
    E: { name: "ВАЖНО · НЕ СРОЧНО", desc: "Запланировать", color: "var(--steel)" },
    S: { name: "СРОЧНО · НЕ ВАЖНО", desc: "Делегировать", color: "var(--brass)" },
    W: { name: "НЕ ВАЖНО · НЕ СРОЧНО", desc: "Исключить", color: "var(--muted)" },
  };

  const onDrop = (target: QuadrantKey) => {
    if (!drag) return;
    setTasks((prev) => {
      const next = { N: [...prev.N], E: [...prev.E], S: [...prev.S], W: [...prev.W] };
      next[drag.from] = next[drag.from].filter((x) => x.id !== drag.id);
      const item = prev[drag.from].find((x) => x.id === drag.id);
      if (item) next[target] = [...next[target], item];
      return next;
    });
    setDrag(null);
  };

  const Quadrant = ({ k, gridArea }: { k: QuadrantKey; gridArea: string }) => {
    const L = labels[k];
    return (
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDrop(k)}
        style={{
          gridArea,
          position: "relative", padding: "18px 16px",
          background: "color-mix(in oklab, var(--bg) 96%, transparent)",
          border: "1px solid var(--line-soft)",
          borderRadius: 12, minHeight: 130,
          display: "flex", flexDirection: "column", gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
          <div className="lp-mono" style={{ fontSize: 9.5, letterSpacing: ".2em", color: L.color }}>{L.name}</div>
          <div className="lp-mono" style={{ fontSize: 12, color: L.color, fontWeight: 600 }}>{k}</div>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{L.desc}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {tasks[k].map((t) => (
            <div key={t.id} draggable onDragStart={() => setDrag({ id: t.id, from: k })}
              style={{
                padding: "8px 10px",
                background: "var(--bg)", border: "1px solid var(--line-soft)",
                borderRadius: 8, fontSize: 13.5, cursor: "grab",
                display: "flex", alignItems: "center", gap: 8,
                opacity: drag && drag.id === t.id ? 0.4 : 1,
              }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.tag === "work" ? "var(--steel)" : "var(--brass)", flexShrink: 0 }} />
              {t.t}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 480, height: 480, margin: "0 auto" }}>
      <div style={{ position: "absolute", inset: -40, opacity: 0.35 }}>
        <RadialRays count={48} opacity={0.25} />
      </div>
      <div style={{
        position: "relative", display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateAreas: '"n e" "w s"',
        gap: 12, padding: 24,
        background: "color-mix(in oklab, var(--bg) 92%, white 8%)",
        border: "1px solid var(--line-soft)",
        borderRadius: 18,
      }}>
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)",
          width: 44, height: 44, borderRadius: "50%",
          background: "var(--bg)", border: "1px solid var(--line-soft)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5,
        }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--brass)", boxShadow: "0 0 0 4px var(--bg)" }} />
        </div>
        <Quadrant k="N" gridArea="n" />
        <Quadrant k="E" gridArea="e" />
        <Quadrant k="W" gridArea="w" />
        <Quadrant k="S" gridArea="s" />
      </div>
      <div style={{ textAlign: "center", marginTop: 14 }}>
        <span className="lp-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".15em" }}>
          ↑ перетаскивайте задачи между сторонами света
        </span>
      </div>
    </div>
  );
}

// ── Feature 3: Category mini-compasses ────────────────────────────────────
function FeatureCategories() {
  const [hover, setHover] = useState<string | null>(null);
  const cats = [
    { id: "work", name: "Работа", color: "var(--steel)", count: 12, angle: 22 },
    { id: "life", name: "Личное", color: "#3a8d52", count: 7, angle: -45 },
    { id: "fam", name: "Семья", color: "#a44b8a", count: 4, angle: 80 },
    { id: "study", name: "Учёба", color: "var(--brass)", count: 9, angle: -110 },
  ];

  return (
    <div style={{
      position: "relative", display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 24, width: "100%", maxWidth: 480, margin: "0 auto",
    }}>
      {cats.map((c, i) => {
        const isHover = hover === c.id;
        return (
          <div key={c.id}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              position: "relative", aspectRatio: "1/1", padding: 14,
              borderRadius: 16,
              background: "color-mix(in oklab, var(--bg) 94%, white 6%)",
              border: "1px solid var(--line-soft)",
              transform: isHover ? "translateY(-6px) scale(1.03)" : "none",
              boxShadow: isHover
                ? `0 24px 48px -24px color-mix(in oklab, ${c.color} 60%, transparent)`
                : "0 1px 0 var(--line-faint)",
              transition: "transform .35s, box-shadow .35s",
              zIndex: isHover ? 5 : 1,
              cursor: "pointer",
            }}>
            <div style={{ position: "absolute", inset: 14 }}>
              <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <circle cx="50" cy="50" r="44" fill="none" stroke={c.color} strokeWidth="0.4" opacity="0.4" />
                <circle cx="50" cy="50" r="34" fill="none" stroke={c.color} strokeWidth="0.3" opacity="0.3" />
                <circle cx="50" cy="50" r="24" fill="none" stroke={c.color} strokeWidth="0.25" opacity="0.2" />
                {Array.from({ length: 24 }).map((_, k) => {
                  const a = (k * 15 * Math.PI) / 180;
                  return <line key={k}
                    x1={50 + 45 * Math.cos(a)} y1={50 + 45 * Math.sin(a)}
                    x2={50 + 42 * Math.cos(a)} y2={50 + 42 * Math.sin(a)}
                    stroke={c.color} strokeWidth="0.3" opacity="0.4" />;
                })}
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                transform: `rotate(${isHover ? c.angle - 30 : c.angle}deg)`,
                transition: "transform 1s cubic-bezier(.5,1.6,.4,1)",
              }}>
                <svg viewBox="0 0 100 100" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  <polygon points="50,16 47,50 53,50" fill={c.color} />
                  <polygon points="50,84 47,50 53,50" fill={c.color} opacity="0.3" />
                  <circle cx="50" cy="50" r="2.5" fill={c.color} />
                </svg>
              </div>
            </div>
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", height: "100%" }}>
              <div>
                <div className="lp-display" style={{ fontSize: 20, fontWeight: 500, color: c.color }}>{c.name}</div>
                <div className="lp-mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{c.count} задач</div>
              </div>
              <div className="lp-mono" style={{ fontSize: 9, color: c.color, letterSpacing: ".15em" }}>·{String(i + 1).padStart(2, "0")}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main Features wrapper ──────────────────────────────────────────────────
export default function Features() {
  return (
    <div id="features">
      <section className="lp-feature">
        <div className="lp-container lp-feature-grid">
          <div className="lp-feature-text">
            <div className="lp-feature-num">·01 — ПРИОРИТЕТЫ</div>
            <h3 className="lp-display lp-feature-h3">Срочное всегда сверху.</h3>
            <p className="lp-feature-desc">
              Назначайте важность и дедлайны. Compass держит курс на самое срочное — стрелка всегда указывает на задачу, которой пора заняться.
            </p>
            <ul className="lp-arrow-list">
              <li><Bullet /> Автосортировка по сроку и важности</li>
              <li><Bullet /> Цветной индикатор «осталось времени»</li>
              <li><Bullet /> Напоминания за час, день, неделю</li>
            </ul>
          </div>
          <FeaturePriorities />
        </div>
      </section>

      <section className="lp-feature lp-feature-reverse">
        <div className="lp-container lp-feature-grid">
          <FeatureMatrix />
          <div className="lp-feature-text">
            <div className="lp-feature-num">·02 — МАТРИЦА ЭЙЗЕНХАУЭРА</div>
            <h3 className="lp-display lp-feature-h3">Четыре стороны света для ваших дел.</h3>
            <p className="lp-feature-desc">
              Переключайтесь в режим матрицы — задачи раскладываются по четырём румбам срочности и важности. Перетаскивайте между квадрантами, как точки на карте.
            </p>
            <ul className="lp-arrow-list">
              <li><Bullet /> N — срочно и важно: делать сейчас</li>
              <li><Bullet /> E — важно, не срочно: запланировать</li>
              <li><Bullet /> S — срочно, не важно: делегировать</li>
              <li><Bullet /> W — ни то, ни другое: исключить</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="lp-feature">
        <div className="lp-container lp-feature-grid">
          <div className="lp-feature-text">
            <div className="lp-feature-num">·03 — КАТЕГОРИИ</div>
            <h3 className="lp-display lp-feature-h3">Свой компас для каждой сферы жизни.</h3>
            <p className="lp-feature-desc">
              Разделите рабочее, личное, семью и учёбу — у каждой категории свой цвет и свой циферблат. Один клик — и видна полная картина выбранной сферы.
            </p>
            <ul className="lp-arrow-list">
              <li><Bullet /> Цветовое кодирование для каждой категории</li>
              <li><Bullet /> Фильтр одним нажатием</li>
              <li><Bullet /> Свои настройки приоритетов в каждой</li>
            </ul>
          </div>
          <FeatureCategories />
        </div>
      </section>
    </div>
  );
}
