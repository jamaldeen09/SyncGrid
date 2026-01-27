"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { defaultProfileUrl, formatISODate } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileType } from "@shared/index";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import { Settings, ArrowLeft, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

// ===== Profile Header Skeleton ===== \\
export const ProfileHeaderSkeleton = (): React.ReactElement => {
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 border border-zinc-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)]">
            <Skeleton className="h-24 w-24 rounded-none" />
            <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 mx-auto md:mx-0 rounded-none" />
                    <Skeleton className="h-4 w-full max-w-sm mx-auto md:mx-0 rounded-none" />
                </div>
                <div className="flex gap-4 justify-center md:justify-start">
                    <Skeleton className="h-4 w-24 rounded-none" />
                    <Skeleton className="h-4 w-24 rounded-none" />
                </div>
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 w-24 rounded-none" />
            </div>
        </div>
    );
};

// ===== Profile Header ===== \\
export const ProfileHeader = ({ profile, isGettingProfile, setProfile, resetGameFetchState }: {
    profile: ProfileType;
    isGettingProfile: boolean;
    setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
    resetGameFetchState: () => void;
}): React.ReactElement => {
    // Hooks
    const { userId } = useAppSelector((state) => state.user.auth);
    const router = useRouter();

    // ===== Useful booleans ===== \\
    const isOwner = profile?.userId === userId;
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-6 border border-zinc-200 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.03)] relative overflow-hidden">
            {/* ===== Status Accent Line (V2) ===== */}
            {/* <div className={`absolute top-0 left-0 w-full h-1 ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} /> */}

            {/* ===== Square Avatar Section ===== */}
            <div className="relative shrink-0">
                <Avatar className="rounded-none shadow-none w-24 h-24">
                    <AvatarImage
                        src={profile?.profileUrl || defaultProfileUrl}
                        alt={`${profile?.username}'s node`}
                        className="object-cover"
                    />
                    <AvatarFallback className="rounded-none bg-zinc-100 text-zinc-900 font-black text-xl">
                        {profile?.username?.charAt(0).toUpperCase() || "SG"}
                    </AvatarFallback>
                </Avatar>
            </div>

            {/* ===== Profile Info ===== */}
            <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="space-y-1">
                    <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
                        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 leading-none">
                            {profile?.username || "SYNGRID_USER"}
                        </h1>
                    </div>
                    <p className="text-[11px] text-zinc-500 uppercase font-medium tracking-tight max-w-md">
                        {profile?.bio || "None"}
                    </p>
                </div>

                {/* ===== Technical Stats ===== */}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Globe size={12} className="text-zinc-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            {formatISODate(profile?.createdAt)}
                            <span className="ml-2 text-zinc-400 font-medium">Joined</span>
                        </span>
                    </div>

                    {/* V2 FEATURE (FRIENDS) */}
                    {/* <div className="flex items-center gap-2 border-l border-zinc-200 pl-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                            12 <span className="ml-1 text-zinc-400 font-medium">Friends</span>
                        </span>
                    </div> */}
                </div>
            </div>

            {/* ===== Actions ===== */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                {!isGettingProfile && profile && (
                    <>
                        {isOwner && (
                            <Link href="/profile/edit">
                                <Button
                                    variant="outline"
                                    className="flex-1 md:flex-none rounded-none border-zinc-900 bg-zinc-900 text-white hover:bg-emerald-600 hover:border-emerald-600 text-[10px] font-black uppercase tracking-widest h-9"
                                >
                                    <Settings size={14} className="mr-2" /> Edit profile
                                </Button>
                            </Link>
                        )}
                    </>
                )}

                <Button
                    onClick={() => {
                        resetGameFetchState();
                        setProfile(null);
                        setTimeout(() => router.push("/"), 100)
                    }}
                    variant="outline"
                    className="flex-1 md:flex-none w-full rounded-none border-zinc-200 text-zinc-500 hover:text-zinc-900 text-[10px] font-black uppercase tracking-widest h-9"
                >
                    <ArrowLeft size={14} className="mr-2" /> Exit
                </Button>
            </div>
        </div>
    );
};