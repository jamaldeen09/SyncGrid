import { useAppSelector } from "@/redux/store";
import React from "react";
import Signup from "./auth/Signup";
import Login from "./auth/Login";

const Auth = (): React.ReactElement => {
  const { auth } = useAppSelector((state) => state.triggers)
  return (
    auth === "signup" ? (<Signup />) : (<Login />)
  );
};

export default Auth;