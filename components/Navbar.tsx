"use client";

import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, Search, ShieldCheck, UserRoundPlus, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { user, logout } = useAuth();

  const getDashboardHref = () => {
    if (!user) return "/auth/login";
    switch (user.role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "EMPLOYER":
        return "/dashboard/employer";
      case "JOB_SEEKER":
      default:
        return "/dashboard/job-seeker";
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-black text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm text-white">HP</span>
          <span className="text-lg">HirePath</span>
        </Link>
        
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink/75 transition hover:bg-white hover:text-ink"
          >
            <Search className="h-4 w-4" />
            Jobs
          </Link>
          
          {user && (
            <Link
              href={getDashboardHref()}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink/75 transition hover:bg-white hover:text-ink"
            >
              {user.role === "ADMIN" && <ShieldCheck className="h-4 w-4" />}
              {user.role === "EMPLOYER" && <BriefcaseBusiness className="h-4 w-4" />}
              {user.role === "JOB_SEEKER" && <LayoutDashboard className="h-4 w-4" />}
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-xs font-bold text-ink">
                  {user.profilePicture || user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden text-sm font-semibold text-ink md:inline-block">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="button-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="button-secondary hidden sm:inline-flex">
                Login
              </Link>
              <Link href="/auth/signup" className="button-primary">
                <UserRoundPlus className="h-4 w-4" />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
