import { profileApi } from './apis/profile-api';
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { userSlice } from "./slices/user-slice";
import { authApi } from "./apis/auth-api";

// Redux store
export const store = configureStore({
    // Reducer
    reducer: {
        // Slice's
        user: userSlice.reducer,

        // Api's
        [authApi.reducerPath]: authApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer
    },

    // Middlewares
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(profileApi.middleware)
});


// Types for dispatch and selector to prevent issues when dispatching reducers or selecting states 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// UseAppDispatch() (typed version of useDispatch()) & UseAppSelector() (typed version of UseSelector)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;



 