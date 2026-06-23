import type { MetadataRoute } from 'next';

const SITE_URL = 'https://predictionkit.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/getting-started', '/components', '/providers', '/demo'];
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
