import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as schema from '../src/db/schema';
import { parseIndonesianDate } from '../src/utils/date';

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
const db = drizzle(sql, { schema });

function parseMarkdown(fileContent: string) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {} as Record<string, any>, content: fileContent };
  const yaml = match[1];
  const body = match[2].trim();
  const data: Record<string, any> = {};

  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val: any = line.slice(colonIdx + 1).trim();
    if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    } else if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    } else if (val === 'true') {
      val = true;
    } else if (val === 'false') {
      val = false;
    } else if (val.startsWith('[') && val.endsWith(']')) {
      val = val
        .slice(1, -1)
        .split(',')
        .map((s: string) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    }
    data[key] = val;
  }
  return { data, content: body };
}

async function seed() {
  console.log('Seeding existing articles to Neon PostgreSQL...');
  const articlesDir = join(process.cwd(), 'src/content/artikel');
  const files = readdirSync(articlesDir).filter((f) => f.endsWith('.md'));

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(articlesDir, file), 'utf-8');
    const { data, content } = parseMarkdown(raw);

    const publishDate = data.publishDate ? parseIndonesianDate(data.publishDate) : new Date();

    console.log(`Upserting article: ${slug} (${data.title})...`);

    await db
      .insert(schema.articles)
      .values({
        slug,
        title: data.title || slug,
        description: data.description || '',
        content,
        heroImage: data.heroImage || '/images/greenhouse/greenhouse-galvanis.webp',
        category: data.category || 'Panduan Konstruksi',
        tags: Array.isArray(data.tags) ? data.tags : [],
        author: data.author || 'Tim Ahli Agro Prima Greenhouse',
        status: 'published',
        featured: Boolean(data.featured),
        scheduledAt: publishDate,
        publishedAt: publishDate,
        createdAt: publishDate,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.articles.slug,
        set: {
          title: data.title || slug,
          description: data.description || '',
          content,
          heroImage: data.heroImage || '/images/greenhouse/greenhouse-galvanis.webp',
          category: data.category || 'Panduan Konstruksi',
          tags: Array.isArray(data.tags) ? data.tags : [],
          featured: Boolean(data.featured),
          status: 'published',
          publishedAt: publishDate,
          updatedAt: new Date(),
        },
      });
  }

  console.log(`✓ Successfully seeded ${files.length} articles into Neon PostgreSQL!`);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
