# Atul Verma — Professional Portfolio & CMS

A high-performance personal engineering portfolio and content management system built with **TanStack Start**, **React 19**, **Rsbuild**, **Tailwind CSS v4**, **Drizzle ORM**, **Neon PostgreSQL**, and **Better-Auth**.

Live Site: [atul.ople.in](https://atul.ople.in)

---

## ✨ Features & Highlights

- **Modern Obsidian & Glassmorphism Design**: High-contrast, dark-mode-first aesthetic with refined dot patterns, glow borders, and fluid animations powered by Motion.
- **Certifications & Verification System**:
  - Public hub at `/certifications` with instant search, issuer filters (AWS, Google, Meta, freeCodeCamp, etc.), direct verification links, single-click credential ID copying, and in-browser certificate previews (image & PDF).
  - Admin management at `/admin/certifications` with Cloudinary upload integration, inline publish/draft toggles, and metadata controls.
- **Categorized Skills Matrix**: Industry-standard matrix replacing progress bars with skill depth categories (Languages, Frontend, Backend, Databases, Cloud & DevOps, Tools).
- **Interactive Project Showcase**: Live demo and source links, responsive filter tags, rich markdown case studies, and image carousels.
- **Revamped Admin Panel**: Command center with KPI metrics, fast quick-actions, sidebar glow indicators, and protected routes.
- **Fast SSR & Client Prefetching**: TanStack Start server-side rendering combined with warm client-side caching for instant zero-flicker transitions.

---

## 🏗️ Architecture & Documentation

For a comprehensive breakdown of the technical design, data flows, database schemas, and future roadmap, refer to:
👉 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) v20+
- PostgreSQL database (or [Neon Serverless PostgreSQL](https://neon.tech/))
- [Cloudinary](https://cloudinary.com/) account for certificate and project media

### 1. Installation

```bash
git clone https://github.com/HeyAtulVerma/Portfolio.git
cd Portfolio
bun install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
BETTER_AUTH_SECRET="your-secure-random-secret-key-at-least-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_UPLOAD_PRESET="portfolio"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Database Migration

Run the migration script to ensure all tables (including the `certifications` table) are created:

```bash
bun run src/db/migrate.ts
```

### 4. Running Locally

```bash
bun run dev
```

Visit `http://localhost:3000`. On first run, go to `http://localhost:3000/setup` to initialize your admin user.

---

## 📦 Production Build

```bash
# Build optimized client and server bundles with Rsbuild
bun run build

# Start the production SSR server
bun run start
```

---

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) |
| UI & Styling | React 19 + [Tailwind CSS v4](https://tailwindcss.com/) + [Motion](https://motion.dev/) |
| Bundler | [Rsbuild](https://rsbuild.dev/) (Rspack Rust engine) |
| Database & ORM | [Neon PostgreSQL](https://neon.tech/) + [Drizzle ORM](https://orm.drizzle.team/) |
| Authentication | [Better-Auth](https://better-auth.com/) |
| Media Storage | [Cloudinary](https://cloudinary.com/) |
