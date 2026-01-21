import AuthProvider from "@/providers/AuthProvider";
import UnauthenticatedRouteProvider from "@/providers/UnauthenticatedRouteProvider";
import React from "react";

const LoginLayout = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <AuthProvider>
      <UnauthenticatedRouteProvider>
        {children}
      </UnauthenticatedRouteProvider>
    </AuthProvider>
  );
};

export default LoginLayout