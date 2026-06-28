# X-Weevo – Premium Clothing Store

**X-Weevo** is a modern, fast, and stylish online clothing store built with cutting-edge web technologies. It is designed to provide a premium shopping experience, combining beautiful aesthetics with uncompromised performance and reliability.

Explore our limited collections, find your perfect look, and enjoy a seamless journey from the catalog to checkout.

---

<p align="center">
  <img src="https://vzzjcgycihmvgklaahyv.supabase.co/storage/v1/object/public/Public/Promo/main-page-view.avif" alt="X-Weevo" />
</p>

---

## Why X-Weevo Stands Out?

**Premium Aesthetics & Dynamic Design**
A highly visual, responsive interface that feels alive. We prioritize rich aesthetics, curated color palettes, and subtle micro-animations that elevate the shopping experience.

**Seamless Internationalization (i18n)**
Built with a global audience in mind. X-Weevo supports multiple languages seamlessly (English & Ukrainian out of the box), adapting the UI and content instantly to the user's preference without reloading the page.

**Robust Authentication & Profiles**
Secure and fast user registration via Google OAuth and Magic Links powered by Supabase. Users get access to a personalized dashboard, order history tracking, and favorite items list. Profile data is synced seamlessly across sessions.

**Lightning-Fast Data Fetching**
Powered by Next.js Server Components and Server Actions, ensuring instant page loads, excellent SEO out of the box, and a zero-JS feel where possible.

**Deep E-commerce Features**
A fully functional shopping cart, robust search capabilities, and detailed product filtering.

---

## Tech Stack

### Client & Core Framework

| Category       | Technology                                                                           |
| :------------- | :----------------------------------------------------------------------------------- |
| **Framework**  | [Next.js 16.2](https://nextjs.org/) (App Router, Server Actions, Server Components)  |
| **UI Library** | [React 19](https://react.dev/) with React Compiler                                   |
| **State**      | [Zustand 5](https://zustand-demo.pmnd.rs/) – lightweight global state management     |
| **i18n**       | [next-intl](https://next-intl-docs.vercel.app/) – internationalization               |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) – dynamic, buttery-smooth animations |
| **Forms**      | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation |
| **Styling**    | Vanilla CSS / CSS Modules with `clsx`                                                |
| **Language**   | TypeScript 5                                                                         |

### Server, Database & API

| Category       | Technology                                                                |
| :------------- | :------------------------------------------------------------------------ |
| **Database**   | [PostgreSQL (Supabase)](https://supabase.com/)                            |
| **ORM**        | [Prisma 7](https://www.prisma.io/) with `@prisma/adapter-pg`              |
| **Auth**       | [@supabase/ssr](https://supabase.com/docs/guides/auth/server-side/nextjs) |
| **Validation** | [Zod 4](https://zod.dev/) – end-to-end type-safe validation               |

### DevOps & Code Quality

| Category        | Technology                                                                      |
| :-------------- | :------------------------------------------------------------------------------ |
| **Git Hooks**   | [Husky](https://typicode.github.io/husky/) – pre-commit automation              |
| **Lint Staged** | [lint-staged](https://github.com/lint-staged/lint-staged) – incremental linting |
| **Linting**     | ESLint 9 + Prettier (with `@trivago/prettier-plugin-sort-imports`)              |
| **Unused Code** | [Knip](https://knip.dev/) – dead export & dependency detection                  |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Yarn** (package manager)
- **Supabase** account / PostgreSQL Database

### 1. Clone & Install

```bash
git clone https://github.com/Sp1r1tual/x-weevo
cd clothing-store

# Install dependencies
yarn install
```

### 2. Configure Environment

Copy the example `.env` file to set up your environment variables:

```bash
cp .env.example .env
```

Open `.env` and fill in your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `DATABASE_URL` (Connection pooler URL for runtime queries - usually port 6543)
- `DIRECT_URL` (Direct connection for Prisma migrations - usually port 5432)

### 3. Database Setup

Apply the database schema to your Supabase PostgreSQL instance and generate the Prisma Client:

```bash
# Push schema to database
yarn prisma:migrate

# Generate Prisma types
yarn prisma:generate
```

_Optional: Open Prisma Studio to view and edit your database via UI:_

```bash
yarn prisma:studio
```

### 4. Run in Development

Start the Next.js development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command                | Description                                 |
| :--------------------- | :------------------------------------------ |
| `yarn dev`             | Start the development server                |
| `yarn build`           | Create an optimized production build        |
| `yarn start`           | Start the production server                 |
| `yarn lint`            | Run ESLint to check for code issues         |
| `yarn format`          | Format code using Prettier                  |
| `yarn knip`            | Detect unused code, files, and dependencies |
| `yarn prisma:migrate`  | Run Prisma migrations to update DB schema   |
| `yarn prisma:generate` | Generate the Prisma client for type safety  |
| `yarn prisma:studio`   | Open Prisma Studio database UI              |

---

## License

This project is licensed under the License – see the [LICENCE](./LICENCE) file for details.
