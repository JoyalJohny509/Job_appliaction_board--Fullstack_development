import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  FileUp,
  Settings,
  UserRoundCog,
  ClipboardCheck,
  Gauge
} from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { MetricCard } from "@/components/MetricCard";
import { JobCard } from "@/components/JobCard";
import { ProfileEditor } from "@/components/ProfileEditor";
import { ResumeUploader } from "@/components/ResumeUploader";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import * as savedJobService from "@/lib/services/saved-job.service";
import * as applicationService from "@/lib/services/application.service";
import * as notificationService from "@/lib/services/notification.service";
import { formatDate } from "@/lib/format";
import type { JobWithCompany } from "@/lib/types";

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Profile", icon: UserRoundCog },
  { label: "Resume", icon: FileUp },
  { label: "Saved Jobs", icon: Bookmark },
  { label: "Applied Jobs", icon: ClipboardCheck },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings }
];

export default async function JobSeekerDashboardPage() {
  const session = await getSession();
  
  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "JOB_SEEKER") {
    redirect(session.user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/employer");
  }

  const user = session.user;

  // Fetch real data from database services in parallel for performance
  const [dbSavedJobs, dbApplications, dbNotifications] = await Promise.all([
    savedJobService.getSavedJobs(user.id),
    applicationService.listApplications({ userId: user.id }),
    notificationService.listNotifications(user.id),
  ]);

  // Extract jobs from saved jobs wrapper
  const saved = dbSavedJobs.map((sj) => sj.job) as unknown as JobWithCompany[];
  const unreadAlerts = dbNotifications.filter((item) => !item.isRead).length;

  return (
    <DashboardShell title="Job Seeker Dashboard" subtitle="Profile, resume, saved jobs, applications, and alerts." navItems={navItems}>
      <div className="grid gap-6">
        <section id="dashboard" className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Saved Jobs" value={saved.length} detail="Roles you marked for later." icon={Bookmark} />
          <MetricCard label="Applied Jobs" value={dbApplications.length} detail="Applications submitted." icon={BriefcaseBusiness} tone="steel" />
          <MetricCard label="Unread Alerts" value={unreadAlerts} detail="Recent application updates." icon={Bell} tone="saffron" />
        </section>

        <ProfileEditor initialUser={user} />

        <ResumeUploader initialUser={user} />

        <section id="saved-jobs">
          <h2 className="text-xl font-black text-ink">Saved Jobs</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {saved.length === 0 ? (
              <p className="text-sm text-ink/60 col-span-2 py-4 text-center">No saved jobs yet.</p>
            ) : (
              saved.map((job) => (job ? <JobCard key={job.id} job={job} /> : null))
            )}
          </div>
        </section>

        <section id="applied-jobs" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Applied Jobs</h2>
          <div className="mt-4 grid gap-3">
            {dbApplications.length === 0 ? (
              <p className="text-sm text-ink/60 py-4 text-center">No applications submitted yet.</p>
            ) : (
              dbApplications.map((application) => {
                const job = application.job;
                return (
                  <div key={application.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-paper p-4">
                    <div>
                      <p className="font-black text-ink">{job?.title}</p>
                      <p className="mt-1 text-sm text-ink/60">{job?.company?.companyName} / Applied {formatDate(application.appliedAt)}</p>
                    </div>
                    <span className="rounded-md bg-white border border-line px-3 py-1 text-sm font-bold text-mint">{application.status}</span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section id="notifications" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Notifications</h2>
          <div className="mt-4 grid gap-3">
            {dbNotifications.length === 0 ? (
              <p className="text-sm text-ink/60 py-4 text-center">No notifications yet.</p>
            ) : (
              dbNotifications.map((notification) => (
                <div key={notification.id} className="rounded-lg border border-line bg-paper p-4">
                  <p className="font-semibold text-ink">{notification.message}</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink/45">{formatDate(notification.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="settings" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold cursor-pointer">
              Email notifications
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold cursor-pointer">
              Job match alerts
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
