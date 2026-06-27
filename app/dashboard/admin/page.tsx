import { BarChart3, BriefcaseBusiness, Building2, Flag, Gauge, Layers3, Settings, ShieldAlert, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { AdminWorkspace } from "@/components/AdminWorkspace";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import * as statsService from "@/lib/services/stats.service";
import * as userService from "@/lib/services/user.service";
import * as companyService from "@/lib/services/company.service";
import type { SafeUser, Company, Job } from "@/lib/types";

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Users", icon: UsersRound },
  { label: "Employers", icon: Building2 },
  { label: "Jobs", icon: BriefcaseBusiness },
  { label: "Reports", icon: Flag },
  { label: "Analytics", icon: BarChart3 },
  { label: "Categories", icon: Layers3 },
  { label: "Settings", icon: Settings }
];

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") {
    redirect(session.user.role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/job-seeker");
  }

  // Fetch all administration data \u2014 wrapped in try/catch for Vercel resilience
  const fallbackStats = { totalUsers: 0, totalCompanies: 0, totalJobs: 0, openJobs: 0, applications: 0, dailyActiveUsers: 0, views: 0, acceptanceRate: 0, hiringRate: 0 };
  let stats = fallbackStats;
  let allUsers: Awaited<ReturnType<typeof userService.listUsers>> = [];
  let allCompanies: Awaited<ReturnType<typeof companyService.listCompanies>> = [];
  let dbJobs: Awaited<ReturnType<typeof prisma.job.findMany>> = [];
  try {
    [stats, allUsers, allCompanies, dbJobs] = await Promise.all([
      statsService.getDashboardStats(),
      userService.listUsers(),
      companyService.listCompanies(),
      prisma.job.findMany({ orderBy: { createdAt: "desc" } })
    ]);
  } catch (err) {
    console.error("Failed to load admin dashboard data:", err);
  }

  // Cast dbJobs to Job[] type
  const allJobs = dbJobs as unknown as Job[];

  // Pending verification company count
  const pendingVerification = allCompanies.filter((company) => !company.isVerified).length;
  // Banned users count
  const bannedUsersCount = allUsers.filter((user) => user.isBanned).length;

  return (
    <DashboardShell title="Admin Dashboard" subtitle="Users, employers, jobs, reports, analytics, and categories." navItems={navItems}>
      <div className="grid gap-6">
        <section id="dashboard" className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          <MetricCard label="Total Users" value={stats.totalUsers} detail="Registered accounts." icon={UsersRound} />
          <MetricCard label="Companies" value={stats.totalCompanies} detail="Employer profiles." icon={Building2} tone="steel" />
          <MetricCard label="Jobs" value={stats.totalJobs} detail="All listings." icon={BriefcaseBusiness} tone="saffron" />
          <MetricCard label="Applications" value={stats.applications} detail="Submitted applications." icon={Flag} tone="coral" />
          <MetricCard label="Daily Active" value={stats.dailyActiveUsers} detail="Demo activity count." icon={BarChart3} />
        </section>

        <section id="reports" className="panel p-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-coral" />
            <h2 className="text-xl font-black text-ink">Reports</h2>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["Fake job reports", "0 open"],
              ["Company verification", `${pendingVerification} pending`],
              ["Banned users", `${bannedUsersCount} users`]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line bg-paper p-4">
                <p className="text-sm font-semibold text-ink/60">{label}</p>
                <p className="mt-2 text-2xl font-black text-ink">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="analytics" className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Marketplace Views" value={stats.views} detail="Total job listing views." icon={BarChart3} />
          <MetricCard label="Open Jobs" value={stats.openJobs} detail="Accepting applications." icon={BriefcaseBusiness} tone="steel" />
          <MetricCard label="Hiring Rate" value={`${stats.hiringRate}%`} detail="Marketplace hiring rate." icon={Gauge} tone="saffron" />
        </section>

        <AdminWorkspace
          initialUsers={allUsers as SafeUser[]}
          initialCompanies={allCompanies as Company[]}
          initialJobs={allJobs}
        />

        <section id="settings" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold cursor-pointer">
              Manual company verification
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold cursor-pointer">
              Auto-hide flagged jobs
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
