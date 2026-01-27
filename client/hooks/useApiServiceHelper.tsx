import { ApiResponse } from "@/lib/types/api";


// Validtion error type
export interface ValidationError {
    field: string;
    message: string;
}

// Hook's type
interface UseApiServiceHelperType {
    extractValidationErrors: (error: unknown) => ValidationError[];
    extractErrorMessage: (error: unknown) => string;
}

// Hook
const useApiServiceHelper = (): UseApiServiceHelperType => {
    /**
     * Extracts validation errors
     * @param error 
     * @returns {ValidationError[]}
     */
    const extractValidationErrors = (error: unknown): ValidationError[] => {
        if (error && typeof error === 'object' && 'data' in error) {
            const errData = error.data as ApiResponse;
            if (!errData.error) return [];
            const validationErrs = errData.error?.details;

            return (validationErrs as { validationErrors: ValidationError[] })?.validationErrors || []
        }

        return [];
    }

    /**
     * Extracts error message from rtk query's error object
     * @param error 
     * @returns {string}
     */
    const extractErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object' && 'data' in error) {
            const errData = error.data as ApiResponse;
            return errData.message || "An unexpected error occurred";
        }

        return "An unexpected error occured";
    }

    return {
        extractValidationErrors,
        extractErrorMessage,
    }
};

export default useApiServiceHelper;