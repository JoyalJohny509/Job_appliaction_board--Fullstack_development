"use client";

import { FormEvent, useMemo, useState } from "react";
import { Archive, Check, ClipboardList, Send, X, ExternalLink } from "lucide-react";
import type { Application, Job, SafeUser } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { ApplicationStatus, JobStatus } from "@prisma/client";

export function EmployerWorkspace({
  initialJobs,
  initialApplications,
  users,
  companyId
}: {
  initialJobs: Job[];
  initialApplications: Application[];
  users: SafeUser[];
  companyId: string;
}) {
  const [postedJobs, setPostedJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const applicantRows = useMemo(() => {
    return applications.map((application) => ({
      application,
      job: postedJobs.find((job) => job.id === application.jobId),
      user: users.find((user) => user.id === application.userId)
    }));
  }, [applications, postedJobs, users]);

  async function postJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      companyId,
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      location: String(formData.get("location") || "Remote"),
      salary: String(formData.get("salary") || "Competitive"),
      salaryMin: Number(formData.get("salaryMin") || 0),
      experience: String(formData.get("experience") || "1+ years"),
      employmentType: String(formData.get("employmentType") || "Full Time"),
      workMode: String(formData.get("workMode") || "Hybrid"),
      category: String(formData.get("category") || "Engineering"),
      deadline: String(formData.get("deadline") || "2026-08-31"),
      vacancies: Number(formData.get("vacancies") || 1),
      skills: String(formData.get("skills") || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      tags: String(formData.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (response.ok) {
        setPostedJobs((current) => [data.job, ...current]);
        form.reset();
        setMessage("Job posted successfully.");
      } else {
        setMessage(data.error ?? "Could not post job.");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function closeJob(jobId: string) {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        body: JSON.stringify({ status: JobStatus.CLOSED }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        setPostedJobs((current) => current.map((job) => (job.id === jobId ? { ...job, status: JobStatus.CLOSED } : job)));
      }
    } catch (error) {
      console.error("Error closing job:", error);
    }
  }

  async function setApplicationStatus(applicationId: string, status: ApplicationStatus) {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        setApplications((current) =>
          current.map((application) => (application.id === applicationId ? { ...application, status } : application))
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  }

  return (
    <div className="grid gap-6">
      <section id="post-job" className="panel p-5">
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-coral" />
          <h2 className="text-xl font-black text-ink">Post Job</h2>
        </div>
        <form onSubmit={postJob} className="mt-5 grid gap-4 lg:grid-cols-2">
          <input className="field" name="title" placeholder="Job Title" required disabled={loading} />
          <input className="field" name="salary" placeholder="Salary (e.g. $90k - $120k)" disabled={loading} />
          <input className="field" name="location" placeholder="Location" disabled={loading} />
          <input className="field" name="salaryMin" type="number" placeholder="Minimum salary (numeric value, e.g. 90000)" disabled={loading} />
          <select className="field" name="workMode" disabled={loading}>
            <option>Hybrid</option>
            <option>Remote</option>
            <option>On-site</option>
          </select>
          <select className="field" name="employmentType" disabled={loading}>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
          <input className="field" name="experience" placeholder="Experience Required (e.g. 3+ years)" disabled={loading} />
          <input className="field" name="category" placeholder="Category (e.g. Engineering, Design)" disabled={loading} />
          <input className="field" name="deadline" type="date" disabled={loading} />
          <input className="field" name="vacancies" type="number" placeholder="Vacancies" disabled={loading} />
          <input className="field lg:col-span-2" name="skills" placeholder="Skills Required, comma separated" disabled={loading} />
          <input className="field lg:col-span-2" name="tags" placeholder="Tags, comma separated" disabled={loading} />
          <textarea className="field min-h-28 lg:col-span-2" name="description" placeholder="Description" required disabled={loading} />
          <div className="lg:col-span-2 flex items-center gap-3">
            <button className="button-primary" type="submit" disabled={loading}>
              <Send className="h-4 w-4" />
              {loading ? "Publishing..." : "Publish Job"}
            </button>
            {message ? <p className="text-sm font-semibold text-mint">{message}</p> : null}
          </div>
        </form>
      </section>

      <section id="manage-jobs" className="panel p-5">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-coral" />
          <h2 className="text-xl font-black text-ink">Manage Jobs</h2>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="py-3 pr-4">Title</th>
                <th className="py-3 pr-4">Deadline</th>
                <th className="py-3 pr-4">Views</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {postedJobs.map((job) => (
                <tr key={job.id}>
                  <td className="py-3 pr-4 font-bold text-ink">{job.title}</td>
                  <td className="py-3 pr-4 text-ink/65">{formatDate(job.deadline)}</td>
                  <td className="py-3 pr-4 text-ink/65">{job.views}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-bold border ${
                        job.status === JobStatus.OPEN
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {job.status === JobStatus.OPEN && (
                      <button className="button-secondary py-1.5" type="button" onClick={() => closeJob(job.id)}>
                        <Archive className="h-4 w-4" />
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="applications" className="panel p-5">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-coral" />
          <h2 className="text-xl font-black text-ink">Applications</h2>
        </div>
        <div className="mt-4 grid gap-3">
          {applicantRows.length === 0 ? (
            <p className="text-sm text-ink/60 py-4 text-center">No applications received yet.</p>
          ) : (
            applicantRows.map(({ application, job, user }) => (
              <article key={application.id} className="rounded-lg border border-line bg-paper p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-ink">{user?.name ?? "Applicant"}</h3>
                    <p className="mt-1 text-sm text-ink/60 flex items-center gap-2 flex-wrap">
                      <span>{job?.title ?? "Role"}</span>
                      <span className="text-line">|</span>
                      {application.resume.startsWith("http") ? (
                        <a
                          href={application.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-mint hover:underline inline-flex items-center gap-1"
                        >
                          Download Resume
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <span>{application.resume}</span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`rounded-md px-2.5 py-1 text-xs font-bold border ${
                      application.status === ApplicationStatus.ACCEPTED
                        ? "bg-green-50 text-green-700 border-green-200"
                        : application.status === ApplicationStatus.REJECTED
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-white text-ink/70 border-line"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
                {application.coverLetter && (
                  <p className="mt-3 text-sm leading-6 text-ink/65 bg-white p-3 rounded border border-line">
                    {application.coverLetter}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  {application.status === ApplicationStatus.PENDING && (
                    <button
                      className="button-secondary py-1.5"
                      type="button"
                      onClick={() => setApplicationStatus(application.id, ApplicationStatus.REVIEWED)}
                    >
                      Mark Reviewed
                    </button>
                  )}
                  {application.status !== ApplicationStatus.ACCEPTED && (
                    <button
                      className="button-primary py-1.5 inline-flex items-center gap-1.5"
                      type="button"
                      onClick={() => setApplicationStatus(application.id, ApplicationStatus.ACCEPTED)}
                    >
                      <Check className="h-4 w-4" />
                      Accept
                    </button>
                  )}
                  {application.status !== ApplicationStatus.REJECTED && (
                    <button
                      className="inline-flex items-center gap-2 rounded-md border border-coral bg-white px-4 py-1.5 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
                      type="button"
                      onClick={() => setApplicationStatus(application.id, ApplicationStatus.REJECTED)}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
