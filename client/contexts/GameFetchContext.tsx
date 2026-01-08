"use client"

import React, { createContext, useContext, useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { Filters } from '@/components/reusable/Filter';
import { PaginationPayload } from '@/lib/types';
import { useLazyGetGamesQuery } from '@/redux/apis/game-api';
import { setInitialGamesFetchResult, setNextGamesFetchResult } from '@/redux/slices/game-slice';
import { useAppDispatch } from '@/redux/store';
import { isEqual } from 'lodash';

interface PaginationState {
  page: number;
  limit: number;
}

interface FilterHelpers {
  getFiltersKeysOrEntries: (arrayType: "entries" | "keys") => string[] | [string, React.Key | null | undefined][];
  manipulateFilters: (operationType: "remove" | "clear", args?: { key: keyof Filters }) => void;
}

interface PaginationHelpers {
  manipulatePaginationState: (page?: number, limit?: number) => void;
}

interface ApiService {
  seeMoreData: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: any;
  data: any;
  targetDivRef: React.RefObject<HTMLDivElement | null>;
  scrollToDiv: (position: ScrollLogicalPosition) => void;
}

interface GameFetchContextType {
  // State
  filters: Filters;
  paginationState: PaginationState;
  
  // Setters
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  setPaginationState: React.Dispatch<React.SetStateAction<PaginationState>>;
  
  // Helpers
  filterHelpers: FilterHelpers;
  paginationStateHelpers: PaginationHelpers;
  
  // API Service
  apiService: ApiService;
}

export const GameFetchContext = createContext<GameFetchContextType | undefined>(undefined);

export const GameFetchContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // ===== State =====
  const [filters, setFiltersState] = useState<Filters>(() => {
    if (typeof window !== 'undefined') {
      const rawFilters = localStorage.getItem('filters');
      return rawFilters ? JSON.parse(rawFilters) : {};
    }
    return {};
  });

  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: 1,
    limit: 8,
  });

  // ===== Refs =====
  const targetDivRef = useRef<HTMLDivElement>(null);
  const prevFiltersRef = useRef<Filters>({});
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // ===== RTK Query =====
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

  // ===== Stable Helper Functions =====
  const scrollToDiv = useCallback((position: ScrollLogicalPosition) => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: 'smooth',
        block: position,
        inline: 'nearest'
      });
    }
  }, []);

  const manipulatePaginationState = useCallback((page?: number, limit?: number) => {
    setPaginationState(() => ({
      page: page || 1,
      limit: limit || 8
    }));
  }, []);

  const seeMoreData = useCallback(() => {
    setPaginationState(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  }, []);

  const getFiltersKeysOrEntries = useCallback((arrayType: "entries" | "keys") => {
    const keys = Object.keys(filtersRef.current);
    const entries = Object.entries(filtersRef.current);
    return arrayType === "keys" ? keys : entries;
  }, []);

  const manipulateFilters = useCallback((operationType: "remove" | "clear", args?: { key: keyof Filters }) => {
    if (operationType === "clear") {
      setFiltersState({});
      if (typeof window !== 'undefined') {
        localStorage.removeItem('filters');
      }
    } else if (operationType === "remove" && args) {
      const newFilters = { ...filtersRef.current };
      delete newFilters[args.key];
      setFiltersState(newFilters);
      if (typeof window !== 'undefined') {
        localStorage.setItem('filters', JSON.stringify(newFilters));
      }
    }
  }, []);

  const setFilters = useCallback((newFiltersOrUpdater: React.SetStateAction<Filters>) => {
    setFiltersState(prev => {
      const newFilters = typeof newFiltersOrUpdater === 'function' 
        ? newFiltersOrUpdater(prev) 
        : newFiltersOrUpdater;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('filters', JSON.stringify(newFilters));
      }
      
      return newFilters;
    });
  }, []);

  // ===== Effects =====
  
  // Effect for fetching games when filters or pagination changes
  useEffect(() => {
    let isComponentMounted = true;
    
    if (isComponentMounted) {
      const hasFiltersChanged = !isEqual(prevFiltersRef.current, filters);
      
      const fetchOptions = hasFiltersChanged
        ? { filters, paginationState: { ...paginationState, page: 1 } }
        : { filters, paginationState };
      
      getGames(fetchOptions);
      
      if (hasFiltersChanged) {
        prevFiltersRef.current = filters;
      }
    }
    
    return () => {
      isComponentMounted = false;
    };
  }, [filters, paginationState, getGames]);

  // Effect for handling API response
  useEffect(() => {
    let isComponentMounted = true;
    
    if (isSuccess && isComponentMounted && data) {
      const typedData = data.data as PaginationPayload;
      
      if (typedData.page === 1) {
        dispatch(setInitialGamesFetchResult(typedData));
      } else {
        dispatch(setNextGamesFetchResult(typedData));
      }
      
      // Scroll to end after successful data fetch
      setTimeout(() => {
        scrollToDiv('end');
      }, 100);
    }
    
    return () => {
      isComponentMounted = false;
    };
  }, [isSuccess, isError, error, data, dispatch, scrollToDiv]);

  // ===== Memoized Context Value =====
  const contextValue = useMemo(() => ({
    // State
    filters,
    paginationState,
    
    // Setters
    setFilters,
    setPaginationState,
    
    // Helpers
    filterHelpers: {
      manipulateFilters,
      getFiltersKeysOrEntries
    },
    
    paginationStateHelpers: {
      manipulatePaginationState
    },
    
    // API Service
    apiService: {
      seeMoreData,
      isLoading,
      isFetching,
      isSuccess,
      isError,
      error,
      data,
      targetDivRef,
      scrollToDiv
    }
  }), [
    filters,
    paginationState,
    setFilters,
    setPaginationState,
    manipulateFilters,
    getFiltersKeysOrEntries,
    manipulatePaginationState,
    seeMoreData,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    data,
    scrollToDiv
  ]);

  return (
    <GameFetchContext.Provider value={contextValue}>
      {children}
    </GameFetchContext.Provider>
  );
};


// Custom hook to use the context
export const useGameFetch = (): GameFetchContextType => {
  const context = useContext(GameFetchContext);
  if (context === undefined) {
    throw new Error('useGameFetch must be used within a GameFetchProvider');
  }
  return context;
};
