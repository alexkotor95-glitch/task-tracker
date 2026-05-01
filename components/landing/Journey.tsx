import { ChartGrid } from "./icons/compass-graphics";

const steps = [
  { n: "01", title: "Добавил задачу", body: "Запишите всё, что висит в голове — название, тег и предполагаемая дата.", flag: "▲" },
  { n: "02", title: "Указал важность и срок", body: "Выберите приоритет и дедлайн. Compass поставит задачу на нужный румб.", flag: "◆" },
  { n: "03", title: "Compass проложил курс", body: "Видите ровно одну следующую задачу. Никакого паралича выбора.", flag: "★" },
];

export default function Journey() {
  return (
    <section className="lp-section-pad" id="journey" style={{ position: "relative", overflow: "hidden" }}>
      <ChartGrid opacity={0.5} lat={20} lon={28} />

      <div className="lp-container" style={{ position: "relative", zIndex: 2 }}>
        <div className="lp-section-head">
          <div className="lp-eyebrow-row">
            <span className="lp-eyebrow">— ПУТЬ —</span>
          </div>
          <h2 className="lp-display" style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(34px, 5vw, 56px)", letterSpacing: "-0.02em", lineHeight: 1.05, margin: "0 0 14px" }}>
            Три отметки до пункта назначения.
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 560, margin: "0 auto", fontSize: 17 }}>
            От пустого списка к выполненной задаче — Compass прокладывает маршрут за вас.
          </p>
        </div>

        <div className="lp-journey-track">
          <svg className="lp-route-svg" viewBox="0 0 1000 360" preserveAspectRatio="none" aria-hidden="true">
            <path d="M 80 280 Q 280 60, 500 200 T 920 100"
              fill="none" stroke="var(--ink)" strokeWidth="1.5"
              strokeDasharray="2 8" opacity="0.5" />
            <g fill="var(--brass)">
              <circle cx="80" cy="280" r="6" />
              <circle cx="500" cy="200" r="6" />
              <circle cx="920" cy="100" r="6" />
            </g>
            <g fontFamily="var(--font-mono)" fontSize="10" fill="var(--muted)">
              <text x="160" y="170">N 32°</text>
              <text x="380" y="100">N 18° E</text>
              <text x="700" y="130">NE 55°</text>
            </g>
          </svg>

          <div className="lp-journey-steps">
            {steps.map((s, i) => (
              <div key={i} className={`lp-js lp-js-${i}`}>
                <div className="lp-js-flag">
                  <div className="lp-js-flag-pole" />
                  <div className="lp-js-flag-banner">
                    <span className="lp-mono">{s.n}</span>
                    <span>{s.flag}</span>
                  </div>
                </div>
                <div className="lp-js-card">
                  <div className="lp-mono" style={{ fontSize: 10, color: "var(--brass)", letterSpacing: ".22em", marginBottom: 8 }}>ОТМЕТКА · {s.n}</div>
                  <h4 className="lp-display" style={{ fontWeight: 500, fontSize: 22, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{s.title}</h4>
                  <p style={{ color: "var(--muted)", fontSize: 14.5, margin: 0, lineHeight: 1.5 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
