"use client";

import { FormEvent, useMemo, useState } from "react";
import { Archive, Check, ClipboardList, Send, X } from "lucide-react";
import { Application, ApplicationStatus, Job, User } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function EmployerWorkspace({
  initialJobs,
  initialApplications,
  users
}: {
  initialJobs: Job[];
  initialApplications: Application[];
  users: User[];
}) {
  const [postedJobs, setPostedJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [message, setMessage] = useState("");

  const applicantRows = useMemo(() => {
    return applications.map((application) => ({
      application,
      job: postedJobs.find((job) => job.id === application.jobId),
      user: users.find((user) => user.id === application.userId)
    }));
  }, [applications, postedJobs, users]);

  async function postJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      companyId: "cmp-nova",
      title: String(form.get("title")),
      description: String(form.get("description")),
      location: String(form.get("location") || "Remote"),
      salary: String(form.get("salary") || "Competitive"),
      salaryMin: Number(form.get("salaryMin") || 0),
      experience: String(form.get("experience") || "1+ years"),
      employmentType: String(form.get("employmentType") || "Full Time"),
      workMode: String(form.get("workMode") || "Hybrid"),
      category: String(form.get("category") || "Engineering"),
      deadline: String(form.get("deadline") || "2026-08-31"),
      vacancies: Number(form.get("vacancies") || 1),
      skills: String(form.get("skills") || "")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      tags: String(form.get("tags") || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    };

    const response = await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    if (response.ok) {
      setPostedJobs((current) => [data.job, ...current]);
      event.currentTarget.reset();
      setMessage("Job posted.");
    } else {
      setMessage(data.error ?? "Could not post job.");
    }
  }

  async function closeJob(jobId: string) {
    await fetch(`/api/jobs/${jobId}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Closed" }),
      headers: { "Content-Type": "application/json" }
    });
    setPostedJobs((current) => current.map((job) => (job.id === jobId ? { ...job, status: "Closed" } : job)));
  }

  async function setApplicationStatus(applicationId: string, status: ApplicationStatus) {
    await fetch(`/api/applications/${applicationId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
      headers: { "Content-Type": "application/json" }
    });
    setApplications((current) =>
      current.map((application) => (application.id === applicationId ? { ...application, status } : application))
    );
  }

  return (
    <div className="grid gap-6">
      <section id="post-job" className="panel p-5">
        <div className="flex items-center gap-2">
          <Send className="h-5 w-5 text-coral" />
          <h2 className="text-xl font-black text-ink">Post Job</h2>
        </div>
        <form onSubmit={postJob} className="mt-5 grid gap-4 lg:grid-cols-2">
          <input className="field" name="title" placeholder="Job Title" required />
          <input className="field" name="salary" placeholder="Salary" />
          <input className="field" name="location" placeholder="Location" />
          <input className="field" name="salaryMin" type="number" placeholder="Minimum salary" />
          <select className="field" name="workMode">
            <option>Remote</option>
            <option>Hybrid</option>
            <option>On-site</option>
          </select>
          <select className="field" name="employmentType">
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
          <input className="field" name="experience" placeholder="Experience Required" />
          <input className="field" name="category" placeholder="Category" />
          <input className="field" name="deadline" type="date" />
          <input className="field" name="vacancies" type="number" placeholder="Vacancies" />
          <input className="field lg:col-span-2" name="skills" placeholder="Skills Required, comma separated" />
          <input className="field lg:col-span-2" name="tags" placeholder="Tags, comma separated" />
          <textarea className="field min-h-28 lg:col-span-2" name="description" placeholder="Description" required />
          <div className="lg:col-span-2 flex items-center gap-3">
            <button className="button-primary" type="submit">
              <Send className="h-4 w-4" />
              Publish Job
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
                    <span className="rounded-md bg-mint/10 px-2 py-1 text-xs font-bold text-mint">{job.status}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <button className="button-secondary py-1.5" type="button" onClick={() => closeJob(job.id)}>
                      <Archive className="h-4 w-4" />
                      Close
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="applications" className="panel p-5">
        <h2 className="text-xl font-black text-ink">Applications</h2>
        <div className="mt-4 grid gap-3">
          {applicantRows.map(({ application, job, user }) => (
            <article key={application.id} className="rounded-lg border border-line bg-paper p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-ink">{user?.name ?? "Applicant"}</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    {job?.title ?? "Role"} / {application.resume}
                  </p>
                </div>
                <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-ink/70">
                  {application.status}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-ink/65">{application.coverLetter}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  className="button-secondary py-1.5"
                  type="button"
                  onClick={() => setApplicationStatus(application.id, "Reviewed")}
                >
                  Reviewed
                </button>
                <button
                  className="button-primary py-1.5"
                  type="button"
                  onClick={() => setApplicationStatus(application.id, "Accepted")}
                >
                  <Check className="h-4 w-4" />
                  Accept
                </button>
                <button
                  className="inline-flex items-center gap-2 rounded-md border border-coral bg-white px-4 py-1.5 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
                  type="button"
                  onClick={() => setApplicationStatus(application.id, "Rejected")}
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
