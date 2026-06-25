import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/jobs", label: "Search jobs" },
      { href: "/dashboard/job-seeker", label: "Saved jobs" },
      { href: "/dashboard/employer", label: "Post a job" }
    ]
  },
  {
    title: "Dashboards",
    links: [
      { href: "/dashboard/job-seeker", label: "Job seeker" },
      { href: "/dashboard/employer", label: "Employer" },
      { href: "/dashboard/admin", label: "Admin" }
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/auth/login", label: "Login" },
      { href: "/auth/signup", label: "Create account" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-lg font-black">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-white text-sm text-ink">HP</span>
            HirePath
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/70">
            A full-stack job board starter covering search, applications, resumes, employer tools, and admin review.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <h2 className="text-sm font-bold text-white">{column.title}</h2>
            <div className="mt-3 grid gap-2 text-sm text-white/70">
              {column.links.map((link) => (
                <Link key={link.href} href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
