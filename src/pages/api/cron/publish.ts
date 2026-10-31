import type { APIRoute } from 'astro';
import { publishDueScheduledArticles } from '../../../db/queries';
import { notifyIndexNow } from '../../../utils/indexnow';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Verify cron secret when configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const url = new URL(request.url);
    const keyParam = url.searchParams.get('key');
    if (keyParam !== cronSecret) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid cron authorization' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  try {
    const result = await publishDueScheduledArticles();

    if (result.publishedSlugs.length > 0) {
      // Trigger instant search engine indexing for newly published articles
      await notifyIndexNow(result.publishedSlugs);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message:
          result.processedCount > 0
            ? `Successfully published ${result.processedCount} article(s).`
            : 'No scheduled articles were due for publication.',
        processedCount: result.processedCount,
        publishedSlugs: result.publishedSlugs,
        executedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error?.message || 'Internal Server Error during article publishing cron.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }
};
