import { NextFunction } from "express";
import multer from "multer"
import { Request, Response } from "express"
import { ConfiguredRequest, ConfiguredResponse } from "../types/api.types.js";
import cloudinary from "../config/cloudinary.config.js";


const storage = multer.memoryStorage();
const upload = multer({ storage });

// ===== Middleware to parse form data ===== \\
export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
    upload.single("profileFile")(req, res, (err: any) => {
        if (err) {
            return (res as ConfiguredResponse).status(400).json({
                success: false,
                message: "Error parsing form data",
                error: {
                    code: "FILE_UPLOAD_ERROR",
                    statusCode: 400,
                    details: err
                },
            });
        }
        next();
    });
};



// ===== Profile picture upload ===== \\
export const profilePictureUpload = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    // Validate more than one file
    if (Array.isArray(req.file))
        return res.status(400).json({
            success: false,
            message: "Only single files are allowed per upload",
            error: {
                code: "TOO_MANY_FILES",
                statusCode: 400
            }
        })

    // 1Validate File Size (1MB = 1,048,576 bytes)
    const MAX_SIZE = 1 * 1024 * 1024;
    if (req.file.size > MAX_SIZE) {
        return res.status(400).json({
            success: false,
            message: "File size exceeds the 1MB limit.",
            error: {
                code: "FILE_TOO_LARGE",
                statusCode: 400
            }
        });
    }

    // Validate File Type (mimetype)
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: "Invalid file type. Only JPG, PNG, and WEBP are allowed.",
            error: {
                code: "INVALID_FILE_TYPE",
                statusCode: 400
            }
        });
    }

    try {
        // Process Upload
        const base64Data = req.file.buffer.toString("base64");
        const uploadResult = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${base64Data}`,
            {
                folder: "syncgrid_profiles",
                resource_type: "image",
                transformation: [{
                    width: 500,
                    height: 500,
                    crop: "limit"
                }]
            }
        );

        (req as ConfiguredRequest).profileUrl = uploadResult.secure_url;
        next();
    } catch (error) {
        console.error("Cloudinary error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload image to Cloudinary",
            error: {
                code: "CLOUDINARY_UPLOAD_ERROR",
                statusCode: 500
            }
        });
    }
};