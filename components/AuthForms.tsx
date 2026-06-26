"use client";

import { FormEvent, useState } from "react";
import { Building2, GraduationCap, LogIn, UserRoundPlus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/types";

export function SignupForm() {
  const [role, setRole] = useState<Role>("JOB_SEEKER");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const form = new FormData(event.currentTarget);
      form.set("role", role);
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form)),
        headers: { "Content-Type": "application/json" }
      });
      
      const payload = await response.json();
      
      if (response.ok) {
        setMessage(`Created ${payload.user.name}. Redirecting...`);
        await refresh();
        
        // Redirect based on role
        if (payload.user.role === "EMPLOYER") {
          router.push("/dashboard/employer");
        } else {
          router.push("/dashboard/job-seeker");
        }
      } else {
        setMessage(payload.error ?? "Could not create account.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel p-6">
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-paper p-1">
        {[
          { role: "JOB_SEEKER" as const, label: "Job Seeker", icon: GraduationCap },
          { role: "EMPLOYER" as const, label: "Employer", icon: Building2 }
        ].map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.role}
              type="button"
              onClick={() => setRole(option.role)}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${
                role === option.role ? "bg-white text-mint shadow-sm" : "text-ink/60 hover:text-ink"
              }`}
              disabled={isLoading}
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4">
        {role === "EMPLOYER" ? (
          <input className="field" name="companyName" placeholder="Company name" required disabled={isLoading} />
        ) : (
          <input className="field" name="name" placeholder="Full name" required disabled={isLoading} />
        )}
        <input className="field" name="email" placeholder="Email" type="email" required disabled={isLoading} />
        <input className="field" name="password" placeholder="Password" type="password" required minLength={6} disabled={isLoading} />
        {role === "JOB_SEEKER" ? <input className="field" name="phone" placeholder="Phone" disabled={isLoading} /> : null}
        {role === "EMPLOYER" ? <input className="field" name="website" placeholder="Website" type="url" disabled={isLoading} /> : null}
        <input className="field" name="location" placeholder="Location" disabled={isLoading} />
        <button className="button-primary" type="submit" disabled={isLoading}>
          <UserRoundPlus className="h-4 w-4" />
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
        {message ? <p className="text-sm font-semibold text-mint">{message}</p> : null}
      </div>
    </form>
  );
}

export function LoginForm() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(form)),
        headers: { "Content-Type": "application/json" }
      });
      
      const payload = await response.json();
      
      if (response.ok) {
        setMessage(`Welcome back, ${payload.user.name}. Redirecting...`);
        await refresh();
        
        // Redirect based on role
        if (payload.user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else if (payload.user.role === "EMPLOYER") {
          router.push("/dashboard/employer");
        } else {
          router.push("/dashboard/job-seeker");
        }
      } else {
        setMessage(payload.error ?? "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="panel p-6">
      <div className="grid gap-4">
        <input className="field" name="email" placeholder="Email" type="email" required disabled={isLoading} />
        <input className="field" name="password" placeholder="Password" type="password" required disabled={isLoading} />
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="inline-flex items-center gap-2 font-semibold text-ink/70">
            <input type="checkbox" name="remember" className="h-4 w-4 rounded border-line text-mint" disabled={isLoading} />
            Remember Me
          </label>
          <a href="#" className="font-bold text-mint">
            Forgot Password
          </a>
        </div>
        <button className="button-primary" type="submit" disabled={isLoading}>
          <LogIn className="h-4 w-4" />
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {message ? <p className="text-sm font-semibold text-mint">{message}</p> : null}
      </div>
    </form>
  );
}
