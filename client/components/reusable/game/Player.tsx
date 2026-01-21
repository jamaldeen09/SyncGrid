import React from "react";
import CustomAvatar from "../CustomAvatar";
import { Badge } from "@/components/ui/badge";
import { FireIcon, TimerIcon, UserIcon } from "@phosphor-icons/react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

// Formats millisecond to MM:SS format
const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Component props
interface PlayerProps {
    username: string;
    preference: "X" | "O";
    currentWinStreak?: number;
    profileUrl?: string;
    timeLeftMs?: number;
    disablePlayer?: boolean;
}


const Player = ({
    username,
    preference,
    currentWinStreak,
    profileUrl,
    timeLeftMs = 60000,
    disablePlayer = false,
}: PlayerProps): React.ReactElement => {
    return (

        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
                <CustomAvatar
                    src={profileUrl!}
                    fallback={(
                        username === "opponent" ? (
                            <div className={`
                            ${disablePlayer && "opacity-70"}
                            flex justify-center items-center bg-primary rounded-full size-10 text-white`}>
                                ?
                            </div>
                        ) : (
                            <div 
                            className={`
                            ${disablePlayer && "opacity-70"}
                            flex justify-center items-center bg-primary rounded-full size-10 text-white`}>
                                {username?.charAt(0)?.toUpperCase() || "SG"}
                            </div>
                        )
                    )}
                    alt="Me"
                    className={`h-full w-full size-10 ${disablePlayer && "opacity-70"}`}
                />
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs">
                        {username} ({preference})
                    </span>

                    <div className="flex items-center gap-2">

                        {currentWinStreak !== undefined && (
                            <Badge
                                variant="ghost"
                                className="text-[10px] hover:bg-primary/30! hover:text-primary! text-primary">
                                <FireIcon /> {currentWinStreak}
                            </Badge>
                        )}

                        {username !== "opponent" && (
                            <Link href={`/profile/${username}`} className={buttonVariants({
                                variant: "ghost",
                                size: "xs",
                                className: "flex items-center gap-1 text-[10px] hover:bg-primary/30! hover:text-primary! text-primary"
                            })}>
                                <UserIcon className="size-3" />
                                Profile
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Timer */}
            <div className={`bg-primary px-2 py-1 flex items-center justify-between w-full max-w-30 text-xl ${disablePlayer && "opacity-70"}`}>
                <TimerIcon />
                <span>{formatTime(timeLeftMs)}</span>
            </div>
        </div>
    );
};

export default Player;