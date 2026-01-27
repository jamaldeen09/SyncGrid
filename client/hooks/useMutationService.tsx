"use client"
import z from "zod";
import { ValidationError } from "next/dist/compiled/amphtml-validator";
import { useCallback, useState } from "react";
import useApiServiceHelper from "./useApiServiceHelper";
import { callToast } from "@/providers/SonnerProvider";

// Pass TRes down so unwrap knows exactly what it returns
type MinifiedTriggerType<TReq, TRes> = (values: TReq) => {
    unwrap: () => Promise<TRes>; 
};

interface MinifiedMutationResultType<TRes> {
    data?: TRes;
    error?: any;
    isLoading: boolean;
    isError: boolean;
    isSuccess: boolean;
}

interface UseMutationServiceOptions<TRes, TSchema extends z.ZodRawShape> {
    useMutationHook: () => readonly [
        MinifiedTriggerType<z.infer<z.ZodObject<TSchema>>, TRes>, 
        MinifiedMutationResultType<TRes>
    ];
    schema: z.ZodObject<TSchema>;
    contextName: string;
    onSuccess?: (data: TRes) => void;
    onFailure?: (error: unknown) => void;
}


const useMutationService = <TRes, TSchema extends z.ZodRawShape>({
    useMutationHook,
    schema,
    onSuccess,
    onFailure,
    contextName,
}: UseMutationServiceOptions<TRes, TSchema>) => {
    const { extractErrorMessage, extractValidationErrors } = useApiServiceHelper();
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

    // Destructure the hook. TS now knows 'trigger' takes z.infer<TSchema> 
    // and 'result.data' is TRes.
    const [trigger, result] = useMutationHook();

    const executeService = useCallback(
        async (values: z.infer<z.ZodObject<TSchema>>) => {
            try {
                setValidationErrors([]);

                // Validation
                const parsedValues = schema.parse(values);

                // Execute and unwrap
                const response = await trigger(parsedValues).unwrap();
                if (onSuccess) onSuccess(response);
            } catch (err: unknown) {

                // Error handling
                if (err instanceof z.ZodError) {
                    const issuesArr = err.issues;
                    const formattedIssuesArr = issuesArr.map((issue) => {
                        return {
                            field: issue.path[0],
                            message: issue.message
                        } as ValidationError
                    });

                    setValidationErrors(formattedIssuesArr);
                    return;
                };

                if (onFailure) onFailure(err);
                setValidationErrors(extractValidationErrors(err));
                callToast.error(extractErrorMessage(err))

                console.log(`Error occured in ${contextName}\n${err}`)
            }
        },
        [trigger, schema, onSuccess, onFailure, contextName, extractValidationErrors, extractErrorMessage]
    );

    return {
        executeService,
        ...result,
        extra: {
            validationErrors,
            schema,
        },
    };
};

export default useMutationService;