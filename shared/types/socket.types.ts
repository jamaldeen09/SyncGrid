

export type ListenerCallbackArgs<TCallbackData = unknown, TCallbackError = unknown> = {
    success: boolean;
    message: string;
    data?: TCallbackData;
    error?: TCallbackError;
};

export type ListenerCallback<TCallbackData = unknown, TCallbackError = unknown> = (args: ListenerCallbackArgs<TCallbackData, TCallbackError>) => void
export type Listener<TArgs, TCallbackData = unknown, TCallbackError = unknown> = (args: TArgs, callback: ListenerCallback<TCallbackData, TCallbackError>) => void | Promise<void>
