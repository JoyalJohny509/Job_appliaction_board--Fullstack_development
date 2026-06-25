# Backend Folder

This folder is reserved for the separated Express.js service described in the project brief.

The runnable starter currently implements API behavior with Next.js route handlers under `app/api`. To split the service later:

- Put route definitions in `backend/routes`.
- Put request handlers in `backend/controllers`.
- Put Prisma calls and upload integrations in `backend/services`.
- Put auth, role, validation, and upload middleware in `backend/middlewares`.
- Keep shared database modeling in `prisma/schema.prisma`.
