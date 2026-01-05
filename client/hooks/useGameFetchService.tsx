"use client"

import { Filters } from "@/components/reusable/Filter";
import { PaginationPayload } from "@/lib/types";
import { useLazyGetGamesQuery } from "@/redux/apis/game-api";
import { RtkQueryApiServiceType } from "@/redux/base-query-config";
import { setInitialGamesFetchResult, setNextGamesFetchResult } from "@/redux/slices/game-slice";
import { useAppDispatch } from "@/redux/store";
import { isEqual } from "lodash";
import React, { Ref, useEffect, useRef, useState } from "react";


type ApiService = RtkQueryApiServiceType<(args: {
    filters: Filters, paginationState: { page: number; limit: number; }
}) => void> & {
    seeMoreData: () => void;
    targetDivRef: Ref<HTMLDivElement | null>;
    scrollToDiv: (position: ScrollLogicalPosition) => void;
}

interface UseGameFetchServiceType {
    // ===== Filters ===== \\
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    filterHelpers: {
        getFiltersKeysOrEntries: (arrayType: "entries" | "keys") => string[] | [string, React.Key | null | undefined][];
        manipulateFilters: (operationType: "remove" | "clear", args?: {
            key: keyof Filters;
        }) => void
    };


    // ===== Api service ===== \\
    apiService: ApiService;

    // ===== Pagination state ===== \\
    paginationState: { page: number; limit: number; };
    paginationStateHelpers: {
        manipulatePaginationState: (page?: number, limit?: number) => void;
    }

}

// Contains pagination logic for fetching a usesr games
const useGameFetchService = (): UseGameFetchServiceType => {
    const dispatch = useAppDispatch();

    // Helps to extract filters from local storage
    const getDefaultFilters = (): Filters => {
        if (typeof window !== "undefined") {
            const rawFilters = localStorage.getItem("filters");

            if (!rawFilters) return {};
            return JSON.parse(rawFilters)
        }

        return {}
    };

    // Filters (for filtering data)
    const [filters, setFilters] = useState<Filters>(getDefaultFilters());

    // For handling basic pagination
    const [paginationState, setPaginationState] = useState<{ page: number; limit: number; }>({
        page: 1,
        limit: 8,
    });

    // Moves on to the next page
    const seeMoreData = () => setPaginationState((prevState) => ({
        ...prevState,
        page: prevState.page + 1,
    }));

    // Stores the previous state of the original filters
    // (this can be helpful for resetting the page to 1 anytime a new filter gets added)
    const prevFiltersRef = useRef<Filters>({});

    // Ref targets the div in which we can automatically scroll up or down when new data is fetched
    const targetDivRef = useRef<HTMLDivElement | null>(null);

    // Api service to make request to backend
    const [
        getGames,
        {
            isLoading,
            isFetching,
            isSuccess,
            isError,
            data,
            error,
        }
    ] = useLazyGetGamesQuery();

    // ===== Helpers ===== \\

    /**
     * Scrolls the target div to {position}
     * @param position
     */
    const scrollToDiv = (position: ScrollLogicalPosition) => {
        if (targetDivRef.current) {
            targetDivRef.current.scrollIntoView({
                behavior: 'smooth', 
                block: position,  // 'start' | 'end' | 'center' | 'nearest'
                inline: 'nearest' // Optional: horizontal alignment
            });
        }
    };

    /**
     * Makes it easier to manipulage pagination state
     * @param page 
     * @param limit 
     */
    const manipulatePaginationState = (page?: number, limit?: number) => {
        setPaginationState(() => {
            const absolutePage = page || 1;
            const absoluteLimit = limit || 8;

            return {
                page: absolutePage,
                limit: absoluteLimit
            }
        })
    };


    /**
     * Gets filters entries or keys
     * @param arrayType 
     */
    const getFiltersKeysOrEntries = (arrayType: "entries" | "keys") => {
        // Initial containers
        const keys = Object.keys(filters);
        const entries = Object.entries(filters);

        // Conditional logic
        if (arrayType === "keys") return keys
        return entries
    };

    /**
     * Makes it easier to manipulate filters
     * @param operationType 
     * @param args 
     */
    const manipulateFilters = (operationType: "remove" | "clear", args?: { key: keyof Filters }) => {
        // Clear operation
        const clear = () => {
            setFilters({});
            if (typeof window !== "undefined") localStorage.removeItem("filters");
        }

        // Remove operation
        const remove = (key: keyof Filters) => {
            const newFilters = { ...filters };
            delete newFilters[key];
            setFilters(newFilters);
            if (typeof window !== "undefined") localStorage.setItem("filters", JSON.stringify(newFilters));
        }

        switch (operationType) {
            case "clear":
                clear()

            case "remove":
                if (!args) return;
                remove(args.key);
        }
    }

    // ===== Use effects ===== \\

    // Resets page to 1 anytime a new filter gets added or removed
    useEffect(() => {
        let isComponentMounted = true;

        if (isComponentMounted) {
            const hasFiltersChanged = !isEqual(prevFiltersRef.current, filters);

            if (hasFiltersChanged) {
                // Update state immediately and use new page for API call
                manipulatePaginationState(1);
                getGames({
                    filters,
                    paginationState: {
                        ...paginationState,
                        page: 1,
                    },
                });
            } else {
                // Normal pagination change
                getGames({ filters, paginationState });
            }

            prevFiltersRef.current = filters;
        }

        return () => { isComponentMounted = false };
    }, [filters, paginationState.page, paginationState.limit]);


    // Handles extracting the data provided by syncgrid's api and also handles errors/successful fetches
    useEffect(() => {
        let isComponentMounted = true;

        if (isSuccess && isComponentMounted) {
            const typedData = data.data as PaginationPayload;

            if (typedData.page === 1) dispatch(setInitialGamesFetchResult(typedData))
            else dispatch(setNextGamesFetchResult(typedData));

            // ==== Scroll div to end upon successfull data fetch ==== \\
           scrollToDiv("end");
        }
        return () => { isComponentMounted = false }
    }, [isSuccess, isError, error, data, dispatch]);

    return {
        // ===== Filters ===== \\
        filters,
        setFilters,
        filterHelpers: {
            manipulateFilters,
            getFiltersKeysOrEntries
        },

        // ===== Api service ===== \\
        apiService: {
            executeService: (args: {
                filters: Filters, paginationState: { page: number; limit: number; }
            }) => getGames(args),

            seeMoreData,
            isLoading,
            isError,
            isSuccess,
            isFetching,
            error,
            data,
            targetDivRef,
            scrollToDiv
        },

        // ===== Pagination state ==== \\
        paginationState,
        paginationStateHelpers: {
            manipulatePaginationState
        }
    };
};

export default useGameFetchService;