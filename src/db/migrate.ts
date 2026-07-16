import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_nqNGIgF0ysd9@ep-rough-forest-ap6zljax-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require')

async function migrate() {
  console.log('Running migrations...')

  // Create Better Auth tables (camelCase columns to match Better Auth's default naming)
  await sql`
    CREATE TABLE IF NOT EXISTS "user" (
      "id" text PRIMARY KEY NOT NULL,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "emailVerified" boolean NOT NULL DEFAULT false,
      "image" text,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `
  console.log('  Created user table')

  await sql`
    CREATE TABLE IF NOT EXISTS "session" (
      "id" text PRIMARY KEY NOT NULL,
      "expiresAt" timestamp NOT NULL,
      "token" text NOT NULL UNIQUE,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now(),
      "ipAddress" text,
      "userAgent" text,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
    )
  `
  console.log('  Created session table')

  await sql`
    CREATE TABLE IF NOT EXISTS "account" (
      "id" text PRIMARY KEY NOT NULL,
      "accountId" text NOT NULL,
      "providerId" text NOT NULL,
      "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "accessToken" text,
      "refreshToken" text,
      "idToken" text,
      "accessTokenExpiresAt" timestamp,
      "refreshTokenExpiresAt" timestamp,
      "scope" text,
      "password" text,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `
  console.log('  Created account table')

  await sql`
    CREATE TABLE IF NOT EXISTS "verification" (
      "id" text PRIMARY KEY NOT NULL,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expiresAt" timestamp NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `
  console.log('  Created verification table')

  // Create domain tables
  await sql`
    CREATE TABLE IF NOT EXISTS "profile" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "user_id" text NOT NULL UNIQUE REFERENCES "user"("id") ON DELETE CASCADE,
      "full_name" text NOT NULL DEFAULT '',
      "role" text NOT NULL DEFAULT 'Full-Stack Developer',
      "short_bio" text NOT NULL DEFAULT '',
      "long_bio" text NOT NULL DEFAULT '',
      "email" text NOT NULL DEFAULT '',
      "location" text NOT NULL DEFAULT '',
      "resume_url" text,
      "resume_public_id" text,
      "avatar_url" text,
      "avatar_public_id" text,
      "github_url" text NOT NULL DEFAULT '',
      "linkedin_url" text NOT NULL DEFAULT '',
      "twitter_url" text NOT NULL DEFAULT '',
      "website_url" text NOT NULL DEFAULT '',
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `
  console.log('  Created profile table')

  await sql`
    CREATE TABLE IF NOT EXISTS "projects" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "title" text NOT NULL,
      "slug" text NOT NULL UNIQUE,
      "short_description" text NOT NULL DEFAULT '',
      "long_description" text NOT NULL DEFAULT '',
      "how_it_was_built" text NOT NULL DEFAULT '',
      "tech_stack" text[] NOT NULL DEFAULT '{}',
      "tags" text[] NOT NULL DEFAULT '{}',
      "thumbnail_url" text,
      "thumbnail_public_id" text,
      "live_url" text NOT NULL DEFAULT '',
      "demo_url" text NOT NULL DEFAULT '',
      "github_url" text NOT NULL DEFAULT '',
      "is_published" boolean NOT NULL DEFAULT true,
      "sort_order" integer NOT NULL DEFAULT 0,
      "created_at" timestamp NOT NULL DEFAULT now(),
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `
  console.log('  Created projects table')

  await sql`
    CREATE TABLE IF NOT EXISTS "project_images" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "project_id" uuid NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE,
      "url" text NOT NULL,
      "public_id" text NOT NULL,
      "alt_text" text NOT NULL DEFAULT '',
      "caption" text NOT NULL DEFAULT '',
      "sort_order" integer NOT NULL DEFAULT 0,
      "created_at" timestamp NOT NULL DEFAULT now()
    )
  `
  console.log('  Created project_images table')

  await sql`
    CREATE TABLE IF NOT EXISTS "skills" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "name" text NOT NULL,
      "category" text NOT NULL DEFAULT 'General',
      "proficiency" integer NOT NULL DEFAULT 3,
      "icon_url" text,
      "sort_order" integer NOT NULL DEFAULT 0
    )
  `
  console.log('  Created skills table')

  await sql`
    CREATE TABLE IF NOT EXISTS "experiences" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "role" text NOT NULL,
      "company" text NOT NULL DEFAULT '',
      "description" text NOT NULL DEFAULT '',
      "start_date" text NOT NULL,
      "end_date" text,
      "is_current_role" boolean NOT NULL DEFAULT false,
      "sort_order" integer NOT NULL DEFAULT 0
    )
  `
  console.log('  Created experiences table')

  await sql`
    CREATE TABLE IF NOT EXISTS "resume_content" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
      "section_title" text NOT NULL,
      "content" text NOT NULL DEFAULT '',
      "sort_order" integer NOT NULL DEFAULT 0,
      "updated_at" timestamp NOT NULL DEFAULT now()
    )
  `
  console.log('  Created resume_content table')

  console.log('All migrations completed successfully!')
}

migrate().catch(console.error)
