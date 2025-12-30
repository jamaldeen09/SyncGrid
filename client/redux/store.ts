
import { configureStore } from "@reduxjs/toolkit";
import { triggersSlice } from "./slices/triggers-slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


// Redux store
export const store = configureStore({
    // Reducer
    reducer: {
        triggers: triggersSlice.reducer,
    },

    // Api services
});

// Types for dispatch and selector to prevent issues when dispatching reducers or selecting states 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// UseAppDispatch() (typed version of useDispatch()) & UseAppSelector() (typed version of UseSelector)
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;





