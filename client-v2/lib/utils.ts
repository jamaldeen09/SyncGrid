import { GetGamesData } from "@shared/index";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const defaultProfileUrl = "https://t4.ftcdn.net/jpg/07/03/86/11/360_F_703861114_7YxIPnoH8NfmbyEffOziaXy0EO1NpRHD.jpg"

export function formatISODate(isoString: string): string {
  const date = new Date(isoString); // Create a Date object from the ISO string

  // Use toLocaleDateString for easy, locale-aware formatting
  const options: Intl.DateTimeFormatOptions = {
    month: 'short', // 'short' gives "Jan", "Feb", etc.
    day: 'numeric', // 'numeric' gives "4", "15", etc.
    year: 'numeric', // 'numeric' gives "2026"
  };

  return date.toLocaleDateString('en-US', options); // 'en-US' ensures English month names
}


export const selects: {
  id: number;
  placeholder: string;
  field: keyof GetGamesData;
  items: {
    id: number;
    value: string;
    content: string;
  }[]
}[] = [
    {
      id: 1,
      placeholder: "Select a metric",
      field: "metric",
      items: [
        { id: 1, value: "wins", content: "Wins" },
        { id: 2, value: "losses", content: "Losses" },
        { id: 3, value: "draws", content: "Draws" },
      ]
    },
    {
      id: 2,
      placeholder: "Played as",
      field: "preference",
      items: [
        { id: 1, value: "X", content: "Played as X" },
        { id: 2, value: "O", content: "Played as O" },
      ]
    },

    {
      id: 4,
      placeholder: "Sort by date",
      field: "sortOrder",
      items: [
        { id: 1, value: "newest_to_oldest", content: "Newest - Oldest" },
        { id: 2, value: "oldest_to_newest", content: "Oldest - Newest" },
      ]
    },
  ];

  
// Winning combinations 
export const winningCombinations = [
  [0, 1, 2], // Top horizontal row
  [3, 4, 5], // Middle horizontal row
  [6, 7, 8], // Bottom horizontal row
  [0, 3, 6], // Left vertical column
  [1, 4, 7], // Middle vertical column
  [2, 5, 8], // Right vertical column
  [0, 4, 8], // Top-left to bottom-right diagonal
  [2, 4, 6]  // Top-right to bottom-left diagonal
];