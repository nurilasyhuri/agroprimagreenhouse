import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { desc, count } from 'drizzle-orm';

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

async function checkStatus() {
  console.log('====================================================');
  console.log('  STATUS DATABASE & CRON - AGRO PRIMA GREENHOUSE');
  console.log('====================================================\n');

  // 1. Hitung total artikel
  const [totalArticles] = await db.select({ value: count() }).from(schema.articles);
  console.log(`📊 Total Artikel di Database: ${totalArticles?.value || 0}`);

  // 2. Daftar artikel terbaru
  const recentArticles = await db
    .select({
      id: schema.articles.id,
      slug: schema.articles.slug,
      title: schema.articles.title,
      status: schema.articles.status,
      scheduledAt: schema.articles.scheduledAt,
      publishedAt: schema.articles.publishedAt,
    })
    .from(schema.articles)
    .orderBy(desc(schema.articles.id))
    .limit(10);

  console.log('\n📰 Daftar Artikel Terbaru di Database:');
  console.table(
    recentArticles.map((a) => ({
      ID: a.id,
      Judul: a.title.slice(0, 45) + (a.title.length > 45 ? '...' : ''),
      Slug: a.slug,
      Status: a.status,
      'Tayang Pada': a.publishedAt ? a.publishedAt.toISOString() : (a.scheduledAt ? a.scheduledAt.toISOString() : '-'),
    }))
  );

  // 3. Log Cronjob Terbaru
  const logs = await db
    .select()
    .from(schema.cronLogs)
    .orderBy(desc(schema.cronLogs.id))
    .limit(5);

  console.log('\n⏱️ Log Eksekusi Cronjob Terakhir:');
  if (logs.length === 0) {
    console.log('  (Belum ada riwayat eksekusi cronjob)');
  } else {
    console.table(
      logs.map((l) => ({
        ID: l.id,
        Job: l.jobName,
        Status: l.status,
        'Diproses': l.articlesProcessed,
        Pesan: l.message,
        Waktu: l.executedAt.toISOString(),
      }))
    );
  }

  // 4. Media/Blob Items
  const [totalMedia] = await db.select({ value: count() }).from(schema.media);
  console.log(`\n🖼️ Total Gambar di Tabel Media: ${totalMedia?.value || 0}`);
  console.log('\n====================================================');
}

checkStatus().catch((err) => {
  console.error('Gagal mengecek status DB:', err);
  process.exit(1);
});
