import React, { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Size
type Size = "sm" | "lg" | "xs" | "fill" | "default";

// Component props type
interface CustomAvatarPropsType {
    src: string;
    fallback: string | JSX.Element;
    alt: string;
    className?: string;
    size?: Size;
}

const CustomAvatar = ({
    src,
    fallback,
    className = "",
    size = "default"
}: CustomAvatarPropsType): React.ReactElement => {

    // Size classNames
    const sizeClassNames: Record<Size, string> = {
        sm: "size-7",
        lg: "size-9",
        fill: "h-full w-full",
        xs: "size-6",
        default: "size-8"
    };

    return (
        <Avatar className={`${sizeClassNames[size]} ${className}`}>
            <AvatarImage src={src} />
            <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
    );
};

export default CustomAvatar;