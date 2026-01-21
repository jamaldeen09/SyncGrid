"use client"
import z from "zod"
import useMutationService from "../useMutationService";
import { ApiResponse } from "@/lib/types/api";
import { useEditProfileMutation } from "@/redux/apis/profile-api";
import { useUi } from "@/contexts/UiContext";
import { callToast } from "@/providers/SonnerProvider";
import { useProfileFetch } from "@/contexts/ProfileFetchContext";
import { ProfileType } from "@shared/index";

// Schema type
export type EditProfileSchemaType = z.ZodObject<{
    username: z.ZodString;
    bio: z.ZodString;
}, z.core.$strip>;

// Schema
export const editProfileSchema = z.object({
    username: z.string().trim()
        .min(1, { error: "Username must be at least 1 character" })
        .max(39, { error: "Username cannot exceed 39 characters" })
        .regex(/^[a-zA-Z0-9-]+$/, { error: "Must only contain letters, numbers, or hyphens" })
        .regex(/^(?!-)/, { error: "Username cannot begin with a hyphen" })
        .regex(/(?<!-)$/, { error: "Username cannot end with a hyphen" })
        .regex(/(?!.*--.*)/, { error: "Username cannot have consecutive hypens" }).optional(),

    bio: z.string().trim().max(50, {
        error: "Bio cannot exceed 50 characters",
    }).optional(),

    profileFile: z.file().optional()
});

// Hook args type
interface UseEditProfileArgs {
    profile: ProfileType | null;
    getProfile: (username: string) => Promise<void>;
    getCurrentUsersProfile: () => Promise<void>;
}

const useEditProfile = (args: UseEditProfileArgs) => {
    // Hooks
    const { closeUi } = useUi();

    // Service
    const editProfileService = useMutationService<ApiResponse, typeof editProfileSchema.shape>({
        useMutationHook: () => useEditProfileMutation(),
        schema: editProfileSchema,
        contextName: "useEditProfile",
        onSuccess: async (res) => {
            // Close ui and call toast
            closeUi("editProfile");
            callToast.success(res.message)

            // Refetch the current user's profile to reflect changes
            args.getProfile(args.profile?.username || "");
            args.getCurrentUsersProfile();
        },
    });

    return editProfileService
};

export default useEditProfile;