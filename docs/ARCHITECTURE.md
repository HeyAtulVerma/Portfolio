# Technical Architecture & Implementation Guide

This document provides a comprehensive technical reference for the **Portfolio & Content Management System** at [atul.ople.in](https://atul.ople.in), explaining what works, how each component is implemented, architectural patterns, and targets for deployment and future expansion.

---

## 1. System Overview & Target

### Purpose & Objective
A production-grade, full-stack personal portfolio and admin management console designed for speed, visual craftsmanship, and seamless content updates without code deployments.

### Target Deployment Environments
- **Primary Target**: Self-hosted Docker container on Oracle Cloud (Always Free Tier) orchestrated via Dokploy.
- **Alternative Targets**: Node/Bun standalone server via `srvx`, VPS, or containerized serverless hosting.
- **Zero-Cost Architecture**: Uses free-tier cloud resources (Neon Serverless PostgreSQL, Cloudinary free media tier, Oracle Cloud Ampere compute).

### Core Tech Stack
| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | TanStack Start (`@tanstack/react-start`) | `1.168.x` | Full-stack React SSR framework |
| **Routing** | TanStack Router (`@tanstack/react-router`) | `1.170.x` | 100% type-safe file-based routing |
| **Bundler** | Rsbuild (`@rsbuild/core`) | `2.1.x` | High-performance Rust-powered Rspack build tool |
| **Runtime** | Bun / Node.js | `1.4.x` / `v20+` | Fast JavaScript runtime and package manager |
| **UI Library** | React 19 (`react`, `react-dom`) | `19.2.x` | Modern component rendering |
| **Styling** | Tailwind CSS v4 (`tailwindcss`) | `4.3.x` | Utility-first responsive design & custom glass themes |
| **Animations** | Motion (`motion`) | `12.x` | Spring physics micro-interactions & animated reveals |
| **Icons** | Lucide React (`lucide-react`) | `0.513.x` | Scalable vector iconography |
| **Database** | PostgreSQL / Neon Serverless | `0.10.x` | Relational domain and auth storage |
| **ORM** | Drizzle ORM (`drizzle-orm`) | `0.45.x` | Type-safe SQL query builder and migrations |
| **Auth** | Better-Auth (`better-auth`) | `1.6.x` | Authentication, sessions, and security |
| **Media Storage**| Cloudinary (`cloudinary`) | `2.10.x` | Unsigned widget uploads & signed asset cleanup |

---

## 2. High-Level Architecture & Data Flow

```
                                  [ Client Browser ]
                                     │         │
                 Initial SSR Request │         │ Client Navigation & Prefetch
                                     ▼         ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                         TanStack Start Application                             │
│                                                                                │
│  [ Public Layout: _public.tsx ]               [ Admin Layout: admin.tsx ]     │
│  ├── Home (/)                                 ├── Dashboard (/admin)          │
│  ├── Projects (/projects, /projects/$slug)    ├── Projects (/admin/projects)  │
│  ├── Certifications (/certifications)         ├── Certs (/admin/certifications)│
│  ├── About (/about)                           ├── Skills (/admin/skills)      │
│  ├── Resume (/resume, /resume/pdf)            ├── Experience (/admin/exp)     │
│  └── Contact (/contact)                       └── Profile (/admin/profile)    │
│                                                                                │
│  [ Client Data Cache (lib/public-data-cache.ts) ]                             │
│  └── Background warm cache after initial render for zero-latency page transitions
└───────────────────────┬──────────────────────────────────┬─────────────────────┘
                        │                                  │
          Server Functions (createServerFn)         Cloudinary Upload Widget
                        │                                  │
                        ▼                                  ▼
        ┌──────────────────────────────┐          ┌───────────────────┐
        │   Drizzle ORM (db/index.ts)  │          │    Cloudinary     │
        └──────────────┬───────────────┘          │  Asset Storage    │
                       │                          └───────────────────┘
                       ▼
        ┌──────────────────────────────┐
        │   PostgreSQL / Neon DB       │
        └──────────────────────────────┘
```

---

## 3. What Works & How It Works

### 3.1. Dual-Mode Public Data Prefetching (`public-data-cache.ts`)
- **Problem Solved**: Eliminates page flicker and loader spinners when navigating between public pages (Home, Projects, Certifications, About, Resume).
- **How It Works**:
  1. On first load of `_public.tsx`, an initial SSR fetch loads `profile`.
  2. Immediately after mount, `prefetchPublicSiteData()` triggers a single parallel query (`getPublicSiteData()`) fetching all published projects, certifications, skills, and resume content.
  3. Subsequent page loads check `getCachedPublicSiteData()` or `getWarmPublicDataCache()`. If available, data renders synchronously from memory.
  4. Any admin modification calls `clearPublicDataCache()`, guaranteeing fresh data when returning to the public site.

### 3.2. Certifications & Verification System
- **Public Surface (`/certifications`)**:
  - Filterable by issuing organization (e.g. AWS, Meta, Google, freeCodeCamp).
  - Real-time search across titles, issuers, credential IDs, and skill tags.
  - Credential ID display with single-click clipboard copy (`navigator.clipboard.writeText`) and confirmation toast.
  - Direct "Verify Credential" external link opening the official verification platform (Credly, Accredible, Coursera, etc.).
  - "View Certificate" document preview modal supporting both image formats and interactive embedded PDF documents.
- **Admin Management (`/admin/certifications`)**:
  - Comprehensive list with inline status toggles (`Published` / `Draft`).
  - Creation form (`/admin/certifications/new`) and editing form (`/admin/certifications/$id`).
  - Integrated Cloudinary upload widget targeting the `portfolio/certifications` folder.
  - Deletion of a certification triggers Cloudinary API cleanup to prevent orphaned media storage.

### 3.3. Revamped Admin Panel (`/admin`)
- **Protected Layout (`src/routes/admin.tsx`)**:
  - `beforeLoad` hook calls `getSession()`. If unauthenticated, it throws a redirect to `/login`.
  - Responsive collapsible sidebar with active state glow, badge counters, and direct link to the live portfolio.
  - Header with breadcrumbs, dark/light mode toggle, and responsive mobile navigation drawer.
- **Dashboard Command Center (`src/routes/admin/index.tsx`)**:
  - Key performance indicator (KPI) metric cards for Projects, Certifications, Skills, and Experience.
  - 4 quick-action launch buttons ("Add Certification", "Add Project", "Update Resume", "Edit Profile").
  - Status overview tables for quick access and status auditing.

### 3.4. Developer-Centric Skills Matrix
- Replaced outdated arbitrary 1–5 progress bars with a categorized engineering skill matrix (`src/components/portfolio/skills-grid.tsx`).
- Categorized into: **Languages**, **Frontend**, **Backend**, **Databases & ORMs**, **Frameworks**, **Tools & DevOps**, and **Systems**.
- Proficiency levels represented by distinct badge levels: **Expert / Core**, **Advanced**, **Proficient**, and **Working Knowledge**.

### 3.5. Authentication & Initial Setup (`Better-Auth`)
- Powered by `better-auth` with the Drizzle ORM adapter.
- First-time setup route (`/setup`) checks `checkUsersExist()`. If no admin exists, it presents an account creation form. Once an account exists, `/setup` automatically locks and redirects to `/login`.
- Session tokens are stored in HTTP cookies and verified securely on each server function call via `requireAdmin()`.

### 3.6. Media Storage Pipeline (`Cloudinary`)
- **Client Upload**: Uses Cloudinary's official hosted upload widget loaded asynchronously in `useCloudinaryUpload.ts`.
- **Upload Presets**: Uses an unsigned upload preset (`portfolio`) allowing direct client-to-Cloudinary image and PDF delivery.
- **Server Deletion**: `deleteCloudinaryAsset` in `src/server/functions/cloudinary.ts` signs a SHA-1 authorization hash using `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` to securely destroy replaced or deleted files.

---

## 4. Database Schema Reference

All domain models are defined in `src/db/schema.ts` using Drizzle ORM:

### `certifications` (New Feature)
```sql
CREATE TABLE "certifications" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "issuer" text NOT NULL DEFAULT '',
  "issue_date" text NOT NULL DEFAULT '',
  "expiration_date" text,
  "credential_id" text,
  "credential_url" text NOT NULL DEFAULT '',
  "certificate_url" text,
  "certificate_public_id" text,
  "skills" text[] NOT NULL DEFAULT '{}',
  "description" text NOT NULL DEFAULT '',
  "sort_order" integer NOT NULL DEFAULT 0,
  "is_published" boolean NOT NULL DEFAULT true,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
```

### Other Tables:
- `user`, `session`, `account`, `verification`: Managed by Better-Auth for authentication.
- `profile`: Full name, role title, short bio (hero), long bio (about), social links, resume URL.
- `projects`: Title, slug, descriptions, tech stack array, tags array, thumbnail URL, demo URLs, source links, sort order, and publication status.
- `project_images`: Secondary gallery images and screenshots for project detail pages.
- `skills`: Skill name, category, proficiency level, and sort order.
- `experiences`: Role, company, description, start date, end date, is current role, and sort order.
- `resume_content`: Section titles and formatted markdown/text content for the online resume page.

---

## 5. Environment Variables & Configuration

Create or configure a `.env` file in the project root:

```env
# Database Connection (PostgreSQL or Neon Serverless)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-secure-random-secret-key-at-least-32-chars"
BETTER_AUTH_URL="https://atul.ople.in" # or http://localhost:3000 in local dev

# Cloudinary Media Configuration
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_UPLOAD_PRESET="portfolio"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

---

## 6. How to Run, Test & Build

### Development
```bash
# Install dependencies
bun install

# Start development server with hot-module replacement
bun run dev
```

### Database Migration
```bash
# Run standalone migration script
bun run src/db/migrate.ts

# Or push schema directly with Drizzle Kit
bunx drizzle-kit push
```

### Production Build
```bash
# Generate optimized client and SSR server bundles
bun run build

# Start production server
bun run start
```

---

## 7. Future Expansion Recommendations

1. **Blog / Writing Engine**:
   - Add a `posts` table with markdown/MDX support to showcase technical articles and deep dives.
2. **Contact Form Email Integration**:
   - Currently, the contact form opens `mailto:`. Integrate Resend or Nodemailer in a server function for in-page message delivery and database archiving.
3. **Analytics Dashboard**:
   - Integrate Umami or custom lightweight pageview tracking for project clicks and resume downloads.
