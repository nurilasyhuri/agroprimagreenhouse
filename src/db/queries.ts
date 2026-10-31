import { eq, and, lte, or, sql, desc } from 'drizzle-orm';
import { db, articles, cronLogs, type Article, type NewArticle } from './index';

/**
 * Fetch all articles visible to the public:
 * Either status = 'published' OR (status = 'scheduled' AND scheduled_at <= NOW())
 */
export async function getPublishedArticles(options?: {
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<Article[]> {
  try {
    const now = new Date();
    const visibilityCondition = or(
      eq(articles.status, 'published'),
      and(eq(articles.status, 'scheduled'), lte(articles.scheduledAt, now))
    );

    const whereClause = options?.category && options.category !== 'Semua'
      ? and(visibilityCondition, eq(articles.category, options.category))
      : visibilityCondition;

    let query = db
      .select()
      .from(articles)
      .where(whereClause)
      .orderBy(desc(sql`COALESCE(${articles.publishedAt}, ${articles.scheduledAt}, ${articles.createdAt})`));

    if (options?.limit) {
      // @ts-ignore
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      // @ts-ignore
      query = query.offset(options.offset);
    }

    return await query;
  } catch (error) {
    console.error('Error fetching articles from Neon DB:', error);
    return [];
  }
}

/**
 * Fetch single article by slug if it is visible to public
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const now = new Date();
    const visibilityCondition = or(
      eq(articles.status, 'published'),
      and(eq(articles.status, 'scheduled'), lte(articles.scheduledAt, now))
    );

    const rows = await db
      .select()
      .from(articles)
      .where(and(eq(articles.slug, slug), visibilityCondition))
      .limit(1);

    return rows[0] || null;
  } catch (error) {
    console.error(`Error fetching article [${slug}] from Neon DB:`, error);
    return null;
  }
}

/**
 * Cronjob worker function:
 * Finds articles with status = 'scheduled' AND scheduled_at <= NOW()
 * Updates them to status = 'published' and sets published_at = NOW()
 */
export async function publishDueScheduledArticles(): Promise<{
  processedCount: number;
  publishedSlugs: string[];
}> {
  const now = new Date();

  try {
    // 1. Identify articles due for publishing
    const dueArticles = await db
      .select({ id: articles.id, slug: articles.slug, title: articles.title })
      .from(articles)
      .where(and(eq(articles.status, 'scheduled'), lte(articles.scheduledAt, now)));

    if (dueArticles.length === 0) {
      await db.insert(cronLogs).values({
        jobName: 'publish-scheduled-articles',
        status: 'success',
        message: 'No scheduled articles due for publication.',
        articlesProcessed: 0,
        executedAt: now,
      });

      return { processedCount: 0, publishedSlugs: [] };
    }

    const publishedSlugs: string[] = [];

    // 2. Update each due article to 'published'
    for (const item of dueArticles) {
      await db
        .update(articles)
        .set({
          status: 'published',
          publishedAt: now,
          updatedAt: now,
        })
        .where(eq(articles.id, item.id));

      publishedSlugs.push(item.slug);
    }

    // 3. Log the successful cron execution
    await db.insert(cronLogs).values({
      jobName: 'publish-scheduled-articles',
      status: 'success',
      message: `Published ${publishedSlugs.length} articles: ${publishedSlugs.join(', ')}`,
      articlesProcessed: publishedSlugs.length,
      executedAt: now,
    });

    return {
      processedCount: publishedSlugs.length,
      publishedSlugs,
    };
  } catch (error: any) {
    console.error('Cron publication error:', error);

    try {
      await db.insert(cronLogs).values({
        jobName: 'publish-scheduled-articles',
        status: 'failed',
        message: String(error?.message || error),
        articlesProcessed: 0,
        executedAt: now,
      });
    } catch (logErr) {
      console.error('Failed to write failure log:', logErr);
    }

    throw error;
  }
}

/**
 * Create or schedule a new article
 */
export async function insertArticle(newArticle: NewArticle): Promise<Article> {
  const [created] = await db.insert(articles).values(newArticle).returning();
  return created;
}
