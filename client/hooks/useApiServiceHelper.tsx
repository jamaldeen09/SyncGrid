import { ApiResponse } from "@/redux/base-query-config";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import React from "react";

export interface ValidationError {
    field: string;
    message: string;
}

interface UseApiServiceHelperType {
    extractValidationErrors: (error: FetchBaseQueryError | SerializedError | undefined) => ValidationError[];
    extractErrorMessage:  (error: FetchBaseQueryError | SerializedError | undefined) => string;
}

const useApiServiceHelper = (): UseApiServiceHelperType => {
    /**
     * Extracts validation errors from rtk query's error object
     * @param error 
     * @returns {ValidationError[]}
     */
    const extractValidationErrors = (error: FetchBaseQueryError | SerializedError | undefined): ValidationError[] => {
        if (!error || !("data" in error)) return [];
        const typedErrorData = error.data as ApiResponse;

        // Add a null check to confirm if the error object from the syncgrid's api
        // exists
        if (!typedErrorData.error) return [];

        const typedDetails = typedErrorData.error?.details as { validationErrors: ValidationError[] };
        return typedDetails?.validationErrors
    }

    /**
     * Extracts error message from rtk query's error object
     * @param error 
     * @returns {string}
     */
    const extractErrorMessage = (error: FetchBaseQueryError | SerializedError | undefined): string => {
        if (!error || !("data" in error)) return "";
        const typedErrorData = error.data as ApiResponse;
        return typedErrorData.message
    }

    return {
        extractValidationErrors,
        extractErrorMessage,
    }
};

export default useApiServiceHelper;