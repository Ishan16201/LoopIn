import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoopIn",
  description: "Hyper-local student ride sharing for campus commutes"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
