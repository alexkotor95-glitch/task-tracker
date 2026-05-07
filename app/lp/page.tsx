import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Закрывай день зная, что ничего не потерялось — Compass",
  description:
    "Когда задачи теряются между чатами и заметками, день уходит в никуда. Compass — трекер задач для фрилансеров: добавил, сделал, закрыл день с покоем.",
  openGraph: {
    title: "Compass — трекер задач без лишнего",
    description:
      "Когда задачи теряются между чатами и заметками, день уходит в никуда. Compass — трекер задач для фрилансеров: добавил, сделал, закрыл день с покоем.",
    type: "website",
  },
};

export default function LpPage() {
  return (
    <div className="lp-page">
      <main style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section style={{ padding: "96px 0 72px", textAlign: "center" }}>
          <p className="lp-eyebrow" style={{ marginBottom: 20 }}>
            трекер задач для фрилансеров
          </p>
          <h1
            className="lp-display"
            style={{
              fontSize: "clamp(32px, 6vw, 56px)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              margin: "0 0 20px",
            }}
          >
            Закрывай день зная,<br />что ничего не потерялось
          </h1>
          <p
            style={{
              fontSize: 18,
              color: "var(--ink-2)",
              lineHeight: 1.6,
              margin: "0 0 36px",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Один экран вместо чатов, заметок и головы — брось задачу, сделай, поставь галочку.
          </p>
          <Link href="/login" className="lp-btn lp-btn-primary" style={{ padding: "16px 32px", fontSize: 16 }}>
            Начать сегодня — бесплатно
          </Link>
        </section>

        <hr style={{ border: "none", borderTop: "1px solid var(--line-soft)", margin: "0 0 72px" }} />

        {/* ── PUSH ──────────────────────────────────────────────── */}
        <section style={{ marginBottom: 72 }}>
          <h2 className="lp-display" style={{ fontSize: 28, marginBottom: 20 }}>
            Узнаёшь этот вечер?
          </h2>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
            Рабочий день закончился. Ты сделал что-то важное — но что именно, уже не помнишь.
            Задача, которую обещал сделать утром, осталась в чате трёхдневной давности.
            Открываешь заметки — там список, которому три недели. Закрываешь.
            Идёшь спать с ощущением «а вдруг что-то важное ушло мимо».
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
            <strong style={{ color: "var(--ink)" }}>Знакомо?</strong>
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7 }}>
            Это не лень и не плохая память. Так и происходит, когда задачи живут в пяти разных местах одновременно.
          </p>
        </section>

        {/* ── PULL ──────────────────────────────────────────────── */}
        <section
          style={{
            marginBottom: 72,
            background: "var(--surface)",
            border: "1px solid var(--line-soft)",
            borderRadius: 12,
            padding: "40px 40px",
          }}
        >
          <h2 className="lp-display" style={{ fontSize: 28, marginBottom: 20 }}>
            Так может быть иначе
          </h2>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
            Конец дня. Открываешь один экран. Видишь: три задачи закрыты, одна осталась.
            Нажимаешь галочку — она уходит в завтра. Закрываешь ноутбук.
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
            Без чувства, что день прошёл мимо. Без тревоги «что-то потерял».
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7 }}>
            Это не про продуктивность. Это про то, чтобы голова не работала после 19:00.
          </p>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────── */}
        <section style={{ marginBottom: 72 }}>
          <h2 className="lp-display" style={{ fontSize: 28, marginBottom: 20 }}>
            Как это работает
          </h2>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 20 }}>
            <strong style={{ color: "var(--ink)" }}>Compass — трекер задач без лишнего.</strong>
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 20 }}>
            Открыл → написал задачу → сделал → поставил галочку.
            Фильтр «сделано / не сделано» покажет итог дня одним взглядом.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["Нет проектов.", "Нет тегов.", "Нет настроек.", "Только задачи — и покой в конце дня."].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "var(--ink-2)",
                  fontSize: 16,
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--brass)", flexShrink: 0,
                }} />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* ── PROOF ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: 72 }}>
          <h2 className="lp-display" style={{ fontSize: 28, marginBottom: 24 }}>
            Что говорят те, кто попробовал
          </h2>
          <blockquote
            style={{
              margin: "0 0 20px",
              padding: "24px 28px",
              borderLeft: "3px solid var(--brass)",
              background: "var(--surface)",
              borderRadius: "0 8px 8px 0",
              fontStyle: "italic",
              color: "var(--ink-2)",
              lineHeight: 1.7,
            }}
          >
            «Наконец-то перестал вести список в телеграме самому себе.»
            <br />
            <span
              className="lp-mono"
              style={{ fontSize: 12, letterSpacing: ".1em", color: "var(--muted)", fontStyle: "normal", marginTop: 8, display: "block" }}
            >
              — TODO: имя / ник первого пользователя
            </span>
          </blockquote>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7 }}>
            Compass уже используют фрилансеры, которым нужно одно место для задач —
            без подписки и без регистрации на 10 экранов.
          </p>
        </section>

        {/* ── ANXIETY ───────────────────────────────────────────── */}
        <section
          style={{
            marginBottom: 72,
            background: "var(--surface)",
            border: "1px solid var(--line-soft)",
            borderRadius: 12,
            padding: "40px 40px",
          }}
        >
          <h2 className="lp-display" style={{ fontSize: 28, marginBottom: 20 }}>
            Это займёт 30 секунд
          </h2>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
            Думаешь: «попробую — брошу через неделю, как Notion».
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 16 }}>
            Здесь нечего настраивать. Нет онбординга. Нет обучения.
            Открыл страницу — уже работает. Авторизация через Telegram или email — 30 секунд.
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7 }}>
            Если уйдёшь — ничего не потеряешь. Если останешься — задачи будут там, где ты их оставил.
          </p>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section style={{ marginBottom: 72 }}>
          <h2 className="lp-display" style={{ fontSize: 28, marginBottom: 32 }}>
            Вопросы
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              {
                q: "У меня уже есть Notion. Зачем ещё один инструмент?",
                a: "Notion — это мастерская. Compass — блокнот на столе. Одно не мешает другому. Notion для проектов, Compass — для того, что нужно сделать сегодня.",
              },
              {
                q: "Мои задачи сохранятся? Что если сервис закроется?",
                a: "Данные хранятся в базе, привязанной к твоему аккаунту. Экспорт задач — в планах. Здесь нет ничего необратимого.",
              },
              {
                q: "Почему не Todoist или Apple Reminders?",
                a: "Подойдут, если нужны приоритеты, проекты, теги и интеграции. Compass — для тех, кому всё это мешает начать. Меньше выборов → больше сделано.",
              },
              {
                q: "Это бесплатно? Есть платные тарифы?",
                a: "Бесплатно и без рекламы. Платных тарифов нет.",
              },
              {
                q: "Работает на телефоне?",
                a: "Да, работает в мобильном браузере. Приложения в App Store пока нет.",
              },
            ].map(({ q, a }, i, arr) => (
              <div
                key={q}
                style={{
                  padding: "24px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--line-faint)" : "none",
                }}
              >
                <p style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 8, lineHeight: 1.5 }}>
                  {q}
                </p>
                <p style={{ color: "var(--ink-2)", lineHeight: 1.7, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────── */}
        <section style={{ textAlign: "center", padding: "48px 0 0" }}>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 8 }}>
            Попробуй сегодня вечером.
          </p>
          <p style={{ color: "var(--ink-2)", lineHeight: 1.7, marginBottom: 32 }}>
            Добавь три задачи на завтра — и закрой день с чистой головой.
          </p>
          <Link href="/login" className="lp-btn lp-btn-primary" style={{ padding: "16px 32px", fontSize: 16 }}>
            Открыть Compass — бесплатно
          </Link>
          <p className="lp-mono" style={{ marginTop: 20, fontSize: 11, color: "var(--muted)", letterSpacing: ".15em" }}>
            БЕСПЛАТНО · БЕЗ РЕКЛАМЫ · БЕЗ ПОДПИСКИ
          </p>
        </section>

      </main>
    </div>
  );
}
