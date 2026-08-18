import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export async function uploadImageToCloudinary(fileBuffer, folder = "birthday_photos") {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary environment variables missing. Falling back to inline data URL mode.");
    const base64Data = fileBuffer.toString("base64");
    return `data:image/jpeg;base64,${base64Data}`;
  }

  const cld = configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cld.uploader.upload_stream(
      {
        folder: folder,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload stream error:", error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteCloudinaryImage(url) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!url || !cloudName) return;

  try {
    const cld = configureCloudinary();
    const parts = url.split("/");
    const filename = parts.pop();
    const publicId = filename.split(".")[0];
    const folder = parts[parts.length - 1];
    const fullPublicId = folder && folder !== "upload" ? `${folder}/${publicId}` : publicId;

    await cld.uploader.destroy(fullPublicId);
  } catch (error) {
    console.error("Failed to delete Cloudinary asset:", error);
  }
}

export default cloudinary;
