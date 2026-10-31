import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

if (!process.env.DATABASE_URL) {
  try {
    // @ts-ignore
    process.loadEnvFile?.('.env.local');
  } catch {}
}

const connectionString = process.env.DATABASE_URL || '';
if (!connectionString) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(connectionString);

async function runMigrations() {
  console.log('Connecting to Neon via HTTP...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    );
  `;
  
  const migrationDir = join(process.cwd(), 'drizzle');
  const files = readdirSync(migrationDir).filter((f) => f.endsWith('.sql')).sort();
  
  for (const file of files) {
    console.log(`Processing ${file}...`);
    const content = readFileSync(join(migrationDir, file), 'utf-8');
    const statements = content.split('--> statement-breakpoint');
    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (trimmed) {
        // @ts-ignore
        await sql.query(trimmed);
      }
    }
  }
  
  console.log('✓ Migrations applied successfully to Neon PostgreSQL!');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
