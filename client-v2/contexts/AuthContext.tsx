"use client"
import React, { createContext, useContext, useState } from "react";

// Auth type
export type Auth = "signup" | "login";

// Context's initial state type
export interface AuthContextType {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
};

// ===== Context ===== \\
export const AuthContext = createContext<AuthContextType>({
    auth: "signup",
    setAuth: () => {}
});

// ===== Context provider ===== \\
export const AuthContextProvider = ({ children }: {
    children: React.ReactNode
}) => {
    // Local states
    const [auth, setAuth] = useState<Auth>("signup");

    return (
        <AuthContext.Provider
          value={{ auth, setAuth }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Custom Hook for easy access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useContext must be used within a AuthContextProvider");
    return context;
};
