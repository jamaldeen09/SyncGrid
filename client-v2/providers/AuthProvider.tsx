"use client"
import Loader from "@/components/reusable/Loader";
import { useGetSessionQuery } from "@/redux/apis/auth-api";
import { setPartialAuth } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { SessionData } from "@shared/index";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {

  // Pathname
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/signup"

  // AppRouterInstance
  const router = useRouter();

  // AppDispatch
  const dispatch = useAppDispatch();

  // ===== Api service ===== \\
  const {
    isLoading,
    isFetching,
    data,
    isSuccess,
    error,
    isError
  } = useGetSessionQuery();
  const isPending = isLoading || isFetching;

  useEffect(() => {
    let isMounted = true;

    // Initialize auth
    if (isSuccess && isMounted) {
      dispatch(
        setPartialAuth(
          data.data as SessionData
        )
      );

      if ((pathname === "/login" || pathname === "/signup")) router.push("/")
    };

    if (error && isError && isMounted) {

    }

    return () => {
      isMounted = false;
    }
  }, [isSuccess, data, dispatch, error, isError, router]);

  // Prevent showing ui if this operation is on going
  if (isPending && !isAuthRoute) return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );

  if (isPending && isAuthRoute) return (<></>);
  return <>{children}</>
};

export default AuthProvider;