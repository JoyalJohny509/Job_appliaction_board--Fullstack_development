"use client";

import { useState } from "react";
import { Ban, BadgeCheck, Trash2 } from "lucide-react";
import { Company, Job, User } from "@/lib/types";

export function AdminWorkspace({
  initialUsers,
  initialCompanies,
  initialJobs
}: {
  initialUsers: User[];
  initialCompanies: Company[];
  initialJobs: Job[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [companies, setCompanies] = useState(initialCompanies);
  const [jobs, setJobs] = useState(initialJobs);

  function banUser(userId: string) {
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, isBanned: true } : user)));
  }

  function verifyCompany(companyId: string) {
    setCompanies((current) =>
      current.map((company) => (company.id === companyId ? { ...company, isVerified: true } : company))
    );
  }

  async function deleteFakeJob(jobId: string) {
    await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
    setJobs((current) => current.filter((job) => job.id !== jobId));
  }

  return (
    <div className="grid gap-6">
      <section id="users" className="panel p-5">
        <h2 className="text-xl font-black text-ink">Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-3 pr-4 font-bold text-ink">{user.name}</td>
                  <td className="py-3 pr-4 text-ink/65">{user.email}</td>
                  <td className="py-3 pr-4 text-ink/65">{user.role.replace("_", " ")}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-ink/70">
                      {user.isBanned ? "Banned" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <button className="button-secondary py-1.5" type="button" onClick={() => banUser(user.id)}>
                      <Ban className="h-4 w-4" />
                      Ban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="employers" className="panel p-5">
        <h2 className="text-xl font-black text-ink">Employers</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {companies.map((company) => (
            <article key={company.id} className="rounded-lg border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black text-ink">{company.companyName}</h3>
                  <p className="mt-1 text-sm text-ink/60">{company.industry} / {company.location}</p>
                </div>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-ink/70">
                  {company.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <button className="button-secondary mt-4 py-1.5" type="button" onClick={() => verifyCompany(company.id)}>
                <BadgeCheck className="h-4 w-4" />
                Verify
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="jobs" className="panel p-5">
        <h2 className="text-xl font-black text-ink">Jobs</h2>
        <div className="mt-4 grid gap-3">
          {jobs.map((job) => (
            <article key={job.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-paper p-4">
              <div>
                <h3 className="font-black text-ink">{job.title}</h3>
                <p className="mt-1 text-sm text-ink/60">
                  {job.category} / {job.status} / {job.views} views
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-coral bg-white px-4 py-2 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
                type="button"
                onClick={() => deleteFakeJob(job.id)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>

      <section id="categories" className="panel p-5">
        <h2 className="text-xl font-black text-ink">Categories</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Design", "Engineering", "Marketing", "Product", "Sales", "Data"].map((category) => (
            <span key={category} className="rounded-md bg-paper px-3 py-2 text-sm font-bold text-ink/70">
              {category}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
