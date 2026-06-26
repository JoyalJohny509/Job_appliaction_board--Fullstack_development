"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function SaveJobButton({ jobId }: { jobId: string }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check saved status on mount and when auth state changes
  useEffect(() => {
    if (user) {
      // Logged in: fetch saved jobs from database
      fetch("/api/saved-jobs")
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to load saved jobs");
        })
        .then((data) => {
          if (data.savedJobs) {
            const isSaved = data.savedJobs.some((sj: any) => sj.jobId === jobId);
            setSaved(isSaved);
          }
        })
        .catch((err) => console.error("Error loading saved status:", err));
    } else {
      // Guest: check localStorage
      if (typeof window !== "undefined") {
        const savedJobs = JSON.parse(window.localStorage.getItem("hirepath:saved") ?? "[]") as string[];
        setSaved(savedJobs.includes(jobId));
      }
    }
  }, [jobId, user]);

  async function toggleSaved() {
    if (loading) return;
    setLoading(true);

    try {
      if (user) {
        // Logged in: make API request
        const method = saved ? "DELETE" : "POST";
        const url = saved ? `/api/saved-jobs?jobId=${jobId}` : "/api/saved-jobs";
        
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: saved ? undefined : JSON.stringify({ jobId }),
        });

        if (response.ok) {
          setSaved(!saved);
        } else {
          console.error("Failed to toggle bookmark in DB");
        }
      } else {
        // Guest: toggle in localStorage
        const savedJobs = JSON.parse(window.localStorage.getItem("hirepath:saved") ?? "[]") as string[];
        const next = savedJobs.includes(jobId)
          ? savedJobs.filter((savedJobId) => savedJobId !== jobId)
          : [...savedJobs, jobId];
        
        window.localStorage.setItem("hirepath:saved", JSON.stringify(next));
        setSaved(next.includes(jobId));
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={loading}
      className={`grid h-10 w-10 place-items-center rounded-md border transition focus-ring ${
        saved
          ? "border-coral bg-coral text-white"
          : "border-line bg-white text-ink hover:border-coral hover:text-coral"
      } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
      aria-label={saved ? "Remove saved job" : "Save job"}
      title={saved ? "Remove saved job" : "Save job"}
    >
      <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
