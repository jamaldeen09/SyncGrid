import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/ReduxProvider";
import ContextsProvider from "@/providers/ContextsProvider";
import SonnerProvider from "@/providers/SonnerProvider";

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyncGrid — Real-Time Tic-Tac-Toe",
  description:
    "SyncGrid is a real-time multiplayer Tic-Tac-Toe game. Create or join matches, play live against others, and spectate ongoing games directly in the browser.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={figtree.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ContextsProvider>
            <SonnerProvider>
              {children}
            </SonnerProvider>
          </ContextsProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
