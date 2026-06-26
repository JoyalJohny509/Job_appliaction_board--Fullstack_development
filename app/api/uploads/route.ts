import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-guard";
import { uploadResume, validateResumeFile } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    const fileError = validateResumeFile(file.name, file.size);
    if (fileError) {
      return NextResponse.json({ error: fileError }, { status: 400 });
    }

    let url = "";
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        const uploadResult = await uploadResume(file);
        url = uploadResult.url;
      } else {
        console.warn("Cloudinary credentials missing in .env, using local reference.");
        url = `/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      }
    } catch (error: any) {
      console.error("Cloudinary upload failed, falling back to local path reference:", error);
      url = `/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    }

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Error in upload API:", error);
    return NextResponse.json({ error: error.message || "Upload failed." }, { status: 500 });
  }
}
