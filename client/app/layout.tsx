import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import ModalsProvider from "@/providers/ModalsProvider";
import SocketProvider from "@/providers/SocketProvider";
import SonnerProvider from "@/providers/SonnerProvider";
import AuthProvider from "@/providers/AuthProvider";
import ProfileProvider from "@/providers/ProfileProvider";

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
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
    <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ReduxProvider>
            <SocketProvider>
              <ModalsProvider>
                <SonnerProvider>
                  <AuthProvider>
                    <ProfileProvider>
                      {children}
                    </ProfileProvider>
                  </AuthProvider>
                </SonnerProvider>
              </ModalsProvider>
            </SocketProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
// SyncGrid_Database