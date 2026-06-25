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
import { applications, getJobWithCompany, notifications, savedJobs, users } from "@/lib/data";
import { formatDate } from "@/lib/format";

const navItems = [
  { label: "Dashboard", icon: Gauge },
  { label: "Profile", icon: UserRoundCog },
  { label: "Resume", icon: FileUp },
  { label: "Saved Jobs", icon: Bookmark },
  { label: "Applied Jobs", icon: ClipboardCheck },
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings }
];

export default function JobSeekerDashboardPage() {
  const user = users.find((item) => item.id === "usr-ava")!;
  const applied = applications.filter((application) => application.userId === user.id);
  const saved = savedJobs
    .filter((savedJob) => savedJob.userId === user.id)
    .map((savedJob) => getJobWithCompany(savedJob.jobId))
    .filter(Boolean);
  const userNotifications = notifications.filter((notification) => notification.userId === user.id);

  return (
    <DashboardShell title="Job Seeker Dashboard" subtitle="Profile, resume, saved jobs, applications, and alerts." navItems={navItems}>
      <div className="grid gap-6">
        <section id="dashboard" className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Saved Jobs" value={saved.length} detail="Roles you marked for later." icon={Bookmark} />
          <MetricCard label="Applied Jobs" value={applied.length} detail="Applications submitted." icon={BriefcaseBusiness} tone="steel" />
          <MetricCard label="Unread Alerts" value={userNotifications.filter((item) => !item.isRead).length} detail="Recent application updates." icon={Bell} tone="saffron" />
        </section>

        <section id="profile" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Profile</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input className="field" defaultValue={user.name} aria-label="Name" />
            <input className="field" defaultValue={user.email} aria-label="Email" />
            <input className="field" defaultValue={user.phone} aria-label="Phone" />
            <input className="field" defaultValue={user.location} aria-label="Location" />
          </div>
        </section>

        <section id="resume" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Resume</h2>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-paper p-4">
            <div>
              <p className="font-bold text-ink">{user.resume}</p>
              <p className="mt-1 text-sm text-ink/60">Accepted formats: PDF, DOC, DOCX. Maximum size: 5 MB.</p>
            </div>
            <label className="button-secondary cursor-pointer">
              <FileUp className="h-4 w-4" />
              Upload
              <input type="file" className="sr-only" accept=".pdf,.doc,.docx" />
            </label>
          </div>
        </section>

        <section id="saved-jobs">
          <h2 className="text-xl font-black text-ink">Saved Jobs</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {saved.map((job) => (job ? <JobCard key={job.id} job={job} /> : null))}
          </div>
        </section>

        <section id="applied-jobs" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Applied Jobs</h2>
          <div className="mt-4 grid gap-3">
            {applied.map((application) => {
              const job = getJobWithCompany(application.jobId);
              return (
                <div key={application.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-paper p-4">
                  <div>
                    <p className="font-black text-ink">{job?.title}</p>
                    <p className="mt-1 text-sm text-ink/60">{job?.company.companyName} / Applied {formatDate(application.appliedAt)}</p>
                  </div>
                  <span className="rounded-md bg-white px-3 py-1 text-sm font-bold text-mint">{application.status}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section id="notifications" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Notifications</h2>
          <div className="mt-4 grid gap-3">
            {userNotifications.map((notification) => (
              <div key={notification.id} className="rounded-lg border border-line bg-paper p-4">
                <p className="font-semibold text-ink">{notification.message}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-ink/45">{formatDate(notification.createdAt)}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="settings" className="panel p-5">
          <h2 className="text-xl font-black text-ink">Settings</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold">
              Email notifications
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-line bg-paper p-4 text-sm font-semibold">
              Job match alerts
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </label>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
