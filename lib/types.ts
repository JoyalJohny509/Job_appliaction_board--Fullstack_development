export type UserRole = "JOB_SEEKER" | "EMPLOYER" | "ADMIN";
export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type EmploymentType = "Full Time" | "Part Time" | "Contract" | "Internship";
export type JobStatus = "Open" | "Closed" | "Flagged";
export type ApplicationStatus = "Pending" | "Reviewed" | "Interview" | "Accepted" | "Rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  location?: string;
  profilePicture?: string;
  resume?: string;
  isBanned?: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  ownerId: string;
  companyName: string;
  website: string;
  description: string;
  logo: string;
  industry: string;
  employees: string;
  location: string;
  isVerified: boolean;
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  education: string;
  benefits: string[];
  salary: string;
  salaryMin: number;
  experience: string;
  level: "Entry Level" | "Mid Level" | "Senior";
  employmentType: EmploymentType;
  workMode: WorkMode;
  location: string;
  category: string;
  deadline: string;
  vacancies: number;
  tags: string[];
  status: JobStatus;
  featured: boolean;
  views: number;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  resume: string;
  coverLetter: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
}

export interface Category {
  id: string;
  name: string;
  openJobs: number;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface JobWithCompany extends Job {
  company: Company;
}

export interface JobFilters {
  keyword?: string;
  company?: string;
  location?: string;
  salary?: string;
  experience?: string;
  category?: string;
  workMode?: WorkMode;
  employmentType?: EmploymentType;
  level?: Job["level"];
}
