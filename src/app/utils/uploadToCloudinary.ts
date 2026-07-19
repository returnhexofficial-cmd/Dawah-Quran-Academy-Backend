import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import { UploadApiResponse } from "cloudinary";


export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "uploads"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};


export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};


export const extractPublicId = (url: string): string => {
  const parts = url.split("/");
  const fileName = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const publicId = fileName.split(".")[0];
  return `${folder}/${publicId}`;
};