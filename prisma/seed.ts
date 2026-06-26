import { PrismaClient, Role, WorkMode, EmploymentType, JobStatus, ApplicationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  await prisma.notification.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log("Seeding categories...");
  const categoriesData = [
    { id: "cat-design", name: "Design" },
    { id: "cat-engineering", name: "Engineering" },
    { id: "cat-marketing", name: "Marketing" },
    { id: "cat-product", name: "Product" },
    { id: "cat-sales", name: "Sales" },
    { id: "cat-data", name: "Data" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({
      data: cat,
    });
  }

  console.log("Seeding users...");
  const hashedPassword = await bcrypt.hash("password", 12);

  const usersData = [
    {
      id: "usr-ava",
      name: "Ava Patel",
      email: "ava@example.com",
      password: hashedPassword,
      role: Role.JOB_SEEKER,
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      profilePicture: "AP",
      resume: "ava-patel-resume.pdf",
    },
    {
      id: "usr-nova-owner",
      name: "Maya Shah",
      email: "maya@novalabs.example",
      password: hashedPassword,
      role: Role.EMPLOYER,
      phone: "+91 99887 77665",
      location: "Mumbai, India",
      profilePicture: "MS",
    },
    {
      id: "usr-admin",
      name: "Jordan Lee",
      email: "admin@hirepath.example",
      password: hashedPassword,
      role: Role.ADMIN,
      phone: "+1 415 555 0129",
      location: "Remote",
      profilePicture: "JL",
    },
    {
      id: "usr-omar",
      name: "Omar Khan",
      email: "omar@example.com",
      password: hashedPassword,
      role: Role.JOB_SEEKER,
      phone: "+91 91234 56789",
      location: "Delhi, India",
      profilePicture: "OK",
      resume: "omar-khan-resume.docx",
    },
  ];

  for (const user of usersData) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log("Seeding company (Nova Labs)...");
  const company = await prisma.company.create({
    data: {
      id: "cmp-nova",
      ownerId: "usr-nova-owner",
      companyName: "Nova Labs",
      website: "https://novalabs.example",
      description: "Nova Labs builds collaboration software for distributed product teams.",
      logo: "NL",
      industry: "SaaS",
      employees: "201-500",
      location: "Mumbai, India",
      isVerified: true,
    },
  });

  console.log("Seeding jobs (all associated with Nova Labs)...");
  const jobsData = [
    {
      id: "job-product-designer",
      companyId: "cmp-nova",
      title: "Senior Product Designer",
      description: "Lead design for Nova Labs' hiring collaboration suite from research to polished product delivery.",
      responsibilities: [
        "Run discovery with recruiters and hiring managers",
        "Design flows for job posting, candidate review, and analytics",
        "Partner with engineering on accessible UI implementation",
        "Maintain product design standards across dashboards",
      ],
      skills: ["Figma", "Design Systems", "UX Research", "Accessibility"],
      education: "Bachelor's degree or equivalent product design experience",
      benefits: ["Remote stipend", "Health insurance", "Learning budget", "Flexible hours"],
      salary: "$90k - $125k",
      salaryMin: 90000,
      experience: "5+ years",
      level: "Senior",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      location: "Mumbai, India",
      categoryId: "cat-design",
      deadline: new Date("2026-08-14"),
      vacancies: 2,
      tags: ["Design", "SaaS", "B2B"],
      status: JobStatus.OPEN,
      featured: true,
      views: 1840,
    },
    {
      id: "job-full-stack",
      companyId: "cmp-nova", // Note: associated with Nova Labs as ownerId @unique limits to 1 company
      title: "Full Stack Engineer",
      description: "Build reliable product surfaces and APIs for a high-growth cloud platform.",
      responsibilities: [
        "Develop Next.js interfaces and Express services",
        "Own PostgreSQL-backed workflows with Prisma",
        "Improve observability and deployment quality",
        "Review code and mentor junior engineers",
      ],
      skills: ["Next.js", "Node.js", "PostgreSQL", "Prisma", "TypeScript"],
      education: "Computer science degree preferred, practical experience valued",
      benefits: ["Equity", "Home office setup", "Paid certifications", "Wellness support"],
      salary: "$110k - $145k",
      salaryMin: 110000,
      experience: "4+ years",
      level: "Mid Level",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.REMOTE,
      location: "Remote",
      categoryId: "cat-engineering",
      deadline: new Date("2026-07-28"),
      vacancies: 3,
      tags: ["Remote", "Platform", "TypeScript"],
      status: JobStatus.OPEN,
      featured: true,
      views: 2410,
    },
    {
      id: "job-marketing-analyst",
      companyId: "cmp-nova", // Note: associated with Nova Labs
      title: "Marketing Data Analyst",
      description: "Turn campaign, product, and sales signals into decisions for retail customers.",
      responsibilities: [
        "Create dashboards for acquisition and lifecycle metrics",
        "Build campaign reports and experiment readouts",
        "Collaborate with marketing and sales leadership",
        "Maintain clean, trusted reporting datasets",
      ],
      skills: ["SQL", "Excel", "Looker", "Campaign Analytics"],
      education: "Bachelor's degree in business, statistics, marketing, or related field",
      benefits: ["Annual bonus", "Team retreats", "Mentorship program"],
      salary: "$60k - $82k",
      salaryMin: 60000,
      experience: "2+ years",
      level: "Entry Level",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.ONSITE,
      location: "Pune, India",
      categoryId: "cat-marketing",
      deadline: new Date("2026-07-10"),
      vacancies: 1,
      tags: ["Analytics", "Retail", "SQL"],
      status: JobStatus.OPEN,
      featured: false,
      views: 965,
    },
    {
      id: "job-product-manager",
      companyId: "cmp-nova", // Note: associated with Nova Labs
      title: "Product Manager, Patient Experience",
      description: "Shape digital appointment, intake, and follow-up experiences for care teams and patients.",
      responsibilities: [
        "Prioritize roadmap items with clinical and business stakeholders",
        "Write crisp product requirements and success metrics",
        "Coordinate releases across design, engineering, and support",
        "Use feedback loops to improve adoption",
      ],
      skills: ["Product Strategy", "Roadmapping", "Healthcare Workflows", "Analytics"],
      education: "MBA or equivalent product leadership experience preferred",
      benefits: ["Medical coverage", "Paid parental leave", "Leadership coaching"],
      salary: "$100k - $132k",
      salaryMin: 100000,
      experience: "5+ years",
      level: "Senior",
      employmentType: EmploymentType.FULL_TIME,
      workMode: WorkMode.HYBRID,
      location: "Delhi, India",
      categoryId: "cat-product",
      deadline: new Date("2026-08-05"),
      vacancies: 1,
      tags: ["HealthTech", "Product", "Hybrid"],
      status: JobStatus.OPEN,
      featured: true,
      views: 1518,
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
        "Log insights for marketing and account executives",
      ],
      skills: ["Prospecting", "CRM", "Communication", "B2B Sales"],
      education: "Any bachelor's degree or equivalent sales training",
      benefits: ["Performance incentive", "Remote-first team", "Sales coaching"],
      salary: "$38k - $52k",
      salaryMin: 38000,
      experience: "1+ years",
      level: "Entry Level",
      employmentType: EmploymentType.CONTRACT,
      workMode: WorkMode.REMOTE,
      location: "Remote",
      categoryId: "cat-sales",
      deadline: new Date("2026-07-20"),
      vacancies: 4,
      tags: ["Contract", "Remote", "Sales"],
      status: JobStatus.OPEN,
      featured: false,
      views: 742,
    },
    {
      id: "job-data-intern",
      companyId: "cmp-nova", // Note: associated with Nova Labs
      title: "Data Engineering Intern",
      description: "Support pipeline quality and internal reporting for infrastructure usage analytics.",
      responsibilities: [
        "Write transformation jobs with review from senior engineers",
        "Document data sources and ownership",
        "Investigate data quality alerts",
        "Ship small improvements to analytics tooling",
      ],
      skills: ["Python", "SQL", "Data Pipelines", "Documentation"],
      education: "Current student or recent graduate in computer science, data, or engineering",
      benefits: ["Paid internship", "Mentor pairing", "Conversion opportunity"],
      salary: "$24/hr - $32/hr",
      salaryMin: 48000,
      experience: "0-1 years",
      level: "Entry Level",
      employmentType: EmploymentType.INTERNSHIP,
      workMode: WorkMode.REMOTE,
      location: "Remote",
      categoryId: "cat-data",
      deadline: new Date("2026-07-04"),
      vacancies: 2,
      tags: ["Internship", "Data", "Python"],
      status: JobStatus.OPEN,
      featured: false,
      views: 1102,
    },
  ];

  for (const job of jobsData) {
    await prisma.job.create({
      data: job,
    });
  }

  console.log("Seeding applications...");
  const applicationsData = [
    {
      id: "app-001",
      jobId: "job-full-stack",
      userId: "usr-ava",
      resume: "ava-patel-resume.pdf",
      coverLetter: "I have built production Next.js and Prisma workflows and enjoy platform work.",
      status: ApplicationStatus.INTERVIEW,
      appliedAt: new Date("2026-06-19"),
    },
    {
      id: "app-002",
      jobId: "job-product-manager",
      userId: "usr-ava",
      resume: "ava-patel-resume.pdf",
      coverLetter: "My design background helps me collaborate closely with product and engineering.",
      status: ApplicationStatus.REVIEWED,
      appliedAt: new Date("2026-06-16"),
    },
    {
      id: "app-003",
      jobId: "job-product-designer",
      userId: "usr-omar",
      resume: "omar-khan-resume.docx",
      coverLetter: "I have shipped hiring and onboarding product experiences in SaaS.",
      status: ApplicationStatus.PENDING,
      appliedAt: new Date("2026-06-21"),
    },
  ];

  for (const app of applicationsData) {
    await prisma.application.create({
      data: app,
    });
  }

  console.log("Seeding saved jobs...");
  const savedJobsData = [
    { id: "save-001", userId: "usr-ava", jobId: "job-product-designer" },
    { id: "save-002", userId: "usr-ava", jobId: "job-data-intern" },
  ];

  for (const save of savedJobsData) {
    await prisma.savedJob.create({
      data: save,
    });
  }

  console.log("Seeding notifications...");
  const notificationsData = [
    {
      id: "note-001",
      userId: "usr-ava",
      message: "Application submitted for Full Stack Engineer.",
      isRead: false,
      createdAt: new Date("2026-06-19"),
    },
    {
      id: "note-002",
      userId: "usr-ava",
      message: "Interview scheduled with Verdant Cloud.",
      isRead: false,
      createdAt: new Date("2026-06-22"),
    },
    {
      id: "note-003",
      userId: "usr-ava",
      message: "New matching job: Senior Product Designer.",
      isRead: true,
      createdAt: new Date("2026-06-23"),
    },
  ];

  for (const note of notificationsData) {
    await prisma.notification.create({
      data: note,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
