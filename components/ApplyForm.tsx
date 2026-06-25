"use client";

import { FormEvent, useRef, useState } from "react";
import { Send, UploadCloud } from "lucide-react";

const allowedExtensions = [".pdf", ".doc", ".docx"];
const maxSize = 5 * 1024 * 1024;

export function ApplyForm({ jobId }: { jobId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    data.set("userId", "usr-ava");

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/applications", {
      method: "POST",
      body: data
    });

    setLoading(false);
    if (!response.ok) {
      setMessage("Could not submit application. Please try again.");
      return;
    }

    formRef.current?.reset();
    setMessage("Application submitted.");
  }

  return (
    <form ref={formRef} onSubmit={submitApplication} className="panel p-5">
      <h2 className="text-xl font-black text-ink">Apply for this job</h2>
      <div className="mt-4 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Resume
          <span className="flex items-center gap-3 rounded-lg border border-dashed border-line bg-paper p-4 text-sm text-ink/65">
            <UploadCloud className="h-5 w-5 text-mint" />
            <input className="w-full text-sm" name="resume" type="file" accept=".pdf,.doc,.docx" />
          </span>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Cover Letter
          <textarea
            className="field min-h-32"
            name="coverLetter"
            placeholder="Share why you are a strong match for this role."
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
