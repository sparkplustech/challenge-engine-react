'use client';

import './ChallengeList.css';

/**
 * Challenge List Component for Next.js Course
 */
export default function ChallengeList() {
  const challenges = [
    { id: '01-app-router-pages-layout', name: 'App Router, Pages, and Layout', difficulty: 'Beginner', description: 'Create root layout, home and about pages, and Link navigation' },
    { id: '02-server-and-client-components', name: 'Server and Client Components', difficulty: 'Beginner', description: 'Use Server vs Client Components and \'use client\' where needed' },
    { id: '03-data-fetching-server', name: 'Data Fetching in Server Components', difficulty: 'Beginner', description: 'Async Server Component with fetch and display data' },
    { id: '04-api-route-handlers', name: 'API Route Handlers', difficulty: 'Beginner', description: 'Create GET (and optional POST) Route Handlers that return JSON' },
    { id: '05-loading-and-streaming', name: 'Loading and Streaming', difficulty: 'Intermediate', description: 'Add loading.tsx and optional Suspense for streaming' },
    { id: '06-dynamic-routes', name: 'Dynamic Routes', difficulty: 'Intermediate', description: 'Create [id] or [slug] dynamic route and use params' },
    { id: '07-static-and-dynamic-rendering', name: 'Static and Dynamic Rendering', difficulty: 'Intermediate', description: 'Control force-static and force-dynamic rendering' },
    { id: '08-ssr-dynamic-rendering', name: 'SSR (Server-Side Rendering)', difficulty: 'Intermediate', description: 'Per-request server render with cache: no-store or force-dynamic' },
    { id: '09-server-actions-and-revalidation', name: 'Server Actions and Revalidation', difficulty: 'Intermediate', description: 'Server Actions with revalidatePath/revalidateTag' },
    { id: '10-caching-and-revalidating', name: 'Caching and Revalidating', difficulty: 'Intermediate', description: 'Fetch cache options and on-demand revalidation' },
    { id: '11-error-handling', name: 'Error Handling', difficulty: 'Intermediate', description: 'error.tsx and notFound() for error boundaries' },
    { id: '12-metadata-and-seo', name: 'Metadata and SEO', difficulty: 'Beginner', description: 'Export metadata or generateMetadata for title and description' },
    { id: '13-images-and-fonts', name: 'Images and Fonts', difficulty: 'Beginner', description: 'next/image and next/font optimization' },
    { id: '14-search-and-pagination', name: 'Search and Pagination', difficulty: 'Intermediate', description: 'Use searchParams for search and pagination' },
    { id: '15-redux-toolkit-with-nextjs', name: 'Redux Toolkit with Next.js', difficulty: 'Intermediate', description: 'Store, StoreProvider (Client), useSelector/useDispatch' },
    { id: '16-rtk-query-with-nextjs', name: 'RTK Query with Next.js', difficulty: 'Intermediate', description: 'createApi, fetchBaseQuery, and query hooks in Client Components' },
    { id: '17-fullstack-capstone', name: 'Fullstack Capstone', difficulty: 'Advanced', description: 'Combine dynamic route, Client Component, error handling, metadata' }
  ];

  return (
    <div className="challenge-list">
      <h2>Next.js App Router Challenges</h2>
      <p>Complete these challenges to master Next.js App Router!</p>
      <div className="challenges-grid">
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge-card">
            <div className="challenge-header">
              <h3>{challenge.name}</h3>
              <span className={`difficulty-badge ${challenge.difficulty.toLowerCase()}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="challenge-description">{challenge.description}</p>
            <div className="challenge-actions">
              <a
                href={`./challenges/${challenge.id}/README.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View Challenge
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
