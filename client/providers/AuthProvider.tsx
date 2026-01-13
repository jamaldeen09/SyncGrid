"use client"
import Loader from "@/components/reusable/Loader";
import { useGetSessionQuery } from "@/redux/apis/auth-api";
import { clearAuth, clearProfile, setPartialAuth } from "@/redux/slices/user-slice";
import { useAppDispatch } from "@/redux/store";
import { SessionData } from "@shared/index";
import { useEffect } from "react";

const AuthProvider = ({ children }: {
  children: React.ReactNode
}): React.ReactElement => {
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
    };


    if (isError && error && "data" in error && isMounted) {

      // Clear auth and profile states if any unauthorized
      // response is received
      if (error.status === 401) {
        dispatch(clearAuth());
        dispatch(clearProfile());
      }
    }

    return () => {
      isMounted = false;
    }
  }, [isSuccess, data, dispatch, isError, error]);

  // Prevent showing ui if this operation is on going
  if (isPending) return (
    <div className="flex justify-center items-center h-screen">
      <Loader />
    </div>
  );
  return <>{children}</>
};

export default AuthProvider;