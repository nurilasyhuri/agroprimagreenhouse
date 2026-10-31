import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  try {
    // @ts-ignore
    process.loadEnvFile?.('.env.local');
  } catch {
    // Ignore error if file doesn't exist
  }
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
