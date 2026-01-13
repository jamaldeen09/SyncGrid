import { AuthContextProvider } from "@/contexts/AuthContext";
import { UiContextProvider } from "@/contexts/UiContext";
import React from "react";

const ContextsProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <UiContextProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </UiContextProvider>
  );
};

export default ContextsProvider;