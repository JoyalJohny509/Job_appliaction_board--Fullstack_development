import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";

export const dynamic = "force-dynamic";
import * as statsService from "@/lib/services/stats.service";
import * as jobService from "@/lib/services/job.service";
import * as companyService from "@/lib/services/company.service";
import * as categoryService from "@/lib/services/category.service";
import { JobCard } from "@/components/JobCard";
import { LogoBadge } from "@/components/LogoBadge";

const testimonials = [
  {
    quote: "HirePath gave our team a cleaner way to review applicants and close roles faster.",
    name: "Maya Shah",
    title: "Talent Lead, Nova Labs"
  },
  {
    quote: "The saved jobs and application tracking flow made my search feel organized.",
    name: "Ava Patel",
    title: "Product Designer"
  },
  {
    quote: "The admin controls make quality review visible instead of hidden in spreadsheets.",
    name: "Jordan Lee",
    title: "Marketplace Operations"
  }
];

export default async function Home() {
  // Fetch all home page data in parallel from database services
  const [stats, allJobs, companies, categories] = await Promise.all([
    statsService.getDashboardStats(),
    jobService.listJobs(),
    companyService.listCompanies(),
    categoryService.listCategories()
  ]);

  const featuredJobs = allJobs.filter((job) => job.featured).slice(0, 3);
  const latestJobs = allJobs.slice(0, 4);

  return (
    <>
      <section
        className="relative overflow-hidden bg-ink text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(23,32,38,0.92), rgba(23,32,38,0.62), rgba(23,32,38,0.2)), url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover"
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow text-saffron">Full-stack job marketplace</p>
            <h1 className="mt-4 text-5xl font-black leading-tight sm:text-6xl">HirePath Job Board</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">
              Employers post jobs, job seekers apply with resumes, and admins keep the marketplace clean from one
              focused platform.
            </p>
            <form action="/jobs" className="mt-8 grid gap-3 rounded-lg bg-white p-3 shadow-soft sm:grid-cols-[1fr_1fr_auto]">
              <label className="sr-only" htmlFor="hero-keyword">
                Search keyword
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                <input
                  id="hero-keyword"
                  name="keyword"
                  className="field pl-9"
                  placeholder="Role, keyword, or company"
                />
              </div>
              <input name="location" className="field" placeholder="Location or remote" />
              <button className="button-primary" type="submit">
                Search Jobs
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/75">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-saffron" />
                Resume upload validation
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-saffron" />
                Employer application review
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-saffron" />
                Admin moderation
              </span>
            </div>
          </div>

          <div className="grid content-end gap-3">
            {[
              { label: "Open jobs", value: stats.openJobs, icon: Layers3 },
              { label: "Companies", value: stats.totalCompanies, icon: Building2 },
              { label: "Applications", value: stats.applications, icon: UsersRound }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-white/20 bg-white/12 p-4 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white/70">{item.label}</p>
                    <Icon className="h-5 w-5 text-saffron" />
                  </div>
                  <p className="mt-3 text-3xl font-black">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Featured Jobs</p>
            <h2 className="mt-2 text-3xl font-black text-ink">Roles teams are hiring for now</h2>
          </div>
          <Link href="/jobs" className="button-secondary">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredJobs.length === 0 ? (
            <p className="text-sm text-ink/60 col-span-3 py-8 text-center">No featured jobs available.</p>
          ) : (
            featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Top Companies</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Verified employers and active teams</h2>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {companies.length === 0 ? (
              <p className="text-sm text-ink/60 col-span-4 py-8 text-center">No companies registered yet.</p>
            ) : (
              companies.map((company) => (
                <article key={company.id} className="rounded-lg border border-line bg-paper p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <LogoBadge label={company.logo || ""} />
                      <div>
                        <h3 className="font-black text-ink">{company.companyName}</h3>
                        <p className="text-sm text-ink/60">{company.industry}</p>
                      </div>
                    </div>
                    {company.description && <p className="mt-4 text-sm leading-6 text-ink/65">{company.description}</p>}
                  </div>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-mint">
                    <BadgeCheck className="h-4 w-4" />
                    {company.isVerified ? "Verified" : "Pending review"}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="eyebrow">Popular Categories</p>
          <h2 className="mt-2 text-3xl font-black text-ink">Browse by team or specialty</h2>
          <p className="mt-4 text-sm leading-6 text-ink/65">
            Categories map directly to the database model and job posting workflow.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {categories.length === 0 ? (
            <p className="text-sm text-ink/60 col-span-2 py-8 text-center">No categories available.</p>
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                href={`/jobs?category=${encodeURIComponent(category.name)}`}
                className="group flex items-center justify-between rounded-lg border border-line bg-white p-4 shadow-sm transition hover:border-mint"
              >
                <span>
                  <span className="font-black text-ink">{category.name}</span>
                  <span className="mt-1 block text-sm text-ink/60">{category.openJobs} open jobs</span>
                </span>
                <ArrowRight className="h-4 w-4 text-ink/40 transition group-hover:translate-x-1 group-hover:text-mint" />
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Latest Jobs</p>
              <h2 className="mt-2 text-3xl font-black text-ink">Fresh listings</h2>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {latestJobs.length === 0 ? (
              <p className="text-sm text-ink/60 col-span-2 py-8 text-center">No jobs posted yet.</p>
            ) : (
              latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <Sparkles className="h-5 w-5 text-saffron" />
              <p className="mt-4 text-sm leading-6 text-ink/70">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-5">
                <p className="font-black text-ink">{testimonial.name}</p>
                <p className="text-sm text-ink/60">{testimonial.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { title: "Search and filters", icon: Search, body: "Keyword, company, location, salary, experience, category, and work type." },
            { title: "Application workflow", icon: BarChart3, body: "Resume, cover letter, review states, and employer decisions." },
            { title: "Admin oversight", icon: ShieldCheck, body: "Company verification, user moderation, category management, and reports." }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-white/15 p-5">
                <Icon className="h-6 w-6 text-saffron" />
                <h2 className="mt-4 text-lg font-black">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/68">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
