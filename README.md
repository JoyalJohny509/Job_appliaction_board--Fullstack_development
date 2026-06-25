# HirePath Job Board Application

HirePath is a full-stack job board starter based on the project brief. It includes employer job posting, job seeker search and applications, saved jobs, resume validation, role dashboards, admin moderation screens, API routes, and a PostgreSQL-ready Prisma schema.

## Features

- Job seeker registration and login demo flow
- Employer registration with company profile creation
- Home page with search, featured jobs, top companies, categories, latest jobs, testimonials, and footer
- Job search by keyword, company, location, salary, category, work mode, employment type, and level
- Job details page with company profile, salary, location, skills, responsibilities, benefits, and apply flow
- Resume upload validation for PDF, DOC, and DOCX up to 5 MB
- Job seeker dashboard for profile, resume, saved jobs, applied jobs, notifications, and settings
- Employer dashboard for company profile, post job, manage jobs, applications, analytics, and settings
- Admin dashboard for users, employers, jobs, reports, analytics, categories, and settings
- Prisma schema for PostgreSQL production data modeling

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js App Router |
| UI | Tailwind CSS |
| API | Next.js route handlers for the runnable starter |
| Backend target | Express.js scaffold folder reserved for a separated API service |
| Database target | PostgreSQL |
| ORM | Prisma |
| Auth target | JWT or Auth.js |
| File storage target | Cloudinary or AWS S3 |

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Open the local URL printed by Next.js, usually `http://localhost:3000`.

## Demo Accounts

The in-memory demo store contains these accounts:

| Role | Email | Password |
| --- | --- | --- |
| Job Seeker | `ava@example.com` | `password` |
| Employer | `maya@novalabs.example` | `password` |
| Admin | `admin@hirepath.example` | `password` |

## Project Structure

```text
job-board/
  app/                     Next.js routes, pages, dashboards, and API handlers
  components/              Shared UI and client workflow components
  hooks/                   Reserved for reusable React hooks
  lib/                     Types, mock data, helpers, and domain mutations
  prisma/                  PostgreSQL Prisma schema
  backend/                 Reserved Express.js service structure
  frontend/                Reserved split-frontend structure
  database/                Reserved SQL, seed, and migration docs
  uploads/                 Local upload placeholder for development
  docs/                    API and architecture notes
```

## API Endpoints

Implemented route handlers:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `POST /api/jobs`
- `PUT /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `POST /api/applications`
- `GET /api/applications`
- `PUT /api/applications/:id/status`
- `GET /api/companies`
- `POST /api/companies`
- `PUT /api/companies/:id`
- `GET /api/users`
- `GET /api/users/profile`
- `PUT /api/users/profile`

## Production Notes

The current app uses `lib/data.ts` as a local in-memory store so the UI is easy to run and inspect. To make it production-ready:

1. Add `DATABASE_URL` for PostgreSQL.
2. Run `npm run prisma:generate`.
3. Replace `lib/data.ts` mutations with Prisma queries.
4. Add JWT or Auth.js sessions and route protection.
5. Replace resume filename storage with Cloudinary or AWS S3 uploads.
6. Split `backend/` into an Express API if deploying frontend and backend separately.
