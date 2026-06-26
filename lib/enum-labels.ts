import { Role, WorkMode, EmploymentType, JobStatus, ApplicationStatus } from "@prisma/client";

/* ── Role ────────────────────────────────────────────────────────── */
export const ROLE_LABELS: Record<Role, string> = {
  JOB_SEEKER: "Job Seeker",
  EMPLOYER: "Employer",
  ADMIN: "Admin",
};
export function roleLabel(value: Role) {
  return ROLE_LABELS[value];
}

/* ── WorkMode ────────────────────────────────────────────────────── */
export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};
export const WORK_MODE_OPTIONS = Object.entries(WORK_MODE_LABELS) as [WorkMode, string][];
export function workModeLabel(value: WorkMode) {
  return WORK_MODE_LABELS[value];
}
export function parseWorkMode(display: string): WorkMode | undefined {
  return (Object.entries(WORK_MODE_LABELS) as [WorkMode, string][]).find(
    ([, label]) => label.toLowerCase() === display.toLowerCase()
  )?.[0];
}

/* ── EmploymentType ──────────────────────────────────────────────── */
export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};
export const EMPLOYMENT_TYPE_OPTIONS = Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][];
export function employmentTypeLabel(value: EmploymentType) {
  return EMPLOYMENT_TYPE_LABELS[value];
}
export function parseEmploymentType(display: string): EmploymentType | undefined {
  return (Object.entries(EMPLOYMENT_TYPE_LABELS) as [EmploymentType, string][]).find(
    ([, label]) => label.toLowerCase() === display.toLowerCase()
  )?.[0];
}

/* ── JobStatus ───────────────────────────────────────────────────── */
export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  OPEN: "Open",
  CLOSED: "Closed",
  FLAGGED: "Flagged",
};
export function jobStatusLabel(value: JobStatus) {
  return JOB_STATUS_LABELS[value];
}
export function parseJobStatus(display: string): JobStatus | undefined {
  return (Object.entries(JOB_STATUS_LABELS) as [JobStatus, string][]).find(
    ([, label]) => label.toLowerCase() === display.toLowerCase()
  )?.[0];
}

/* ── ApplicationStatus ───────────────────────────────────────────── */
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  REVIEWED: "Reviewed",
  INTERVIEW: "Interview",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};
export function applicationStatusLabel(value: ApplicationStatus) {
  return APPLICATION_STATUS_LABELS[value];
}
export function parseApplicationStatus(display: string): ApplicationStatus | undefined {
  return (Object.entries(APPLICATION_STATUS_LABELS) as [ApplicationStatus, string][]).find(
    ([, label]) => label.toLowerCase() === display.toLowerCase()
  )?.[0];
}

/* ── Job Level (plain string, not a Prisma enum) ─────────────────── */
export const JOB_LEVELS = ["Entry Level", "Mid Level", "Senior"] as const;
export type JobLevel = (typeof JOB_LEVELS)[number];
