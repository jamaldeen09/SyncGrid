"use client"
import z from "zod"
import useMutationService from "../useMutationService";
import { ApiResponse } from "@/lib/types/api";
import { useEditProfileMutation } from "@/redux/apis/profile-api";
import { callToast } from "@/providers/SonnerProvider";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { setProfile } from "@/redux/slices/user-slice";

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

// Hook
const useEditProfile = () => {
    // Hooks
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Service
    const editProfileService = useMutationService<ApiResponse, typeof editProfileSchema.shape>({
        useMutationHook: () => useEditProfileMutation(),
        schema: editProfileSchema,
        contextName: "useEditProfile",
        onSuccess: async (res) => {
            callToast.success(res.message);
            const data = res.data as ({
                updateData: ({
                    username?: string;
                    bio?: string;
                    profileUrl?: string;
                })
            });

            // Route the user to their profile page to view updates
            // (or home page if they somehow bypass logic to prevent updates if)
            // (no update data exists)

            // Set the global profile state to have instant effect in the ui
            dispatch(setProfile(data.updateData));
            if (data.updateData.username) router.push(`/profile/${data.updateData.username}`);
        },
    });

    return editProfileService
};

export default useEditProfile;