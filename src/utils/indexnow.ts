const HOST = 'agroprimagreenhouse.com';
const KEY = 'd4a79b28c13e45f992160357e84bf92a';

export async function notifyIndexNow(slugs: string[]): Promise<boolean> {
  if (!slugs || slugs.length === 0) return true;

  const urls = slugs.map((slug) => `https://${HOST}/artikel/${slug}/`);
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return res.status === 200 || res.status === 202;
  } catch (err) {
    console.error('Failed to notify IndexNow:', err);
    return false;
  }
}
