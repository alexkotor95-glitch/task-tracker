import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Таск-трекер",
  description: "Простой и удобный трекер задач",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 min-h-screen">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
