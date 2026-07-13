import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = 'https://www.cpcheats.in' 
  const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:5000';

  let interviewRoutes: string[] = [];
  let algorithmRoutes: string[] = [];

  try {
    // Fetch interviews from Express backend via HTTP
    const interviewRes = await fetch(`${BACKEND_URL}/api/interview/show-home-interview`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 } 
    });
    if (interviewRes.ok) {
      const data = await interviewRes.json();
      if (Array.isArray(data.blogs)) {
        interviewRoutes = data.blogs.map((page: { _id: string }) => `interview/${page._id}`);
      }
    }
  } catch (err) {
    console.error("Sitemap builder: failed to fetch interview pages from backend:", err);
  }

  try {
    // Fetch algorithms from Express backend via HTTP
    const algoRes = await fetch(`${BACKEND_URL}/api/algorithm/show-home-algorithm`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 } 
    });
    if (algoRes.ok) {
      const data = await algoRes.json();
      if (Array.isArray(data.algorithm)) {
        algorithmRoutes = data.algorithm.map((page: { slug: string }) => `algorithm/${page.slug}`);
      }
    }
  } catch (err) {
    console.error("Sitemap builder: failed to fetch algorithm pages from backend:", err);
  }

  const staticRoutes = [
    '',
    'login',
    'sign-up',
    'feedback',
    'coding-sheets',
    'live-interview',
    'live-interview/ai-interview',
    'compare',
  ]

  const codeEditorRoutes = [
    'code-editor/C',
    'code-editor/C++',
    'code-editor/Python',
    'code-editor/Java',
    'code-editor/JavaScript',
    'code-editor/Ruby',
    'code-editor/C#',
  ]

  const allRoutes = [...staticRoutes, ...codeEditorRoutes, ...interviewRoutes, ...algorithmRoutes]

  return allRoutes.map((route) => ({
    url: `${BASE_URL}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8, 
  }))
}
