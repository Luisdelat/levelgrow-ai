import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEVELGROW AI - Marketing Automation",
  description: "AI-powered marketing assistant based on HTA methodology",
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
