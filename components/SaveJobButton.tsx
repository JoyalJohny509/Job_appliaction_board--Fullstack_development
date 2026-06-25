"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const savedJobs = JSON.parse(window.localStorage.getItem("hirepath:saved") ?? "[]") as string[];
    return savedJobs.includes(jobId);
  });

  function toggleSaved() {
    const savedJobs = JSON.parse(window.localStorage.getItem("hirepath:saved") ?? "[]") as string[];
    const next = savedJobs.includes(jobId)
      ? savedJobs.filter((savedJobId) => savedJobId !== jobId)
      : [...savedJobs, jobId];
    window.localStorage.setItem("hirepath:saved", JSON.stringify(next));
    setSaved(next.includes(jobId));
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      className={`grid h-10 w-10 place-items-center rounded-md border transition focus-ring ${
        saved ? "border-coral bg-coral text-white" : "border-line bg-white text-ink hover:border-coral hover:text-coral"
      }`}
      aria-label={saved ? "Remove saved job" : "Save job"}
      title={saved ? "Remove saved job" : "Save job"}
    >
      <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
