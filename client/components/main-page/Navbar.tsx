import React from "react";
import Logo from "../reusable/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Navbar = (): React.ReactElement => {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Branding */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            <Logo />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                SyncGrid
                            </p>
                            <span className="text-xs text-muted-foreground">Live Tic-Tac-Toe</span>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-sm">24 players online</span>
                        </div>

                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback className="bg-linear-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                                U
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;