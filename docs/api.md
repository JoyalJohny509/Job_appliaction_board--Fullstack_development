# API Reference

This starter implements the requested endpoint surface with Next.js route handlers. The same contracts can be moved into `backend/routes` and `backend/controllers` for a standalone Express service.

## Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create a job seeker or employer account |
| `POST` | `/api/auth/login` | Validate demo credentials and return a demo token |
| `POST` | `/api/auth/logout` | Return a successful logout response |
| `GET` | `/api/auth/me` | Return the current demo user |

## Jobs

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/jobs` | List jobs with filters |
| `GET` | `/api/jobs/:id` | Get one job with company details |
| `POST` | `/api/jobs` | Create a job posting |
| `PUT` | `/api/jobs/:id` | Update a job posting |
| `DELETE` | `/api/jobs/:id` | Delete a job posting |

Supported job filters:

- `keyword`
- `company`
- `location`
- `salary`
- `experience`
- `category`
- `workMode`
- `employmentType`
- `level`

## Applications

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/applications` | List applications, optionally by `jobId` or `userId` |
| `POST` | `/api/applications` | Submit a resume and cover letter |
| `PUT` | `/api/applications/:id/status` | Move an application through review states |

Application statuses:

- `Pending`
- `Reviewed`
- `Interview`
- `Accepted`
- `Rejected`

Resume upload accepts:

- PDF
- DOC
- DOCX
- Maximum size: 5 MB

## Companies

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/companies` | List company profiles |
| `POST` | `/api/companies` | Create a company profile |
| `GET` | `/api/companies/:id` | Get a company profile |
| `PUT` | `/api/companies/:id` | Update or verify a company profile |

## Users

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/users` | Admin user list |
| `GET` | `/api/users/profile` | Get the current user profile |
| `PUT` | `/api/users/profile` | Update the current user profile |
