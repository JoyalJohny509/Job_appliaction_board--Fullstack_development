import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Validate a resume file by extension and size.
 * Returns an error message or null if valid.
 */
export function validateResumeFile(filename: string, size: number): string | null {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }
  if (size > MAX_SIZE) {
    return `File too large. Maximum size is 5 MB.`;
  }
  return null;
}

/**
 * Upload a resume file to Cloudinary.
 * Stores in the "hirepath/resumes" folder with resource_type "raw" (non-image files).
 */
export async function uploadResume(file: File): Promise<UploadResult> {
  const error = validateResumeFile(file.name, file.size);
  if (error) throw new Error(error);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise<UploadResult>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "raw",
          folder: "hirepath/resumes",
          public_id: `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
        },
        (err, result) => {
          if (err || !result) {
            reject(err ?? new Error("Upload failed."));
          } else {
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        }
      )
      .end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by its public ID.
 */
export async function deleteFile(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}
