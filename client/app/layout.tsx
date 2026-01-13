import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ContextsProvider from "@/providers/ContextsProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import ModalsProvider from "@/providers/ModalsProvider";
import SocketProvider from "@/providers/SocketProvider";
import SonnerProvider from "@/providers/SonnerProvider";


// ===== Fonts ===== \\
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ===== Metadata ===== \\
export const metadata: Metadata = {
  title: "SyncGrid — Real-Time Tic-Tac-Toe",
  description:
    "SyncGrid is a real-time multiplayer Tic-Tac-Toe game. Create or join matches, play live against others, and spectate ongoing games directly in the browser.",
};

// ===== Root layout ===== \\
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ReduxProvider>
            <SonnerProvider>
              <ContextsProvider>
                <SocketProvider>
                  <ModalsProvider>
                    {children}
                  </ModalsProvider>
                </SocketProvider>
              </ContextsProvider>
            </SonnerProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
