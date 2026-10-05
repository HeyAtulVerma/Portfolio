import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_nqNGIgF0ysd9@ep-rough-forest-ap6zljax-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require';
export const db = drizzle(databaseUrl);
