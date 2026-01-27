"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Gamepad2, LogOut } from "lucide-react"
import Link from "next/link";
import { Button } from "../ui/button";
import { useAppSelector } from "@/redux/store";
import useLogout from "@/hooks/auth/useLogout";
import Loader from "../reusable/Loader";
import { useBannerLiveGame } from "@/contexts/BannerLiveGameContext";
import Logo from "../reusable/Logo";

const Navbar = (): React.ReactElement => {
    const { bannerLiveGameId } = useBannerLiveGame();

    // Global state to determine if the current user is authenticated
    const isAuthenticated = useAppSelector((state) => state.user.auth.isAuthenticated);

    // Profile
    const profile = useAppSelector((state) => state.user.profile);

    // Fallback string
    const fallbackProfileStr = `${profile.username.charAt(0).toUpperCase()} ${profile.username.charAt(1).toUpperCase()}`;

    // ===== Api service for logout ===== \\
    const { isLoading, executeService } = useLogout()

    // Nav action buttons
    const navActionButtons = [
        {
            id: 1,
            icon: <Gamepad2 size={18} />,
            isLink: true,
            includeValue: true,
            route: `/profile/${profile.username}`
        },
        {
            id: 2,
            icon: <User size={18} />,
            isLink: true,
            includeValue: false,
            route: `/profile/${profile.username}`,
        },
        {
            id: 3,
            icon: <LogOut size={18} />,
            isLink: false,
            includeValue: false,
            funcToExecuteOnClick: () => executeService({}),
        }
    ];
    return (
        <>
            {/* ===== Load state for logging out ===== */}
            {(isLoading) && (
                <div className="flex inset-0 h-screen fixed top-0 z-100 justify-center items-center bg-white">
                    <Loader message="Logging out..." />
                </div>
            )}

            {/* ===== Navbar ===== */}
            <nav className="w-full h-20 px-4 sm:px-8 flex shrink-0 justify-between items-center border-b border-zinc-200 bg-white z-50">

                {/* Logo */}
                <Logo />

                {/* Unauthenticated Actions */}
                {(!isAuthenticated) && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            variant="ghost"
                            asChild
                            className="text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:text-emerald-600 hover:bg-transparent px-2 sm:px-4"
                        >
                            <Link href="/login">Log in</Link>
                        </Button>

                        <Button
                            asChild
                            className="bg-zinc-900 hover:bg-emerald-600 text-white rounded-none text-[10px] sm:text-xs font-bold uppercase tracking-widest px-4 sm:px-6 h-9 sm:h-10 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                        >
                            <Link href="/signup">Sign up</Link>
                        </Button>
                    </div>
                )}

                {/* Authenticated Actions */}
                {(isAuthenticated) && (
                    <div className="flex items-center gap-3 sm:gap-8">
                        <div className="flex items-center gap-3 sm:gap-4 border-r border-zinc-200 pr-3 sm:pr-8">
                            {navActionButtons.map((btn) => (
                                btn.isLink ? (
                                    <div key={btn.id} className="relative group flex justify-center items-center">
                                        <Link
                                            href={btn.route!}
                                            className="text-zinc-400 group-hover:text-emerald-600 transition-colors shrink-0 cursor-default"
                                        >
                                            {btn.icon}
                                        </Link>

                                        {(btn.includeValue) && (
                                            bannerLiveGameId !== null && (
                                                <div className="w-3 h-3 flex justify-center items-center text-[8px] text-white rounded-full bg-primary absolute -bottom-0.5 -right-1">1</div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div key={btn.id} className="relative group flex justify-center items-center">
                                        <button
                                            type="button"
                                            onClick={btn.funcToExecuteOnClick}
                                            className="text-zinc-400 group-hover:text-red-500 transition-colors shrink-0"
                                        >
                                            {btn.icon}
                                        </button>

                                        {(btn.includeValue) && (
                                            bannerLiveGameId !== null && (
                                                <div className="w-3 h-3 flex justify-center items-center text-[8px] text-white rounded-full bg-primary absolute -bottom-0.5 -right-1">1</div>
                                            )
                                        )}
                                    </div>
                                )
                            ))}
                        </div>

                        <button className="flex items-center gap-3 group shrink-0">
                            {/* Hide username on small screens to prevent squashing */}
                            <span className="hidden sm:block text-xs font-semibold">@{profile.username}</span>
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-transparent group-hover:border-emerald-500 transition-all">
                                <AvatarImage src={profile.profileUrl} />
                                <AvatarFallback>{profile.username ? (fallbackProfileStr) : "SG"}</AvatarFallback>
                            </Avatar>
                        </button>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;