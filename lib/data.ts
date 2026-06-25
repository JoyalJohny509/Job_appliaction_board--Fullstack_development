import {
  Application,
  ApplicationStatus,
  Category,
  Company,
  EmploymentType,
  Job,
  JobFilters,
  JobWithCompany,
  Notification,
  SavedJob,
  User,
  UserRole,
  WorkMode
} from "@/lib/types";

export const categories: Category[] = [
  { id: "cat-design", name: "Design", openJobs: 18 },
  { id: "cat-engineering", name: "Engineering", openJobs: 42 },
  { id: "cat-marketing", name: "Marketing", openJobs: 15 },
  { id: "cat-product", name: "Product", openJobs: 21 },
  { id: "cat-sales", name: "Sales", openJobs: 12 },
  { id: "cat-data", name: "Data", openJobs: 16 }
];

export let users: User[] = [
  {
    id: "usr-ava",
    name: "Ava Patel",
    email: "ava@example.com",
    password: "password",
    role: "JOB_SEEKER",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    profilePicture: "AP",
    resume: "ava-patel-resume.pdf",
    createdAt: "2026-03-12"
  },
  {
    id: "usr-nova-owner",
    name: "Maya Shah",
    email: "maya@novalabs.example",
    password: "password",
    role: "EMPLOYER",
    phone: "+91 99887 77665",
    location: "Mumbai, India",
    profilePicture: "MS",
    createdAt: "2026-02-21"
  },
  {
    id: "usr-admin",
    name: "Jordan Lee",
    email: "admin@hirepath.example",
    password: "password",
    role: "ADMIN",
    phone: "+1 415 555 0129",
    location: "Remote",
    profilePicture: "JL",
    createdAt: "2026-01-04"
  },
  {
    id: "usr-omar",
    name: "Omar Khan",
    email: "omar@example.com",
    password: "password",
    role: "JOB_SEEKER",
    phone: "+91 90000 11122",
    location: "Hyderabad, India",
    profilePicture: "OK",
    createdAt: "2026-04-19"
  }
];

export let companies: Company[] = [
  {
    id: "cmp-nova",
    ownerId: "usr-nova-owner",
    companyName: "Nova Labs",
    website: "https://novalabs.example",
    description: "Nova Labs builds collaboration software for distributed product teams.",
    logo: "NL",
    industry: "SaaS",
    employees: "201-500",
    location: "Mumbai, India",
    isVerified: true
  },
  {
    id: "cmp-verdant",
    ownerId: "usr-nova-owner",
    companyName: "Verdant Cloud",
    website: "https://verdant.example",
    description: "Cloud infrastructure for energy-conscious companies.",
    logo: "VC",
    industry: "Cloud Infrastructure",
    employees: "501-1000",
    location: "Remote",
    isVerified: true
  },
  {
    id: "cmp-pulse",
    ownerId: "usr-nova-owner",
    companyName: "Pulse Retail",
    website: "https://pulse.example",
    description: "Retail analytics and inventory intelligence for modern stores.",
    logo: "PR",
    industry: "Retail Analytics",
    employees: "51-200",
    location: "Pune, India",
    isVerified: false
  },
  {
    id: "cmp-bright",
    ownerId: "usr-nova-owner",
    companyName: "BrightCare",
    website: "https://brightcare.example",
    description: "Digital health workflows for clinics and care networks.",
    logo: "BC",
    industry: "HealthTech",
    employees: "1001-5000",
    location: "Delhi, India",
    isVerified: true
  }
];

export let jobs: Job[] = [
  {
    id: "job-product-designer",
    companyId: "cmp-nova",
    title: "Senior Product Designer",
    description: "Lead design for Nova Labs' hiring collaboration suite from research to polished product delivery.",
    responsibilities: [
      "Run discovery with recruiters and hiring managers",
      "Design flows for job posting, candidate review, and analytics",
      "Partner with engineering on accessible UI implementation",
      "Maintain product design standards across dashboards"
    ],
    skills: ["Figma", "Design Systems", "UX Research", "Accessibility"],
    education: "Bachelor's degree or equivalent product design experience",
    benefits: ["Remote stipend", "Health insurance", "Learning budget", "Flexible hours"],
    salary: "$90k - $125k",
    salaryMin: 90000,
    experience: "5+ years",
    level: "Senior",
    employmentType: "Full Time",
    workMode: "Hybrid",
    location: "Mumbai, India",
    category: "Design",
    deadline: "2026-08-14",
    vacancies: 2,
    tags: ["Design", "SaaS", "B2B"],
    status: "Open",
    featured: true,
    views: 1840,
    createdAt: "2026-06-08"
  },
  {
    id: "job-full-stack",
    companyId: "cmp-verdant",
    title: "Full Stack Engineer",
    description: "Build reliable product surfaces and APIs for a high-growth cloud platform.",
    responsibilities: [
      "Develop Next.js interfaces and Express services",
      "Own PostgreSQL-backed workflows with Prisma",
      "Improve observability and deployment quality",
      "Review code and mentor junior engineers"
    ],
    skills: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "TypeScript"],
    education: "Computer science degree preferred, practical experience valued",
    benefits: ["Equity", "Home office setup", "Paid certifications", "Wellness support"],
    salary: "$110k - $145k",
    salaryMin: 110000,
    experience: "4+ years",
    level: "Mid Level",
    employmentType: "Full Time",
    workMode: "Remote",
    location: "Remote",
    category: "Engineering",
    deadline: "2026-07-28",
    vacancies: 3,
    tags: ["Remote", "Platform", "TypeScript"],
    status: "Open",
    featured: true,
    views: 2410,
    createdAt: "2026-06-12"
  },
  {
    id: "job-marketing-analyst",
    companyId: "cmp-pulse",
    title: "Marketing Data Analyst",
    description: "Turn campaign, product, and sales signals into decisions for retail customers.",
    responsibilities: [
      "Create dashboards for acquisition and lifecycle metrics",
      "Build campaign reports and experiment readouts",
      "Collaborate with marketing and sales leadership",
      "Maintain clean, trusted reporting datasets"
    ],
    skills: ["SQL", "Excel", "Looker", "Campaign Analytics"],
    education: "Bachelor's degree in business, statistics, marketing, or related field",
    benefits: ["Annual bonus", "Team retreats", "Mentorship program"],
    salary: "$60k - $82k",
    salaryMin: 60000,
    experience: "2+ years",
    level: "Entry Level",
    employmentType: "Full Time",
    workMode: "On-site",
    location: "Pune, India",
    category: "Marketing",
    deadline: "2026-07-10",
    vacancies: 1,
    tags: ["Analytics", "Retail", "SQL"],
    status: "Open",
    featured: false,
    views: 965,
    createdAt: "2026-06-15"
  },
  {
    id: "job-product-manager",
    companyId: "cmp-bright",
    title: "Product Manager, Patient Experience",
    description: "Shape digital appointment, intake, and follow-up experiences for care teams and patients.",
    responsibilities: [
      "Prioritize roadmap items with clinical and business stakeholders",
      "Write crisp product requirements and success metrics",
      "Coordinate releases across design, engineering, and support",
      "Use feedback loops to improve adoption"
    ],
    skills: ["Product Strategy", "Roadmapping", "Healthcare Workflows", "Analytics"],
    education: "MBA or equivalent product leadership experience preferred",
    benefits: ["Medical coverage", "Paid parental leave", "Leadership coaching"],
    salary: "$100k - $132k",
    salaryMin: 100000,
    experience: "5+ years",
    level: "Senior",
    employmentType: "Full Time",
    workMode: "Hybrid",
    location: "Delhi, India",
    category: "Product",
    deadline: "2026-08-05",
    vacancies: 1,
    tags: ["HealthTech", "Product", "Hybrid"],
    status: "Open",
    featured: true,
    views: 1518,
    createdAt: "2026-06-03"
  },
  {
    id: "job-sales-contract",
    companyId: "cmp-nova",
    title: "Contract Sales Development Representative",
    description: "Open qualified conversations with mid-market companies adopting modern recruiting workflows.",
    responsibilities: [
      "Research target accounts and contacts",
      "Run outbound email and phone sequences",
      "Qualify prospects and schedule discovery calls",
      "Log insights for marketing and account executives"
    ],
    skills: ["Prospecting", "CRM", "Communication", "B2B Sales"],
    education: "Any bachelor's degree or equivalent sales training",
    benefits: ["Performance incentive", "Remote-first team", "Sales coaching"],
    salary: "$38k - $52k",
    salaryMin: 38000,
    experience: "1+ years",
    level: "Entry Level",
    employmentType: "Contract",
    workMode: "Remote",
    location: "Remote",
    category: "Sales",
    deadline: "2026-07-20",
    vacancies: 4,
    tags: ["Contract", "Remote", "Sales"],
    status: "Open",
    featured: false,
    views: 742,
    createdAt: "2026-06-18"
  },
  {
    id: "job-data-intern",
    companyId: "cmp-verdant",
    title: "Data Engineering Intern",
    description: "Support pipeline quality and internal reporting for infrastructure usage analytics.",
    responsibilities: [
      "Write transformation jobs with review from senior engineers",
      "Document data sources and ownership",
      "Investigate data quality alerts",
      "Ship small improvements to analytics tooling"
    ],
    skills: ["Python", "SQL", "Data Pipelines", "Documentation"],
    education: "Current student or recent graduate in computer science, data, or engineering",
    benefits: ["Paid internship", "Mentor pairing", "Conversion opportunity"],
    salary: "$24/hr - $32/hr",
    salaryMin: 48000,
    experience: "0-1 years",
    level: "Entry Level",
    employmentType: "Internship",
    workMode: "Remote",
    location: "Remote",
    category: "Data",
    deadline: "2026-07-04",
    vacancies: 2,
    tags: ["Internship", "Data", "Python"],
    status: "Open",
    featured: false,
    views: 1102,
    createdAt: "2026-06-20"
  }
];

export let applications: Application[] = [
  {
    id: "app-001",
    jobId: "job-full-stack",
    userId: "usr-ava",
    resume: "ava-patel-resume.pdf",
    coverLetter: "I have built production Next.js and Prisma workflows and enjoy platform work.",
    status: "Interview",
    appliedAt: "2026-06-19"
  },
  {
    id: "app-002",
    jobId: "job-product-manager",
    userId: "usr-ava",
    resume: "ava-patel-resume.pdf",
    coverLetter: "My design background helps me collaborate closely with product and engineering.",
    status: "Reviewed",
    appliedAt: "2026-06-16"
  },
  {
    id: "app-003",
    jobId: "job-product-designer",
    userId: "usr-omar",
    resume: "omar-khan-resume.docx",
    coverLetter: "I have shipped hiring and onboarding product experiences in SaaS.",
    status: "Pending",
    appliedAt: "2026-06-21"
  }
];

export let savedJobs: SavedJob[] = [
  { id: "save-001", userId: "usr-ava", jobId: "job-product-designer" },
  { id: "save-002", userId: "usr-ava", jobId: "job-data-intern" }
];

export let notifications: Notification[] = [
  {
    id: "note-001",
    userId: "usr-ava",
    message: "Application submitted for Full Stack Engineer.",
    isRead: false,
    createdAt: "2026-06-19"
  },
  {
    id: "note-002",
    userId: "usr-ava",
    message: "Interview scheduled with Verdant Cloud.",
    isRead: false,
    createdAt: "2026-06-22"
  },
  {
    id: "note-003",
    userId: "usr-ava",
    message: "New matching job: Senior Product Designer.",
    isRead: true,
    createdAt: "2026-06-23"
  }
];

export const roleLabels: Record<UserRole, string> = {
  JOB_SEEKER: "Job Seeker",
  EMPLOYER: "Employer",
  ADMIN: "Admin"
};

export function getCompany(companyId: string) {
  return companies.find((company) => company.id === companyId);
}

export function getJob(jobId: string) {
  return jobs.find((job) => job.id === jobId);
}

export function getJobWithCompany(jobId: string): JobWithCompany | undefined {
  const job = getJob(jobId);
  const company = job ? getCompany(job.companyId) : undefined;
  return job && company ? { ...job, company } : undefined;
}

export function getJobsWithCompanies(sourceJobs = jobs): JobWithCompany[] {
  return sourceJobs
    .map((job) => {
      const company = getCompany(job.companyId);
      return company ? { ...job, company } : undefined;
    })
    .filter(Boolean) as JobWithCompany[];
}

export function listJobs(filters: JobFilters = {}) {
  const keyword = filters.keyword?.toLowerCase().trim();
  const company = filters.company?.toLowerCase().trim();
  const location = filters.location?.toLowerCase().trim();
  const minSalary = filters.salary ? Number(filters.salary) : undefined;

  const filtered = getJobsWithCompanies().filter((job) => {
    const keywordMatch =
      !keyword ||
      [
        job.title,
        job.description,
        job.category,
        job.company.companyName,
        job.location,
        ...job.skills,
        ...job.tags
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

    const companyMatch = !company || job.company.companyName.toLowerCase().includes(company);
    const locationMatch = !location || job.location.toLowerCase().includes(location);
    const salaryMatch = !minSalary || job.salaryMin >= minSalary;
    const experienceMatch = !filters.experience || job.experience.includes(filters.experience);
    const categoryMatch = !filters.category || job.category === filters.category;
    const workModeMatch = !filters.workMode || job.workMode === filters.workMode;
    const employmentMatch = !filters.employmentType || job.employmentType === filters.employmentType;
    const levelMatch = !filters.level || job.level === filters.level;

    return (
      keywordMatch &&
      companyMatch &&
      locationMatch &&
      salaryMatch &&
      experienceMatch &&
      categoryMatch &&
      workModeMatch &&
      employmentMatch &&
      levelMatch &&
      job.status === "Open"
    );
  });

  return filtered.sort((a, b) => Number(b.featured) - Number(a.featured) || b.views - a.views);
}

export function createJob(input: Partial<Job> & Pick<Job, "title" | "description" | "companyId">) {
  const job: Job = {
    id: `job-${Date.now()}`,
    companyId: input.companyId,
    title: input.title,
    description: input.description,
    responsibilities: input.responsibilities ?? ["Own the role outcomes", "Collaborate with cross-functional teams"],
    skills: input.skills ?? [],
    education: input.education ?? "Relevant experience or education",
    benefits: input.benefits ?? ["Flexible work", "Health coverage"],
    salary: input.salary ?? "Competitive",
    salaryMin: input.salaryMin ?? 0,
    experience: input.experience ?? "1+ years",
    level: input.level ?? "Mid Level",
    employmentType: input.employmentType ?? "Full Time",
    workMode: input.workMode ?? "Hybrid",
    location: input.location ?? "Remote",
    category: input.category ?? "Engineering",
    deadline: input.deadline ?? "2026-08-31",
    vacancies: input.vacancies ?? 1,
    tags: input.tags ?? [],
    status: input.status ?? "Open",
    featured: input.featured ?? false,
    views: input.views ?? 0,
    createdAt: new Date().toISOString().slice(0, 10)
  };

  jobs = [job, ...jobs];
  return job;
}

export function createUser(input: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  location?: string;
}) {
  const user: User = {
    id: `usr-${Date.now()}`,
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role ?? "JOB_SEEKER",
    phone: input.phone,
    location: input.location,
    profilePicture: input.name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    createdAt: new Date().toISOString().slice(0, 10)
  };
  users = [user, ...users];
  return user;
}

export function updateUserProfile(userId: string, input: Partial<User>) {
  let updated: User | undefined;
  users = users.map((user) => {
    if (user.id !== userId) {
      return user;
    }
    updated = { ...user, ...input };
    return updated;
  });
  return updated;
}

export function createCompany(input: Partial<Company> & Pick<Company, "ownerId" | "companyName">) {
  const company: Company = {
    id: `cmp-${Date.now()}`,
    ownerId: input.ownerId,
    companyName: input.companyName,
    website: input.website ?? "",
    description: input.description ?? "Company profile pending.",
    logo:
      input.logo ??
      input.companyName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    industry: input.industry ?? "Technology",
    employees: input.employees ?? "1-50",
    location: input.location ?? "",
    isVerified: input.isVerified ?? false
  };
  companies = [company, ...companies];
  return company;
}

export function updateJob(jobId: string, input: Partial<Job>) {
  let updated: Job | undefined;
  jobs = jobs.map((job) => {
    if (job.id !== jobId) {
      return job;
    }
    updated = { ...job, ...input };
    return updated;
  });
  return updated;
}

export function deleteJob(jobId: string) {
  const exists = jobs.some((job) => job.id === jobId);
  jobs = jobs.filter((job) => job.id !== jobId);
  applications = applications.filter((application) => application.jobId !== jobId);
  savedJobs = savedJobs.filter((savedJob) => savedJob.jobId !== jobId);
  return exists;
}

export function createApplication(input: {
  jobId: string;
  userId: string;
  resume: string;
  coverLetter?: string;
}) {
  const application: Application = {
    id: `app-${Date.now()}`,
    jobId: input.jobId,
    userId: input.userId,
    resume: input.resume,
    coverLetter: input.coverLetter ?? "",
    status: "Pending",
    appliedAt: new Date().toISOString().slice(0, 10)
  };
  applications = [application, ...applications];
  notifications = [
    {
      id: `note-${Date.now()}`,
      userId: input.userId,
      message: `Application submitted for ${getJob(input.jobId)?.title ?? "job"}.`,
      isRead: false,
      createdAt: application.appliedAt
    },
    ...notifications
  ];
  return application;
}

export function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  let updated: Application | undefined;
  applications = applications.map((application) => {
    if (application.id !== applicationId) {
      return application;
    }
    updated = { ...application, status };
    return updated;
  });
  return updated;
}

export function updateCompany(companyId: string, input: Partial<Company>) {
  let updated: Company | undefined;
  companies = companies.map((company) => {
    if (company.id !== companyId) {
      return company;
    }
    updated = { ...company, ...input };
    return updated;
  });
  return updated;
}

export function getDashboardStats() {
  const accepted = applications.filter((application) => application.status === "Accepted").length;
  return {
    totalUsers: users.length,
    totalCompanies: companies.length,
    totalJobs: jobs.length,
    openJobs: jobs.filter((job) => job.status === "Open").length,
    applications: applications.length,
    dailyActiveUsers: 128,
    views: jobs.reduce((total, job) => total + job.views, 0),
    acceptanceRate: applications.length ? Math.round((accepted / applications.length) * 100) : 0,
    hiringRate: 28
  };
}

export const workModes: WorkMode[] = ["Remote", "Hybrid", "On-site"];
export const employmentTypes: EmploymentType[] = ["Full Time", "Part Time", "Contract", "Internship"];
