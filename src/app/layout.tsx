import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "NDC Hackathon 2026 | Innovation at Notre Dame College",
  description: "Join the most prestigious college hackathon in Bangladesh. Innovate, collaborate, and compete for excellence at Notre Dame College.",
  keywords: ["NDC", "Hackathon", "Notre Dame College", "Programming", "Coding Contest", "Bangladesh"],
  authors: [{ name: "NDC IT Club" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
