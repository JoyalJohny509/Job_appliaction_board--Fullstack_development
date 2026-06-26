import type {
  Role,
  WorkMode,
  EmploymentType,
  JobStatus,
  ApplicationStatus,
} from "@prisma/client";

/* Re-export Prisma enums so the rest of the codebase can import from one place */
export type { Role, WorkMode, EmploymentType, JobStatus, ApplicationStatus };

/* ── User ────────────────────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string | null;
  location?: string | null;
  profilePicture?: string | null;
  resume?: string | null;
  isBanned: boolean;
  createdAt: Date;
}

/** User object with password omitted — safe to send to the client */
export type SafeUser = Omit<User, "password">;

/* ── Company ─────────────────────────────────────────────────────── */
export interface Company {
  id: string;
  ownerId: string;
  companyName: string;
  website?: string | null;
  description?: string | null;
  logo?: string | null;
  industry?: string | null;
  employees?: string | null;
  location?: string | null;
  isVerified: boolean;
  createdAt: Date;
}

/* ── Job ─────────────────────────────────────────────────────────── */
export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  education?: string | null;
  benefits: string[];
  salary?: string | null;
  salaryMin?: number | null;
  experience?: string | null;
  level?: string | null;
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  categoryId?: string | null;
  deadline: Date;
  vacancies: number;
  tags: string[];
  status: JobStatus;
  featured: boolean;
  views: number;
  createdAt: Date;
}

/* ── Application ─────────────────────────────────────────────────── */
export interface Application {
  id: string;
  jobId: string;
  userId: string;
  resume: string;
  coverLetter?: string | null;
  status: ApplicationStatus;
  appliedAt: Date;
}

/* ── SavedJob ────────────────────────────────────────────────────── */
export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  createdAt: Date;
}

/* ── Category ────────────────────────────────────────────────────── */
export interface Category {
  id: string;
  name: string;
}

/** Category with a computed open-job count (from Prisma _count) */
export interface CategoryWithCount extends Category {
  openJobs: number;
}

/* ── Notification ────────────────────────────────────────────────── */
export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

/* ── Composite types ─────────────────────────────────────────────── */
export interface JobWithCompany extends Job {
  company: Company;
}

/* ── Filters ─────────────────────────────────────────────────────── */
export interface JobFilters {
  keyword?: string;
  company?: string;
  location?: string;
  salary?: string;
  experience?: string;
  category?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  level?: string;
}

/* ── Auth / Session ──────────────────────────────────────────────── */
export interface Session {
  user: SafeUser;
}

export interface TokenPayload {
  userId: string;
  role: Role;
}
