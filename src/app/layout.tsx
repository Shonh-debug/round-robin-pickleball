import type { Metadata } from "next";
import { Hanken_Grotesk, Lexend, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { TournamentProvider } from "@/lib/tournament-context";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/next"

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rockii Pickleball | Round Robin Tournament Manager",
  description:
    "Organize your round robin pickleball tournaments with ease. Add players, generate schedules, track scores, and export results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${hankenGrotesk.variable} ${lexend.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        {/* Material Symbols Outlined */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased bg-background text-on-background font-body">
        <TournamentProvider>
          <Header />
          {children}
        </TournamentProvider>
        <Analytics />
      </body>
    </html>
  );
}
