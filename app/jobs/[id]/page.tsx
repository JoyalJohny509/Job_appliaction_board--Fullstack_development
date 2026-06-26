import Link from "next/link";
import { notFound } from "next/navigation";
import { Banknote, BriefcaseBusiness, CalendarClock, GraduationCap, MapPin, UsersRound, ExternalLink } from "lucide-react";
import { ApplyForm } from "@/components/ApplyForm";
import { LogoBadge } from "@/components/LogoBadge";
import { SaveJobButton } from "@/components/SaveJobButton";
import * as jobService from "@/lib/services/job.service";
import { formatDate } from "@/lib/format";
import { employmentTypeLabel, workModeLabel } from "@/lib/enum-labels";

export const dynamic = "force-dynamic";

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await jobService.findJobById(id);

  if (!job) {
    notFound();
  }

  const details = [
    { label: "Salary", value: job.salary || "Competitive", icon: Banknote },
    { label: "Location", value: job.location, icon: MapPin },
    { label: "Experience", value: job.experience || "1+ years", icon: BriefcaseBusiness },
    { label: "Education", value: job.education || "Relevant experience", icon: GraduationCap },
    { label: "Vacancies", value: job.vacancies, icon: UsersRound },
    { label: "Deadline", value: formatDate(job.deadline), icon: CalendarClock }
  ];

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="min-w-0">
        <div className="panel p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-4">
              <LogoBadge label={job.company.logo || ""} size="lg" />
              <div>
                <p className="text-sm font-bold text-mint">{job.company.companyName}</p>
                <h1 className="mt-1 text-4xl font-black text-ink">{job.title}</h1>
                <p className="mt-2 text-sm text-ink/60">
                  {employmentTypeLabel(job.employmentType)} / {workModeLabel(job.workMode)} {job.category ? `/ ${job.category.name}` : ""}
                </p>
              </div>
            </div>
            <SaveJobButton jobId={job.id} />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {details.map((detail) => {
              const Icon = detail.icon;
              return (
                <div key={detail.label} className="rounded-lg border border-line bg-paper p-4">
                  <Icon className="h-5 w-5 text-coral" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-ink/45">{detail.label}</p>
                  <p className="mt-1 font-black text-ink">{detail.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <section className="panel p-6">
            <h2 className="text-2xl font-black text-ink">Description</h2>
            <p className="mt-3 leading-7 text-ink/70">{job.description}</p>
          </section>
          
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section className="panel p-6">
              <h2 className="text-2xl font-black text-ink">Responsibilities</h2>
              <ul className="mt-4 grid gap-3">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3 text-ink/70">
                    <span className="mt-2 h-2 w-2 rounded-full bg-mint flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {job.skills && job.skills.length > 0 && (
            <section className="panel p-6">
              <h2 className="text-2xl font-black text-ink">Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="rounded-md bg-mint/10 px-3 py-1.5 text-sm font-bold text-mint">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <section className="panel p-6">
              <h2 className="text-2xl font-black text-ink">Benefits</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {job.benefits.map((benefit) => (
                  <div key={benefit} className="rounded-md border border-line bg-paper px-3 py-2 text-sm font-semibold">
                    {benefit}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="panel p-6">
            <h2 className="text-2xl font-black text-ink">Company Profile</h2>
            <div className="mt-4 flex gap-4">
              <LogoBadge label={job.company.logo || ""} />
              <div>
                <h3 className="font-black text-ink">{job.company.companyName}</h3>
                <p className="text-sm text-ink/60">{job.company.industry} / {job.company.employees}</p>
                {job.company.description && <p className="mt-3 leading-6 text-ink/70">{job.company.description}</p>}
                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-mint hover:underline"
                  >
                    Visit Website
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <aside className="h-fit lg:sticky lg:top-24">
        <ApplyForm jobId={job.id} />
      </aside>
    </section>
  );
}
