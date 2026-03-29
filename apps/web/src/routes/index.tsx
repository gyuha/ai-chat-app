import { useQuery } from '@tanstack/react-query';
import { createRoute } from '@tanstack/react-router';

import { Sidebar, SidebarContent } from '../components/ui/sidebar';
import { fetchHealth, fetchModels } from '../lib/api';

import { rootRoute } from './__root';

const HomePage = () => {
  const healthQuery = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });
  const modelsQuery = useQuery({
    queryKey: ['models'],
    queryFn: fetchModels,
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <SidebarContent>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Foundation</p>
            <h1 className="mt-2 text-lg font-semibold text-slate-100">OpenRouter Free Chat</h1>
          </div>
          <button
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-left text-sm text-slate-200 transition duration-200 hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            type="button"
          >
            Phase 1 Smoke Path
          </button>
        </SidebarContent>
      </Sidebar>

      <main className="flex-1 px-5 py-8 md:px-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <header className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">Internal API Only</p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-50">
              Foundation smoke screen
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-400">
              This screen proves the browser talks only to the internal NestJS API. The actual
              conversational shell lands in Phase 2.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Health</p>
              <p className="mt-3 text-xl font-medium text-slate-50">
                {healthQuery.data?.status ?? 'Loading...'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {healthQuery.data?.service ?? 'Checking internal server status'}
              </p>
            </article>

            <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">Allowlisted models</p>
              <p className="mt-3 text-xl font-medium text-slate-50">
                {modelsQuery.data?.length ?? 0}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {modelsQuery.data?.map((model) => (
                  <li key={model.id} className="rounded-lg bg-slate-950/80 px-3 py-2">
                    {model.id}
                  </li>
                )) ?? <li className="text-slate-500">Loading model policy…</li>}
              </ul>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
};

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
