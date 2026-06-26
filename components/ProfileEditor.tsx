"use client";

import { useState } from "react";
import type { SafeUser } from "@/lib/types";

export function ProfileEditor({ initialUser }: { initialUser: SafeUser }) {
  const [name, setName] = useState(initialUser.name);
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [location, setLocation] = useState(initialUser.location || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (!name.trim()) {
      setMessage("Name is required.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, location }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated successfully.");
      } else {
        setMessage(data.error ?? "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="profile" className="panel p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-black text-ink">Profile</h2>
        <button onClick={save} disabled={loading} className="button-primary py-1.5 px-4 text-xs">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="grid gap-1 text-xs font-bold text-ink/55">
          Full Name
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink/55">
          Email (read-only)
          <input className="field opacity-60 bg-paper cursor-not-allowed" value={initialUser.email} readOnly />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink/55">
          Phone Number
          <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading} />
        </label>
        <label className="grid gap-1 text-xs font-bold text-ink/55">
          Location
          <input className="field" value={location} onChange={(e) => setLocation(e.target.value)} disabled={loading} />
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
