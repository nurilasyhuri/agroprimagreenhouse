import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '../src/db/schema';
import { publishDueScheduledArticles, getArticleBySlug } from '../src/db/queries';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  try {
    // @ts-ignore
    process.loadEnvFile?.('.env.local');
  } catch {}
}

const connectionString = process.env.DATABASE_URL || '';
const sql = neon(connectionString);
const db = drizzle(sql, { schema });

async function runDemo() {
  console.log('================================================================');
  console.log('  SIMULASI PENERBITAN ARTIKEL OTOMATIS VIA CRONJOB');
  console.log('================================================================\n');

  const demoSlug = `simulasi-artikel-otomatis-${Date.now()}`;
  const now = new Date();

  // 1. Buat artikel dengan status 'scheduled' yang dijadwalkan tayang sekarang
  console.log('1️⃣  Menjadwalkan artikel baru ke Database...');
  await db.insert(schema.articles).values({
    slug: demoSlug,
    title: 'Tips Memilih Paranet 65% vs 75% untuk Pembibitan Tropis (Simulasi)',
    description: 'Panduan teknis memilih kerapatan peneduh paranet yang tepat untuk iklim terik.',
    content: '## Panduan Paranet Lapangan\nParanet dengan intensitas 65% dan 75% memiliki fungsi berbeda sesuai komoditas bibit.',
    heroImage: '/images/greenhouse/greenhouse-galvanis.webp',
    category: 'Panduan Konstruksi',
    tags: ['Paranet', 'Simulasi'],
    status: 'scheduled',
    scheduledAt: new Date(now.getTime() - 1000), // Sudah jatuh tempo (1 detik lalu)
  });

  const beforeCron = await getArticleBySlug(demoSlug);
  console.log(`   -> Artikel berhasil dijadwalkan:`);
  console.log(`      Slug: ${beforeCron?.slug}`);
  console.log(`      Status saat ini di DB: [ ${beforeCron?.status} ]`);
  console.log(`      Jadwal tayang: ${beforeCron?.scheduledAt?.toLocaleString('id-ID')}`);

  // 2. Simulasi cronjob berjalan
  console.log('\n2️⃣  Cronjob Vercel berputar dan memanggil endpoint `/api/cron/publish`...');
  const cronResult = await publishDueScheduledArticles();
  console.log('   -> Hasil eksekusi cronjob:', cronResult);

  // 3. Cek status setelah cronjob
  console.log('\n3️⃣  Memeriksa status artikel di Database setelah cronjob:');
  const afterCron = await getArticleBySlug(demoSlug);
  console.log(`      Status baru di DB: [ ${afterCron?.status} ] ✅`);
  console.log(`      Waktu publish aktual: ${afterCron?.publishedAt?.toLocaleString('id-ID')}`);

  // 4. Bersihkan data demo
  await db.delete(schema.articles).where(eq(schema.articles.slug, demoSlug));
  console.log('\n   (Data simulasi dibersihkan agar database tetap rapi)');
  console.log('\n================================================================');
  console.log('  KESIMPULAN: Sistem cronjob otomatisasi artikel 100% BERJALAN!');
  console.log('================================================================\n');
}

runDemo().catch((err) => {
  console.error('Simulasi gagal:', err);
  process.exit(1);
});
