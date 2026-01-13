"use client"
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";

const ThemeSwitcher = ({ className }: {
    className?: string;
}): React.ReactElement => {
    // useTheme() hook
    const { resolvedTheme, setTheme } = useTheme();
    const isLight = resolvedTheme === "light"

    // Local state to track when the component mounts
    // (to prevent hydration errors)
    const [isMounted, setIsMounted] = useState<boolean>(false);

    // UseEffect to enable isMounted when this component
    // mounts
    useEffect(() => {
        setIsMounted(true);

        // Cleanup 
        return () => setIsMounted(false);
    }, [])
    return (
        <Button
          onClick={() => setTheme(isLight ? "dark" : "light")} 
          variant="outline"
          className={`size-9 ${className}`}
        >
            {isMounted && isLight ? (<MoonIcon />) : (<SunIcon />)}
        </Button>
    );
};

export default ThemeSwitcher;