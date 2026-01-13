"use client"
import { useEffect, useState } from "react"

/**
 * This hook is used to get a specific screen size and below.
 * @param screen 
 * @returns {readonly [boolean]}
 */
const useGetScreenSize = (screen: number): readonly [boolean] => {
    const [isDesiredScreen, setIsDesiredScreen] = useState<boolean>(false);

    useEffect(() => {
        // Check immediately on mount and when screen value changes
        const checkScreenSize = () => setIsDesiredScreen(window.innerWidth <= screen);

        // Check immediately 
        checkScreenSize();

        // Set up resize listener
        const handleResize = () => checkScreenSize();
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, [screen]);

    return [isDesiredScreen] as const;
}

export default useGetScreenSize;