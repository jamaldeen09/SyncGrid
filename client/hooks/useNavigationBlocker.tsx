"use client"
import { useEffect } from "react";

export const useNavigationBlocker = (
    hasUnsavedChanges: boolean, 
    message: string = 'Are you sure you want to leave? Changes may not be saved.'
  ) => {
    useEffect(() => {
      if (!hasUnsavedChanges) return;
  
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault();
        event.returnValue = message;
        return message;
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }, [hasUnsavedChanges, message]);
  };