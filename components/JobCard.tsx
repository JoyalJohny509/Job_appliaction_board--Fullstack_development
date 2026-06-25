import Link from "next/link";
import { Banknote, BriefcaseBusiness, CalendarClock, MapPin } from "lucide-react";
import { JobWithCompany } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { LogoBadge } from "@/components/LogoBadge";
import { SaveJobButton } from "@/components/SaveJobButton";

export function JobCard({ job }: { job: JobWithCompany }) {
  return (
    <article className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <LogoBadge label={job.company.logo} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-mint">{job.company.companyName}</p>
            <Link href={`/jobs/${job.id}`} className="mt-1 block text-xl font-black text-ink hover:text-mint">
              {job.title}
            </Link>
          </div>
        </div>
        <SaveJobButton jobId={job.id} />
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-ink/65">{job.description}</p>

      <div className="mt-5 grid gap-3 text-sm text-ink/70 sm:grid-cols-2">
        <span className="inline-flex items-center gap-2">
          <MapPin className="h-4 w-4 text-coral" />
          {job.location}
        </span>
        <span className="inline-flex items-center gap-2">
          <Banknote className="h-4 w-4 text-coral" />
          {job.salary}
        </span>
        <span className="inline-flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-coral" />
          {job.employmentType} / {job.workMode}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-coral" />
          Apply by {formatDate(job.deadline)}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {[job.category, job.level, ...job.skills.slice(0, 3)].map((tag) => (
          <span key={tag} className="rounded-md bg-paper px-2.5 py-1 text-xs font-bold text-ink/70">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
