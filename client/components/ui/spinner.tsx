import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      role="status"
      aria-label="Loading"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 animate-spin", className)}
      {...props}
    >
      {/* Background circle (optional, lower opacity) */}
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        className="opacity-25" 
      />
      {/* The actual spinning path */}
      <path 
        d="M21 12a9 9 0 1 1-6.219-8.56" 
        className="opacity-100"
      />
    </svg>
  )
}

export { Spinner }