# HirePath Job Board Application

## Overview
HirePath is a full-stack job board application designed to connect job seekers, employers, and administrators. It includes employer job posting workflows, advanced job search and filtering for candidates, application tracking, resume validation, role-specific dashboards, and administrative moderation screens. The project is backed by a PostgreSQL database managed via Prisma ORM and deployed with a Next.js App Router frontend.

---

## Features
* **Job Seeker Dashboard**: Manage candidate profiles, upload resumes (validated up to 5MB for PDF and Word documents), view saved jobs, track active job applications, and receive notifications.
* **Employer Dashboard**: Create and update verified company profiles, post new job listings, manage current job posts, review applicant profiles, and transition application statuses.
* **Admin Dashboard**: Oversee platform users, verify employer accounts, moderate active job listings, view system analytics, and manage job categories.
* **Job Search Engine**: Filter jobs by keyword, company name, location, salary range, category, work mode (Remote/Hybrid/Onsite), and employment type.
* **Authentication Flow**: Safe, cookie-based authentication using JSON Web Tokens (JWT).

---

## Tech Stack
* **Frontend**: Next.js App Router
* **Styling**: Tailwind CSS
* **Database ORM**: Prisma
* **Database**: PostgreSQL (Supabase)
* **Authentication**: JWT (implemented via `jose`)
* **File Storage**: Cloudinary (for raw resume files)

---

## Installation
To set up the project locally, install the dependencies first:

```bash
npm install
```

---

## Environment Variables
Create a `.env` file in the root directory and define the following variables:

```env
# Database Connections
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Authentication
JWT_SECRET="your-secret-key-at-least-32-characters"
JWT_EXPIRY="7d"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
```

---

## Running the Project

1. **Synchronize the Database Schema**:
   Push the Prisma schema to your Supabase PostgreSQL instance:
   ```bash
   npx prisma db push
   ```

2. **Generate Prisma Client**:
   Create the database client files:
   ```bash
   npx prisma generate
   ```

3. **Seed Database**:
   Populate the database with initial categories, mock jobs, users, and companies:
   ```bash
   npx prisma db seed
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) (or the port specified in terminal) in your browser.

---

## Folder Structure
```text
job-board-application/
├── app/                  # Next.js pages, dashboards, and API route handlers
├── components/           # Shared UI and workflow components
├── hooks/                # Reusable React hooks
├── lib/                  # Service layers, helpers, and type definitions
│   └── services/         # Database interaction services
├── prisma/               # Schema definitions and database seed scripts
├── public/               # Static assets
└── styles/               # Global styling configurations
```

---

## Screenshots
Screenshots demonstrating the landing page and candidate dashboards can be found within the repository or in the walkthrough documentation.

---

## Future Improvements
* **AWS S3 Storage Integration**: Transition resume storage option to AWS S3.
* **Email Notifications**: Set up transactional email dispatching for application status updates.
* **Separate Express Backend**: Scaffold the reserve `backend/` folder into a separated microservice API if deploying the backend independently from the Next.js runtime.
