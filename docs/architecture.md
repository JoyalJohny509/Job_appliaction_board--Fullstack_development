# Architecture Notes

## Current Starter

The runnable starter is a single Next.js app:

- UI routes live in `app/`.
- API routes live in `app/api/`.
- Shared domain types and seeded records live in `lib/`.
- Prisma schema lives in `prisma/schema.prisma`.

This keeps the project easy to run from an empty repository while preserving the same domain model and endpoint surface that a separated backend would use.

## Production Split

For a separated deployment:

- Move route handler logic from `app/api` into `backend/controllers`.
- Define Express routers in `backend/routes`.
- Add middleware for JWT verification, role checks, validation, and upload parsing.
- Replace in-memory mutations with Prisma services in `backend/services`.
- Deploy `app/` to Vercel and `backend/` to Render, Railway, or another Node host.

## Role Access

Recommended route guards:

| Area | Allowed Roles |
| --- | --- |
| Job search and job details | Public |
| Save job and apply | Job seeker |
| Employer dashboard | Employer |
| Job create/update/delete | Employer, Admin |
| Application status updates | Employer |
| User/company/job moderation | Admin |

## File Storage

The demo validates file type and size, then stores only the uploaded filename. Production should stream resumes to Cloudinary or AWS S3 and store the returned secure URL in the `Application.resume` field.
