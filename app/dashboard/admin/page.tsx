import { BarChart3, BriefcaseBusiness, Building2, Flag, Gauge, Layers3, Settings, ShieldAlert, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { AdminWorkspace } from "@/components/AdminWorkspace";
import { companies, getDashboardStats, jobs, users } from "@/lib/data";

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

export default function AdminDashboardPage() {
  const stats = getDashboardStats();

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
              ["Fake job reports", "2 open"],
              ["Company verification", `${companies.filter((company) => !company.isVerified).length} pending`],
              ["Banned users", `${users.filter((user) => user.isBanned).length} users`]
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

        <AdminWorkspace initialUsers={users} initialCompanies={companies} initialJobs={jobs} />

        <section id="settings" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold">
              Manual company verification
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold">
              Auto-hide flagged jobs
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
