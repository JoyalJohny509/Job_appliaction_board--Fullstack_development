"use client";

import { useState } from "react";
import { FileUp, ExternalLink } from "lucide-react";
import type { SafeUser } from "@/lib/types";

export function ResumeUploader({ initialUser }: { initialUser: SafeUser }) {
  const [resume, setResume] = useState(initialUser.resume || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // 1. Upload the file
      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Upload failed.");
      }

      // 2. Save the resume URL to the profile
      const profileRes = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume: uploadData.url }),
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(profileData.error || "Failed to update profile resume.");
      }

      setResume(uploadData.url);
      setMessage("Resume uploaded and saved successfully.");
    } catch (err: any) {
      console.error("Upload error:", err);
      setMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // Get display name: either filename from URL or the string itself
  const getDisplayName = () => {
    if (!resume) return "No resume uploaded yet.";
    if (resume.startsWith("http")) {
      const parts = resume.split("/");
      const filename = parts[parts.length - 1];
      // Strip timestamp prefix from filename if present
      return filename.replace(/^\d+-/, "");
    }
    return resume;
  };

  return (
    <section id="resume" className="panel p-5">
      <h2 className="text-xl font-black text-ink">Resume</h2>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-paper p-4">
        <div>
          {resume ? (
            <div className="font-bold text-ink flex items-center gap-2">
              {resume.startsWith("http") ? (
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint hover:underline inline-flex items-center gap-1.5"
                >
                  {getDisplayName()}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span>{resume}</span>
              )}
            </div>
          ) : (
            <p className="font-bold text-ink/50 italic">No resume uploaded yet.</p>
          )}
          <p className="mt-1 text-sm text-ink/60">Accepted formats: PDF, DOC, DOCX. Maximum size: 5 MB.</p>
        </div>
        <label className={`button-secondary cursor-pointer inline-flex items-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>
          <FileUp className="h-4 w-4" />
          {loading ? "Uploading..." : "Upload"}
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx"
            onChange={handleUpload}
            disabled={loading}
          />
        </label>
      </div>
      {message && (
        <p className="mt-3 text-xs font-semibold text-mint bg-mint/5 p-2 rounded border border-mint/20 w-fit">
          {message}
        </p>
      )}
    </section>
  );
}
