"use client";

import { FormEvent, useRef, useState } from "react";
import { Send, UploadCloud, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

const allowedExtensions = [".pdf", ".doc", ".docx"];
const maxSize = 5 * 1024 * 1024;

export function ApplyForm({ jobId }: { jobId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // If not logged in, prompt the user to log in
  if (!user) {
    return (
      <div className="panel p-6 text-center">
        <h2 className="text-lg font-black text-ink">Apply for this job</h2>
        <p className="mt-2 text-sm text-ink/75">You must be logged in as a Job Seeker to submit an application.</p>
        <Link href="/auth/login" className="button-primary mt-4 w-full justify-center">
          <LogIn className="h-4 w-4" />
          Login to Apply
        </Link>
      </div>
    );
  }

  // If logged in but not a job seeker, prevent submission
  if (user.role !== "JOB_SEEKER") {
    return (
      <div className="panel p-6 text-center border-amber-200 bg-amber-50">
        <h2 className="text-lg font-black text-ink">Apply for this job</h2>
        <p className="mt-2 text-sm text-amber-800">Only Job Seekers can submit applications for job listings.</p>
        <button className="button-secondary mt-4 w-full justify-center" disabled>
          Cannot Apply as {user.role === "EMPLOYER" ? "Employer" : "Admin"}
        </button>
      </div>
    );
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const resume = data.get("resume");

    if (!(resume instanceof File) || resume.size === 0) {
      setMessage("Choose a resume file before submitting.");
      return;
    }

    const filename = resume.name.toLowerCase();
    if (!allowedExtensions.some((extension) => filename.endsWith(extension))) {
      setMessage("Resume must be a PDF, DOC, or DOCX file.");
      return;
    }

    if (resume.size > maxSize) {
      setMessage("Resume must be 5 MB or smaller.");
      return;
    }

    data.set("jobId", jobId);
    // Note: userId is handled on the server via the session cookie for security.

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: data
      });

      const payload = await response.json();

      if (!response.ok) {
        setMessage(payload.error ?? "Could not submit application. Please try again.");
        return;
      }

      formRef.current?.reset();
      setMessage("Application submitted successfully.");
    } catch (error) {
      console.error("Error submitting application:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={submitApplication} className="panel p-5">
      <h2 className="text-xl font-black text-ink">Apply for this job</h2>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Resume
          <span className="flex items-center gap-3 rounded-lg border border-dashed border-line bg-paper p-4 text-sm text-ink/65 cursor-pointer hover:border-mint transition">
            <UploadCloud className="h-5 w-5 text-mint" />
            <input className="w-full text-sm cursor-pointer" name="resume" type="file" accept=".pdf,.doc,.docx" disabled={loading} />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Cover Letter
          <textarea
            className="field min-h-32"
            name="coverLetter"
            placeholder="Share why you are a strong match for this role."
            disabled={loading}
          />
        </label>
        <button className="button-primary" type="submit" disabled={loading}>
          <Send className="h-4 w-4" />
          {loading ? "Submitting..." : "Submit Application"}
        </button>
        {message ? <p className="text-sm font-semibold text-mint">{message}</p> : null}
      </div>
    </form>
  );
}
