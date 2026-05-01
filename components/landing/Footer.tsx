import Link from "next/link";
import { CompassRose, BrandMark } from "./icons/compass-graphics";
import { Github } from "./icons/nav-icons";

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
          <div>
            <CompassRose size={140} />
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <BrandMark size={22} />
              <span className="lp-display" style={{ fontSize: 20, fontWeight: 500 }}>Compass</span>
            </div>
            <p className="lp-mono" style={{ fontSize: 11, color: "var(--muted)", letterSpacing: ".15em", marginTop: 6 }}>
              ШИРОТА · ДОЛГОТА · ВРЕМЯ
            </p>
          </div>

          <div>
            <div className="lp-footer-cardinals">
              <div className="lp-fc lp-fc-n">
                <strong>N · ПРОДУКТ</strong>
                <a href="#features">Возможности</a>
                <a href="#journey">Как это работает</a>
                <a href="#compare">Сравнение</a>
              </div>
              <div className="lp-fc lp-fc-w">
                <strong>W · СВЯЗЬ</strong>
                <a href="https://github.com/alexkotor95-glitch/task-tracker" target="_blank" rel="noopener noreferrer">
                  <Github size={14} /> GitHub
                </a>
                <a href="#">Telegram</a>
                <a href="mailto:#">Почта</a>
              </div>
              <div className="lp-fc lp-fc-c">
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--brass)", color: "var(--bg)",
                  fontFamily: "var(--font-display)", fontWeight: 600,
                }}>C</span>
              </div>
              <div className="lp-fc lp-fc-e">
                <strong>E · ПРАВО</strong>
                <a href="#">Конфиденциальность</a>
                <a href="#">Условия</a>
                <a href="#">Лицензия</a>
              </div>
              <div className="lp-fc lp-fc-s">
                <strong>S · РЕСУРСЫ</strong>
                <Link href="/app">Приложение</Link>
                <Link href="/login">Войти</Link>
                <Link href="/login">Создать аккаунт</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <span>© 2026 Compass · Бесплатно навсегда</span>
          <span>v2.0 · Сделано с расстановкой</span>
        </div>
      </div>
    </footer>
  );
}
