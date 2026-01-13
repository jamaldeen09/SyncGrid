"use client"
import { ModalComponentPropsType } from "@/providers/ModalsProvider";
import Login from "../modal-content/auth/Login";
import Signup from "../modal-content/auth/Signup";
import Modal, { ModalPropsType } from "../reusable/Modal";
import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { UiContextType } from "@/contexts/UiContext";
import useLogin, { loginSchema } from "@/hooks/auth/useLogin";
import { ValidationError } from "@/lib/types/api";
import useSignup, { signupSchema } from "@/hooks/auth/useSignup";

// Auth form props type
export interface AuthFormPropsType<Schema, Values> {
    isLoading: boolean;
    setAuth: AuthContextType["setAuth"];
    schema: Schema;
    uiReducers: {
        openUi: UiContextType["openUi"];
        closeUi: UiContextType["closeUi"];
    }
    validationErrors: ValidationError[];
    executeService: (values: Values) => Promise<void>;
}

const AuthModal = (props: ModalComponentPropsType) => {
    // Hooks
    const { auth, setAuth } = useAuth();

    // ===== Login service ===== \\
    const {
        executeService: login,
        isLoading: isLoggingIn,
        extra: extraLoginData,
    } = useLogin();
    const loginValidationErrors = extraLoginData.validationErrors;

    // ===== Signup service ===== \\
    const {
        executeService: signup,
        isLoading: isSigningUp,
        extra: extraSignupData
    } = useSignup();
    const signupValidationErrors = extraSignupData.validationErrors;

    // Modal's config
    const config: ModalPropsType = {
        trigger: props.ui.auth,
        animation: props.isDesiredScreen ? "bottom-into-view" : "scale-into-view",
        animationDuration: props.isDesiredScreen ? 0.2 : 0.1,
        triggerName: "auth",
        closeOnOverlayClick: (isLoggingIn || isSigningUp) ? false : true,
        modalClassNames: `${props.isDesiredScreen && "max-w-full! h-full"} p-6`
    }

    // Renders auth component
    const renderAuthComponent = () => {
        if (auth === "login") {
            return (
                <Login
                    setAuth={setAuth}
                    isLoading={isLoggingIn}
                    uiReducers={{
                        openUi: props.uiReducers?.openUi!,
                        closeUi: props.uiReducers?.closeUi!,
                    }}
                    schema={loginSchema}
                    executeService={login}
                    validationErrors={loginValidationErrors}
                />
            )
        }

        return (
            <Signup
                setAuth={setAuth}
                isLoading={isSigningUp}
                uiReducers={{
                    openUi: props.uiReducers?.openUi!,
                    closeUi: props.uiReducers?.closeUi!,
                }}
                schema={signupSchema}
                executeService={signup}
                validationErrors={signupValidationErrors}
            />
        )
    }

    return (
        <Modal {...config}>
            {renderAuthComponent()}
        </Modal>
    )
}

export default AuthModal