# Shikkhapath News Portal

Shikkhapath is a Next.js 16 news portal with:

- A public customer-facing site for Bangla news content.
- An admin area for authenticated management workflows.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env.local
```

3. Set required variables in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NODE_ENV=development
```

4. Run the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Run dev server.
- `npm run build`: Build production bundle.
- `npm run start`: Start production server.
- `npm run lint`: Run ESLint.

## Project Structure

- `app/(customer)`: Public website pages.
- `app/admin/(auth)`: Admin authentication pages.
- `app/admin/(dashboard)`: Admin dashboard pages and routes.
- `components/customer`: Customer-facing UI components.
- `components/admin`: Admin UI, forms, and layout components.
- `lib/api`: Server-side API helper utilities.
- `middleware.ts`: Auth guard logic for admin routes.

## Authentication Notes

- Admin login stores an `admin_token` HTTP-only cookie.
- Middleware protects `/admin` routes and redirects unauthorized users to `/admin/login`.

## Deployment Notes

- Ensure `NEXT_PUBLIC_API_BASE_URL` points to your live backend API.
- Use HTTPS in production so secure cookie behavior works as expected.