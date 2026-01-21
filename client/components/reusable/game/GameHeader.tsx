import { Badge } from "@/components/ui/badge";
import { FireIcon, TimerIcon, CrownIcon, TrophyIcon, TargetIcon, LightningIcon } from "@phosphor-icons/react";
import React from "react";
import CustomAvatar from "../CustomAvatar";
import { Separator } from "@/components/ui/separator";

// ClassNames type
interface ClassNamesType {
    X: string;
    O: string;
}

// ===== Player info ===== \\
const PlayerInfo = ({ classNames, preference, winStreak, isCurrentUser = false }: {
    classNames: ClassNamesType;
    winStreak: number;
    preference: "X" | "O";
    isCurrentUser?: boolean;
}): React.ReactElement => {
    return (
        <div className="flex flex-col gap-2">
            {/* Win streak with glowing effect */}
            <div className="relative">
                <Badge className={`px-4 py-2 gap-2 font-bold text-sm ${winStreak >= 5 ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/25' : 'bg-muted/50'} border-0`}>
                    <div className="flex items-center gap-2">
                        {winStreak >= 5 ? (
                            <FireIcon className="h-4 w-4 animate-pulse" weight="fill" />
                        ) : (
                            <TrophyIcon className="h-4 w-4" />
                        )}
                        <span className={winStreak >= 5 ? "text-white" : ""}>{winStreak}</span>
                        <span className="text-xs font-normal">Win Streak</span>
                    </div>
                </Badge>
                {winStreak >= 10 && (
                    <div className="absolute -top-1 -right-1">
                        <div className="h-3 w-3 bg-yellow-500 rounded-full animate-ping" />
                    </div>
                )}
            </div>

            {/* Playing as badge with turn indicator */}
            <div className="relative group">
                <Badge
                    variant={isCurrentUser ? "default" : "outline"}
                    className={`px-4 py-2 gap-2 font-medium ${classNames[preference]} ${isCurrentUser ? 'border-2' : ''}`}
                >
                    <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${preference === 'X' ? 'bg-primary' : 'bg-white'}`} />
                        <span className="text-xs">Playing as {preference}</span>
                        {isCurrentUser && (
                            <CrownIcon className="h-3 w-3 text-yellow-500" weight="fill" />
                        )}
                    </div>
                </Badge>
            </div>
        </div>
    )
}

// ===== Player ===== \\
const Player = ({ 
    classNames, 
    username, 
    profileUrl, 
    time, 
    profileSide, 
    isCurrentUser = false,
    rating,
    isTurn = false 
}: {
    classNames: ClassNamesType;
    profileUrl: string;
    username: string;
    time: string; // could be fixed or dynamic
    profileSide: "right" | "left";
    isCurrentUser?: boolean;
    rating?: number;
    isTurn?: boolean;
}): React.ReactElement => {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl ${isTurn ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent ring-2 ring-primary/20' : 'bg-muted/10'}`}>
            {/* ===== Left profile picture ===== */}
            {profileSide === "left" && (
                <div className="relative">
                    <div className={`size-14 rounded-full p-0.5 ${isTurn ? 'bg-gradient-to-br from-primary to-primary/50' : 'bg-transparent'}`}>
                        <CustomAvatar
                            src={profileUrl}
                            alt="profile_picture"
                            size="fill"
                            className={`border-2 ${isCurrentUser ? 'border-primary/30' : 'border-muted/30'}`}
                            fallback={(
                                <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-muted to-muted/50">
                                    <span className="text-lg font-bold">
                                        {username?.charAt(0)?.toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                    {isTurn && (
                        <div className="absolute -top-1 -right-1">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-ping" />
                        </div>
                    )}
                    {isCurrentUser && (
                        <div className="absolute -bottom-1 -right-1">
                            <Badge className="h-4 px-1 text-[8px] bg-primary">
                                YOU
                            </Badge>
                        </div>
                    )}
                </div>
            )}

            {/* ===== Username and details ===== */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="font-bold text-sm truncate">{username}</p>
                    {isCurrentUser && (
                        <CrownIcon className="h-3 w-3 text-yellow-500 flex-shrink-0" weight="fill" />
                    )}
                    {!isCurrentUser && rating && (
                        <Badge variant="outline" className="h-4 px-1.5 text-[8px]">
                            {rating} ELO
                        </Badge>
                    )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                    <Badge 
                        variant={isTurn ? "default" : "secondary"} 
                        className={`gap-1.5 px-3 py-1 ${isTurn ? 'bg-primary/20 text-primary' : ''}`}
                    >
                        <TimerIcon className="h-3 w-3" />
                        <span className={`font-mono text-sm ${parseInt(time) < 30 ? 'text-red-500 animate-pulse' : ''}`}>
                            {time}
                        </span>
                    </Badge>
                    
                    {isTurn && (
                        <Badge className="gap-1 bg-green-500/20 text-green-600 border-green-500/30">
                            <TargetIcon className="h-3 w-3" />
                            <span className="text-xs">Turn</span>
                        </Badge>
                    )}
                </div>
            </div>

            {/* ===== Right profile picture ===== */}
            {profileSide === "right" && (
                <div className="relative">
                    <div className={`size-14 rounded-full p-0.5 ${isTurn ? 'bg-gradient-to-br from-primary to-primary/50' : 'bg-transparent'}`}>
                        <CustomAvatar
                            src={profileUrl}
                            alt="profile_picture"
                            size="fill"
                            className={`border-2 ${isCurrentUser ? 'border-primary/30' : 'border-muted/30'}`}
                            fallback={(
                                <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-muted to-muted/50">
                                    <span className="text-lg font-bold">
                                        {username?.charAt(0)?.toUpperCase() || "?"}
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                    {isTurn && (
                        <div className="absolute -top-1 -right-1">
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-ping" />
                        </div>
                    )}
                    {isCurrentUser && (
                        <div className="absolute -bottom-1 -right-1">
                            <Badge className="h-4 px-1 text-[8px] bg-primary">
                                YOU
                            </Badge>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ===== Game header ===== \\
const GameHeader = ({ isPlayerTurn = false }: { isPlayerTurn?: boolean }): React.ReactElement => {
    // Classnames with better gradients
    const classNames = {
        X: "bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 text-primary border-primary/30 hover:bg-primary/30",
        O: "bg-gradient-to-r from-white/20 via-white/10 to-white/5 text-white border-white/30 hover:bg-white/30"
    }
    
    return (
        <header className="w-full bg-gradient-to-b from-background via-background to-card/50 border-b border-border/50 shadow-lg">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                {/* Top section with player info */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4">
                    {/* Left side - Opponent info */}
                    <div className="flex items-center gap-4">
                        <PlayerInfo
                            classNames={classNames}
                            preference="X"
                            winStreak={4}
                        />
                        
                        <div className="hidden lg:block">
                            <Separator orientation="vertical" className="h-10" />
                        </div>
                        
                        <div className="flex-1">
                            <Player
                                classNames={classNames}
                                profileUrl="https://github.com/shadcn.png"
                                time="1:54"
                                username="chess_master_88"
                                profileSide="left"
                                rating={1875}
                                isTurn={!isPlayerTurn}
                            />
                        </div>
                    </div>

                    {/* Center - VS indicator */}
                    <div className="flex flex-col items-center px-4">
                        <div className="relative">
                            <div className="px-4 py-2 bg-gradient-to-r from-destructive to-destructive/70 rounded-full shadow-lg">
                                <div className="flex items-center gap-2">
                                    <LightningIcon className="h-4 w-4 text-white" weight="fill" />
                                    <span className="text-xs font-black text-white tracking-widest">VS</span>
                                    <LightningIcon className="h-4 w-4 text-white" weight="fill" />
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-destructive to-destructive/70 rounded-full blur-md opacity-50" />
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">Live Match</span>
                        </div>
                    </div>

                    {/* Right side - Current user info */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Player
                                classNames={classNames}
                                profileUrl="https://github.com/evilrabbit.png"
                                time="1:00"
                                username="little-juice142"
                                profileSide="right"
                                isCurrentUser
                                rating={1450}
                                isTurn={isPlayerTurn}
                            />
                        </div>
                        
                        <div className="hidden lg:block">
                            <Separator orientation="vertical" className="h-10" />
                        </div>
                        
                        <PlayerInfo
                            classNames={classNames}
                            preference="O"
                            winStreak={100}
                            isCurrentUser
                        />
                    </div>
                </div>

                {/* Bottom section - Game status */}
                <div className="flex items-center justify-center gap-6 py-3 border-t border-border/30">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground">Move: <strong className="text-foreground">3</strong></span>
                    </div>
                    
                    
                    <div className="h-3 w-px bg-border/50" />
                    
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs text-muted-foreground">Spectators: <strong className="text-foreground">12</strong></span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default GameHeader;