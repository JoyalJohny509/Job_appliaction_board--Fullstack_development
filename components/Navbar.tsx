import Link from "next/link";
import { BriefcaseBusiness, LayoutDashboard, Search, ShieldCheck, UserRoundPlus } from "lucide-react";

const navItems = [
  { href: "/jobs", label: "Jobs", icon: Search },
  { href: "/dashboard/job-seeker", label: "Job Seeker", icon: LayoutDashboard },
  { href: "/dashboard/employer", label: "Employer", icon: BriefcaseBusiness },
  { href: "/dashboard/admin", label: "Admin", icon: ShieldCheck }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-black text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm text-white">HP</span>
          <span className="text-lg">HirePath</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-ink/75 transition hover:bg-white hover:text-ink"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="button-secondary hidden sm:inline-flex">
            Login
          </Link>
          <Link href="/auth/signup" className="button-primary">
            <UserRoundPlus className="h-4 w-4" />
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}
