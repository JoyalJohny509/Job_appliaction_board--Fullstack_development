import { BarChart3, BriefcaseBusiness, Building2, ClipboardList, Gauge, Settings, Send, UsersRound, PlusCircle } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { EmployerWorkspace } from "@/components/EmployerWorkspace";
import { LogoBadge } from "@/components/LogoBadge";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import * as companyService from "@/lib/services/company.service";
import * as statsService from "@/lib/services/stats.service";
import Link from "next/link";
import type { SafeUser } from "@/lib/types";

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Company Profile", icon: Building2 },
  { label: "Post Job", icon: Send },
  { label: "Manage Jobs", icon: ClipboardList },
  { label: "Applications", icon: UsersRound },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings }
];

export default async function EmployerDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");
  if (session.user.role !== "EMPLOYER") {
    redirect(session.user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/job-seeker");
  }

  const user = session.user;
  
  // Fetch company owned by this employer
  const company = await companyService.findCompanyByOwnerId(user.id);

  // Handle case where employer does not have a company profile yet
  if (!company) {
    return (
      <DashboardShell title="Employer Dashboard" subtitle="Get started by creating your company profile." navItems={navItems}>
        <div className="mx-auto max-w-md text-center py-12">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-mint/10 text-mint mx-auto mb-4">
            <Building2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-ink">Create Company Profile</h2>
          <p className="mt-2 text-sm text-ink/75">
            You must set up a company profile before you can post jobs and review applicants.
          </p>
          <div className="panel p-6 mt-6 text-left">
            <form action="/api/companies" method="POST" className="grid gap-4">
              {/* Note: In a real app we'd have a nice UI form, but we redirect them or they can use the signup form */}
              <p className="text-xs text-ink/60">
                If you just registered, your company profile should have been created automatically. Please contact support or try logging in again.
              </p>
              <Link href="/" className="button-primary justify-center mt-2">
                Return to Home
              </Link>
            </form>
          </div>
        </div>
      </DashboardShell>
    );
  }

  // Fetch jobs for this company
  const companyJobs = await prisma.job.findMany({
    where: { companyId: company.id },
    orderBy: { createdAt: "desc" },
  });

  // Fetch applications for these jobs
  const dbApplications = await prisma.application.findMany({
    where: { jobId: { in: companyJobs.map((job) => job.id) } },
    include: {
      job: true,
      user: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  // Map database applications to SafeUser representation
  const companyApplications = dbApplications.map((app) => {
    const { password, ...safeUser } = app.user;
    return {
      ...app,
      user: safeUser
    };
  });

  // Extract unique applicant users to satisfy the users prop requirement
  const uniqueUsers = Array.from(
    new Map(
      dbApplications.map((app) => {
        const { password, ...safeUser } = app.user;
        return [safeUser.id, safeUser];
      })
    ).values()
  ) as SafeUser[];

  // Fetch global dashboard stats for benchmark
  const stats = await statsService.getDashboardStats();
  const totalViews = companyJobs.reduce((total, job) => total + job.views, 0);

  return (
    <DashboardShell title="Employer Dashboard" subtitle="Company profile, job publishing, applicants, and hiring analytics." navItems={navItems}>
      <div className="grid gap-6">
        <section id="dashboard" className="grid gap-4 md:grid-cols-4">
          <MetricCard label="Jobs" value={companyJobs.length} detail="Published by this company." icon={BriefcaseBusiness} />
          <MetricCard label="Applications" value={companyApplications.length} detail="Candidates in review." icon={UsersRound} tone="steel" />
          <MetricCard label="Views" value={totalViews} detail="Across live postings." icon={BarChart3} tone="saffron" />
          <MetricCard label="Acceptance Rate" value={`${stats.acceptanceRate}%`} detail="Accepted applications." icon={Gauge} tone="coral" />
        </section>

        <section id="company-profile" className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-4">
              <LogoBadge label={company.logo || ""} size="lg" />
              <div>
                <h2 className="text-2xl font-black text-ink">{company.companyName}</h2>
                <p className="mt-1 text-sm text-ink/60">{company.industry} / {company.employees} / {company.location}</p>
                {company.description && <p className="mt-3 max-w-3xl leading-7 text-ink/70">{company.description}</p>}
              </div>
            </div>
            <span
              className={`rounded-md px-3 py-1.5 text-sm font-bold border ${
                company.isVerified ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {company.isVerified ? "Verified Company" : "Verification Pending"}
            </span>
          </div>
        </section>

        <EmployerWorkspace
          initialJobs={companyJobs as any}
          initialApplications={companyApplications as any}
          users={uniqueUsers}
          companyId={company.id}
        />

        <section id="analytics" className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Hiring Rate" value={`${stats.hiringRate}%`} detail="Offer-to-application benchmark." icon={Gauge} />
          <MetricCard label="Open Jobs" value={companyJobs.filter((job) => job.status === "OPEN").length} detail="Currently accepting applicants." icon={BriefcaseBusiness} tone="steel" />
          <MetricCard label="Applicant Views" value={totalViews} detail="Listing traffic." icon={BarChart3} tone="saffron" />
        </section>

        <section id="settings" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold cursor-pointer">
              Application email digest
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold cursor-pointer">
              Close expired jobs
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
