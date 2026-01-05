import React, { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CustomAvatarProps {
  src: string;
  fallback: string | JSX.Element;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "fill" | "xs";
}

const CustomAvatar = ({
  src,
  fallback,
  className = "",
  size = "md"
}: CustomAvatarProps): React.ReactElement => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
    fill: "h-full w-full",
    xs: "h-6 w-6"
  };

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

export default CustomAvatar;