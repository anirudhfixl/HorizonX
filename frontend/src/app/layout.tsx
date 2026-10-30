import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProMiners — Web3 Token & Launchpad Ecosystem",
  description:
    "Decentralized platform for token creation, discovery, fair launches, presales, airdrop campaigns, and staking pools.",
  keywords: [
    "Web3",
    "Token Creation",
    "Launchpad",
    "Presale",
    "Fair Launch",
    "Airdrop",
    "Staking",
    "Crypto",
    "DeFi",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
