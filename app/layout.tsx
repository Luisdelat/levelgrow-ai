import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEVELGROW AI - Marketing Automation",
  description: "AI marketing advisor that guides business owners step by step to get clients and sell more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-950 text-white">
        {children}
      </body>
    </html>
  );
}
