import React from "react";

// Component props
interface PreferenceSelectorSectionProps {
    preference: "X" | "O";
    setPreference: React.Dispatch<React.SetStateAction<"X" | "O">>
}

const PreferenceSelectorSection = ({
    preference,
    setPreference
}: PreferenceSelectorSectionProps): React.ReactElement => {
    return (
        <section className="flex-1 flex flex-col items-center justify-center p-12 bg-white border-r border-zinc-200">
            <p className="text-[10px] font-bold text-zinc-400 tracking-[0.3em] uppercase mb-16">
                Pick Your Side
            </p>

            <div className="flex flex-col gap-4">
                {/* ===== Preference X ===== */}
                <button
                    onClick={() => setPreference("X")}
                    className={`text-[12rem] font-black leading-none transition-all duration-300 hover:scale-105 active:scale-95 
                    ${preference === "X"
                            ? "text-emerald-500"
                            : "text-zinc-100 hover:text-zinc-300"}`}
                >
                    X
                </button>

                {/* ===== Preference O ===== */}
                <button
                    onClick={() => setPreference("O")}
                    className={`text-[12rem] font-black leading-none transition-all duration-300 hover:scale-105 active:scale-95 
                    ${preference === "O"
                            ? "text-emerald-500"
                            : "text-zinc-100 hover:text-zinc-300"}`}
                >
                    O
                </button>
            </div>
        </section>
    );
};

export default PreferenceSelectorSection;