"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BrandMark } from "./icons/compass-graphics";
import { ArrowRight, Sun, Moon } from "./icons/nav-icons";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("compass-dark");
    if (saved === "1") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("compass-dark", next ? "1" : "0");
  };

  return (
    <nav className={`lp-nav${scrolled ? " scrolled" : ""}`}>
      <div className="lp-container lp-nav-inner">
        <Link href="/" className="lp-brand">
          <BrandMark size={26} />
          <span>Compass</span>
        </Link>
        <div className="lp-nav-links">
          <a href="#features">Возможности</a>
          <a href="#journey">Как это работает</a>
          <a href="#compare">Сравнение</a>
          <Link href="/login">Войти</Link>
          <button className="lp-theme-toggle" onClick={toggleDark} title="Переключить тему">
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Link href="/login" className="lp-nav-cta">
            Начать бесплатно <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
