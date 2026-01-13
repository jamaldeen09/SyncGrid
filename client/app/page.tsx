"use client"
import ActionCardsSection from "@/components/main-page/ActionCardsSection";
import HeroSection from "@/components/main-page/HeroSection";
import Navbar from "@/components/main-page/Navbar";
import PublicGamesSection from "@/components/main-page/PublicGamesSection";
import StatsSection from "@/components/main-page/StatsSection";
import AuthProvider from "@/providers/AuthProvider";
import ProfileProvider from "@/providers/ProfileProvider";

const MainPage = (): React.ReactElement => {
  return (
    <AuthProvider>
      <ProfileProvider>
        <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10 text-foreground">
          {/* ===== Navbar ===== */}
          <Navbar />

          {/* ===== Main content ===== */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Hero section */}
            <HeroSection />

            {/* Action cards section */}
            <ActionCardsSection />

            {/* Public games section */}
            <PublicGamesSection />

            {/* Stats section */}
            <StatsSection />
          </main>
        </div>
      </ProfileProvider>
    </AuthProvider>
  );
};

export default MainPage;