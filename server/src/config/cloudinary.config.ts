import { v2 as cloudinary } from 'cloudinary';
import { envData } from "../config/env.config.js"


// Setup
cloudinary.config({
    cloud_name: envData.CLOUDINARY_NAME,
    api_key: envData.CLOUDINARY_KEY,
    api_secret: envData.CLOUDINARY_SECRET,
});

export default cloudinary