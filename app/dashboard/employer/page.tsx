import { BarChart3, BriefcaseBusiness, Building2, ClipboardList, Gauge, Settings, Send, UsersRound } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { EmployerWorkspace } from "@/components/EmployerWorkspace";
import { applications, companies, getDashboardStats, jobs, users } from "@/lib/data";
import { LogoBadge } from "@/components/LogoBadge";

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Company Profile", icon: Building2 },
  { label: "Post Job", icon: Send },
  { label: "Manage Jobs", icon: ClipboardList },
  { label: "Applications", icon: UsersRound },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings }
];

export default function EmployerDashboardPage() {
  const company = companies.find((item) => item.id === "cmp-nova")!;
  const companyJobs = jobs.filter((job) => job.companyId === company.id);
  const companyApplications = applications.filter((application) =>
    companyJobs.some((job) => job.id === application.jobId)
  );
  const stats = getDashboardStats();

  return (
    <DashboardShell title="Employer Dashboard" subtitle="Company profile, job publishing, applicants, and hiring analytics." navItems={navItems}>
      <div className="grid gap-6">
        <section id="dashboard" className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Jobs" value={companyJobs.length} detail="Published by this company." icon={BriefcaseBusiness} />
          <MetricCard label="Applications" value={companyApplications.length} detail="Candidates in review." icon={UsersRound} tone="steel" />
          <MetricCard label="Views" value={companyJobs.reduce((total, job) => total + job.views, 0)} detail="Across live postings." icon={BarChart3} tone="saffron" />
          <MetricCard label="Acceptance Rate" value={`${stats.acceptanceRate}%`} detail="Accepted applications." icon={Gauge} tone="coral" />
        </section>

        <section id="company-profile" className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-4">
              <LogoBadge label={company.logo} size="lg" />
              <div>
                <h2 className="text-2xl font-black text-ink">{company.companyName}</h2>
                <p className="mt-1 text-sm text-ink/60">{company.industry} / {company.employees} / {company.location}</p>
                <p className="mt-3 max-w-3xl leading-7 text-ink/70">{company.description}</p>
              </div>
            </div>
            <span className="rounded-md bg-mint/10 px-3 py-1.5 text-sm font-bold text-mint">
              {company.isVerified ? "Verified Company" : "Verification Pending"}
            </span>
          </div>
        </section>

        <EmployerWorkspace initialJobs={companyJobs} initialApplications={companyApplications} users={users} />

        <section id="analytics" className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Hiring Rate" value={`${stats.hiringRate}%`} detail="Offer-to-application benchmark." icon={Gauge} />
          <MetricCard label="Open Jobs" value={companyJobs.filter((job) => job.status === "Open").length} detail="Currently accepting applicants." icon={BriefcaseBusiness} tone="steel" />
          <MetricCard label="Applicant Views" value={companyJobs.reduce((total, job) => total + job.views, 0)} detail="Listing traffic." icon={BarChart3} tone="saffron" />
        </section>

        <section id="settings" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold">
              Application email digest
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold">
              Close expired jobs
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
