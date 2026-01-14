import React from "react";

const HeroSection = (): React.ReactElement => {
    return (
        <section className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                High-Performance <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">Tic-Tac-Toe</span>
            </h1>
            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience seamless, low-latency gameplay. Sign in to track your win streak and compete for the top spot on the leaderboard.
            </p>
        </section>
    );
};

export default HeroSection;