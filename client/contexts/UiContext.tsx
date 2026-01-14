"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

// Ui state type
export interface UiState {
    auth: boolean;
    createGame: boolean;
}

// Ui state's initial state
const initialState: UiState = {
    auth: false,
    createGame: false,
};

// Types for Actions
type UiAction =
    | { type: "OPEN"; key: keyof UiState }
    | { type: "CLOSE"; key: keyof UiState }
    | { type: "TOGGLE"; key: keyof UiState }
    | { type: "CLOSE_ALL" };

// Reducer Logic
const uiReducer = (state: UiState, action: UiAction): UiState => {
    switch (action.type) {
        case "OPEN":
            return { ...state, [action.key]: true };
        case "CLOSE":
            return { ...state, [action.key]: false };
        case "TOGGLE":
            return { ...state, [action.key]: !state[action.key] };
        case "CLOSE_ALL":
            return initialState;
        default:
            return state;
    }
};

// Context's initial state type
export interface UiContextType {
    ui: UiState;
    openUi: (key: keyof UiState) => void;
    closeUi: (key: keyof UiState) => void;
    toggleUi: (key: keyof UiState) => void;
    closeAll: () => void;
}

// ===== Context ===== \\
const UiContext = createContext<UiContextType | undefined>(undefined);

// ===== Context provider ===== \\
export const UiContextProvider = ({ children }: { children: ReactNode }) => {
    const [ui, dispatch] = useReducer(uiReducer, initialState);

    const openUi = (key: keyof UiState) => dispatch({ type: "OPEN", key });
    const closeUi = (key: keyof UiState) => dispatch({ type: "CLOSE", key });
    const toggleUi = (key: keyof UiState) => dispatch({ type: "TOGGLE", key });
    const closeAll = () => dispatch({ type: "CLOSE_ALL" });

    return (
        <UiContext.Provider value={{ ui, openUi, closeUi, toggleUi, closeAll }}>
            {children}
        </UiContext.Provider>
    );
};

// Custom Hook for easy access
export const useUi = () => {
    const context = useContext(UiContext);
    if (!context) throw new Error("useUi must be used within a UiContextProvider");
    return context;
};