import AuthProvider from "@/providers/AuthProvider";
import SocketProvider from "@/providers/SocketProvider";
import UnauthenticatedRouteProvider from "@/providers/UnauthenticatedRouteProvider";
import React from "react";

const SignupLayout = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <AuthProvider>
      <UnauthenticatedRouteProvider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </UnauthenticatedRouteProvider>
    </AuthProvider>
  );
};

export default SignupLayout