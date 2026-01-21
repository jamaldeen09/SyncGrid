"use client"
import React, { useState } from "react";
import PreferenceSelectorSection from "./PreferenceSelectorSection";
import ActionSection from "./ActionSection";

const CoreWorkspace = (): React.ReactElement => {
    // Local states
    const [preference, setPreference] = useState<"X" | "O">("X");

    return (
        <main className="flex-1 flex flex-col lg:flex-row items-stretch">

            {/* Preference Selector */}
            <PreferenceSelectorSection
                preference={preference}
                setPreference={setPreference}
            />

            {/* Action Zone */}
            <ActionSection />
        </main>
    );
};

export default CoreWorkspace;