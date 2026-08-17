import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImageToCloudinary(fileBuffer, folder = "birthday_photos") {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn("Cloudinary environment variables missing. Falling back to inline data URL mode.");
    const base64Data = fileBuffer.toString("base64");
    return `data:image/jpeg;base64,${base64Data}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteCloudinaryImage(url) {
  if (!url || !process.env.CLOUDINARY_CLOUD_NAME) return;

  try {
    // Extract public ID from URL if it's a Cloudinary URL
    const parts = url.split("/");
    const filename = parts.pop();
    const publicId = filename.split(".")[0];
    const folder = parts[parts.length - 1];
    const fullPublicId = folder && folder !== "upload" ? `${folder}/${publicId}` : publicId;

    await cloudinary.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error("Failed to delete Cloudinary asset:", error);
  }
}

export default cloudinary;
