"use client"
import React, { createContext, useContext, useState } from "react";

export type Auth = "signup" | "login"

interface AuthState {
    auth: Auth;
    setAuth: React.Dispatch<React.SetStateAction<Auth>>;
}

export const AuthContext = createContext<AuthState>({
    auth: "signup",
    setAuth: () => { },
});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
    const [auth, setAuth] = useState<Auth>("signup");
    return (
        <AuthContext.Provider
            value={{ auth, setAuth }}
        >
            {children}
        </AuthContext.Provider>
    )
}


export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthContextProvider');
  }
  return context;
};
