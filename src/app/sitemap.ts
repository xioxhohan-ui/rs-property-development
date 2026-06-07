import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase/admin';

const BASE_URL = 'https://rsproperty.com.bd';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static Routes
  const routes = [
    '',
    '/plots',
    '/blog',
    '/contact',
    '/sell',
    '/map',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Plots
    const plotsSnapshot = await db.collection('plots').where('status', '==', 'Available').get();
    const plots = plotsSnapshot.docs.map((doc) => ({
      url: `${BASE_URL}/plots/${doc.data().slug || doc.id}`,
      lastModified: doc.data().updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    // Dynamic Blogs
    const blogsSnapshot = await db.collection('posts').where('status', '==', 'Published').get();
    const blogs = blogsSnapshot.docs.map((doc) => ({
      url: `${BASE_URL}/blog/${doc.data().slug || doc.id}`,
      lastModified: doc.data().updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...routes, ...plots, ...blogs];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return at least the static routes if DB fails
    return routes;
  }
}
