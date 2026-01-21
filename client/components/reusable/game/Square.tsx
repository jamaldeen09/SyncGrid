import { Circle, X } from "@phosphor-icons/react";

export const Square = ({
    value,
    onClick,
    disableSquare = false,
    isWinningSquare,
    className
}: {
    value: "X" | "O" | number;
    disableSquare?: boolean;
    onClick: () => void;
    isWinningSquare?: boolean;
    className?: string;
}) => {
    // Is number
    const isNumber = typeof value === "number";

    return (
        <button
            onClick={onClick}
            disabled={!isNumber || disableSquare}
            className={`
          relative h-32 sm:h-40 w-full flex items-center justify-center
          transition-all duration-200 border-r border-b border-border/50
          ${className}

          /* Grid Edge Logic */
          nth-[3n]:border-r-0
          nth-[n+7]:border-b-0

          /* Interactive vs Disabled States */
          ${isNumber && !disableSquare
                    ? "hover:bg-primary/5 cursor-pointer group active:scale-95"
                    : "cursor-not-allowed opacity-80"}
          
          /* Visual feedback when the whole board is disabled (e.g., game over) */
          ${disableSquare && isNumber ? "bg-muted/10 grayscale-[0.5]" : ""}
      
          /* Winning Highlight */
          ${isWinningSquare ? "bg-primary/20 z-10" : "bg-transparent"}
        `}
        >
            {/* Index Number - Dimmed significantly when disabled */}
            {isNumber && (
                <span className={`
            absolute top-2 left-2 text-[10px] font-mono transition-colors
            ${disableSquare
                        ? "text-muted-foreground/20"
                        : "text-muted-foreground/40 group-hover:text-primary"}
          `}>
                    0{value}
                </span>
            )}

            {/* Icon Marks */}
            <div className={`transition-transform duration-300 ${disableSquare && !isWinningSquare ? "scale-90 opacity-50" : "scale-100"}`}>
                {value === "X" && (
                    <X
                        weight="bold"
                        size={48}
                        className={isWinningSquare ? "text-white animate-pulse" : "text-primary"}
                    />
                )}
                {value === "O" && (
                    <Circle
                        weight="bold"
                        size={44}
                        className={isWinningSquare ? "text-white animate-pulse" : "text-foreground"}
                    />
                )}
            </div>

            {disableSquare && (
                <div className="absolute inset-0 bg-repeat opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(0deg, transparent 50%, #000 50%)', backgroundSize: '100% 4px' }}
                />
            )}
        </button>
    );
};