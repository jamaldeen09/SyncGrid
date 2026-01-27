"use client"
import Loader from "@/components/reusable/Loader";
import { useLazyGetSessionQuery } from "@/redux/apis/auth-api";
import { setPartialAuth } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { SessionData } from "@shared/index";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const AuthProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {

  // Local states
  const [showLoadingUi, setShowLoadingUi] = useState<boolean>(true);

  // Pathname
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // AppRouterInstance
  const router = useRouter();

  // AppDispatch
  const dispatch = useAppDispatch();


  // ===== Api service ===== \\
  const [getSession, {
    isLoading,
    isFetching,
    data,
    isSuccess,
    error,
    isError
  }] = useLazyGetSessionQuery();
  const isPending = isLoading || isFetching;

  // Function that makes the http request to the backend
  const executeService = useCallback(async () => {
    try {
      const result = await getSession().unwrap();
      if (result && result.data) {
        setShowLoadingUi(false);
        dispatch(
          setPartialAuth(
            result.data as SessionData
          )
        );

        if ((pathname === "/login" || pathname === "/signup")) router.push("/")
      }
    } catch (err) {
      setShowLoadingUi(false)
    }
  }, [getSession]);


  // ===== UseEffect to trigger the http request ===== \\
  useEffect(() => {
    executeService();
  }, []);

  // ===== UseEffect to update the current user's session data (if .unwrap() gets bypassed) ===== \\
  useEffect(() => {
    // Initialize auth
    if (isSuccess) {
      setShowLoadingUi(false);

      dispatch(
        setPartialAuth(
          data.data as SessionData
        )
      );

      if (isAuthRoute) router.push("/")
    };

    if (isError && error) {
      setShowLoadingUi(false);
      if (!isAuthRoute) router.push("/")
    }
  }, [isSuccess, data, error, isError]);

  if ((showLoadingUi || isPending) && !isAuthRoute) return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );

  if ((showLoadingUi || isPending) && isAuthRoute) return (<></>);
  return <>{children}</>
};

export default AuthProvider;