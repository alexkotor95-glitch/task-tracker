import { Check, Cross } from "./icons/nav-icons";

const rows = [
  { f: "Бесплатно навсегда", us: true, them: "ограниченный план" },
  { f: "Без рекламы", us: true, them: false },
  { f: "Матрица Эйзенхауэра", us: true, them: "за отдельную плату" },
  { f: "Тёмная тема ночного моря", us: true, them: true },
  { f: "Открытый исходный код", us: true, them: false },
  { f: "5 секунд от ссылки до задачи", us: true, them: false },
  { f: "Без AI, бубнящего советы", us: true, them: false },
];

export default function Compare() {
  return (
    <section className="lp-section-pad" id="compare" style={{ position: "relative" }}>
      <div className="lp-container">
        <div className="lp-section-head">
          <div className="lp-eyebrow-row">
            <span className="lp-eyebrow">— БОРТОВОЙ ЖУРНАЛ —</span>
          </div>
          <h2 className="lp-display" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(34px, 5vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 14px" }}>
            Compass и перегруженные таск-менеджеры.
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 560, margin: "0 auto", fontSize: 17 }}>
            Сравнение по тому, что действительно влияет на курс.
          </p>
        </div>

        <div className="lp-logbook">
          <div className="lp-logbook-frame">
            <div className="lp-logbook-corner lp-tl" />
            <div className="lp-logbook-corner lp-tr" />
            <div className="lp-logbook-corner lp-bl" />
            <div className="lp-logbook-corner lp-br" />

            <div className="lp-logbook-header">
              <div className="lp-lh-cell lp-lh-feature">
                <span className="lp-mono">ХАРАКТЕРИСТИКА</span>
              </div>
              <div className="lp-lh-cell lp-lh-us">
                <span className="lp-brand-row">
                  <span className="lp-rose-dot" /> Compass
                </span>
              </div>
              <div className="lp-lh-cell lp-lh-them">
                <span className="lp-mono">ПЕРЕГРУЖЕННЫЕ ТРЕКЕРЫ</span>
              </div>
            </div>

            {rows.map((r, i) => (
              <div key={i} className="lp-logbook-row">
                <div className="lp-lh-cell lp-lh-feature">{r.f}</div>
                <div className="lp-lh-cell lp-lh-us">
                  {r.us ? (
                    <span className="lp-check"><Check size={14} /></span>
                  ) : (
                    <span className="lp-cross"><Cross size={14} /></span>
                  )}
                </div>
                <div className="lp-lh-cell lp-lh-them">
                  {r.them === true ? (
                    <span className="lp-check"><Check size={14} /></span>
                  ) : r.them === false ? (
                    <span className="lp-cross"><Cross size={14} /></span>
                  ) : (
                    <span style={{ color: "var(--muted)", fontStyle: "italic", fontSize: 14 }}>— {r.them}</span>
                  )}
                </div>
              </div>
            ))}

            <div className="lp-logbook-footer">
              <span className="lp-mono">ЖУРНАЛ № 04 · СТРАНИЦА 12</span>
              <span className="lp-mono">КУРС: ВЕРНЫЙ</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
