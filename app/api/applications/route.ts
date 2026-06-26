import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-guard";
import * as applicationService from "@/lib/services/application.service";
import * as companyService from "@/lib/services/company.service";
import * as jobService from "@/lib/services/job.service";
import { uploadResume, validateResumeFile } from "@/lib/storage";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    let jobId = searchParams.get("jobId") || undefined;
    let userId = searchParams.get("userId") || undefined;

    // Role-based authorization
    if (auth.user.role === "JOB_SEEKER") {
      // Job seekers can only view their own applications
      userId = auth.user.id;
    } else if (auth.user.role === "EMPLOYER") {
      // Employers can only view applications for jobs belonging to their company
      const company = await companyService.findCompanyByOwnerId(auth.user.id);
      if (!company) {
        return NextResponse.json({ applications: [] });
      }

      if (jobId) {
        // If a specific jobId is requested, check if the employer owns the job's company
        const job = await jobService.findJobById(jobId);
        if (!job || job.companyId !== company.id) {
          return NextResponse.json({ error: "Access denied. You do not own this job listing." }, { status: 403 });
        }
      } else {
        // If no jobId is requested, fetch applications for all jobs owned by this company.
        // We'll query applications and filter them.
        const apps = await applicationService.listApplications();
        const filteredApps = apps.filter((app) => app.job.companyId === company.id);
        return NextResponse.json({ applications: filteredApps });
      }
    }

    const apps = await applicationService.listApplications({ jobId, userId });
    return NextResponse.json({ applications: apps });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireRole("JOB_SEEKER");
    if (auth.error) return auth.error;

    const contentType = request.headers.get("content-type") ?? "";
    let jobId = "";
    let coverLetter = "";
    let resumeUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      jobId = String(form.get("jobId") ?? "");
      coverLetter = String(form.get("coverLetter") ?? "");
      const file = form.get("resume");

      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Resume file is required." }, { status: 400 });
      }

      const fileError = validateResumeFile(file.name, file.size);
      if (fileError) {
        return NextResponse.json({ error: fileError }, { status: 400 });
      }

      // Upload to Cloudinary with fallback to local path if Cloudinary credentials are not set up
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
          const uploadResult = await uploadResume(file);
          resumeUrl = uploadResult.url;
        } else {
          console.warn("Cloudinary credentials missing in .env, falling back to local name reference.");
          resumeUrl = `/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        }
      } catch (error: any) {
        console.error("Cloudinary upload failed, falling back to local name reference:", error);
        resumeUrl = `/uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      }
    } else {
      const body = await request.json();
      jobId = body.jobId;
      coverLetter = body.coverLetter ?? "";
      resumeUrl = body.resume; // If already uploaded or supplied as string URL
    }

    if (!jobId || !resumeUrl) {
      return NextResponse.json({ error: "Job and resume are required." }, { status: 400 });
    }

    // Verify job exists
    const job = await jobService.findJobById(jobId);
    if (!job) {
      return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }

    const application = await applicationService.createApplication({
      jobId,
      userId: auth.user.id, // Enforce current logged-in user ID
      coverLetter,
      resume: resumeUrl,
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
