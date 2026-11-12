export default function CatchAllLoading() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-8 animate-pulse">
      {/* Top Banner Ad Skeleton */}
      <div className="mb-6 h-24 sm:h-28 w-full rounded-xl bg-slate-200/80" />

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Column */}
        <div className="flex flex-col gap-6">
          {/* Breadcrumbs skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 rounded bg-slate-200" />
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-3 w-3 rounded-full bg-slate-200" />
            <div className="h-4 w-36 rounded bg-slate-200" />
          </div>

          {/* Headline skeleton */}
          <div className="space-y-3">
            <div className="h-8 md:h-10 w-full max-w-2xl rounded-lg bg-slate-200" />
            <div className="h-8 md:h-10 w-4/5 max-w-xl rounded-lg bg-slate-200" />
          </div>

          {/* Meta Bar skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-4">
            <div className="flex items-center gap-4">
              <div className="h-7 w-28 rounded-full bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="h-8 w-8 rounded-full bg-slate-200" />
            </div>
          </div>

          {/* Featured Image skeleton */}
          <div className="aspect-video w-full rounded-2xl bg-slate-200 shadow-sm" />

          {/* Image caption skeleton */}
          <div className="h-4 w-2/3 rounded bg-slate-100" />

          {/* Content Top Ad Skeleton */}
          <div className="h-20 sm:h-24 w-full rounded-xl bg-slate-200/80 my-2" />

          {/* Article Paragraphs skeleton */}
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-10/12 rounded bg-slate-200" />
              <div className="h-4 w-4/5 rounded bg-slate-200" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <aside className="hidden lg:flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="border-b-2 border-slate-900 pb-2">
              <div className="h-6 w-32 rounded bg-slate-200" />
            </div>
            <div className="flex flex-col gap-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-white p-2.5 shadow-sm"
                >
                  <div className="h-16 w-24 shrink-0 rounded-lg bg-slate-200" />
                  <div className="flex flex-1 flex-col justify-center gap-2">
                    <div className="h-3.5 w-full rounded bg-slate-200" />
                    <div className="h-3.5 w-4/5 rounded bg-slate-200" />
                    <div className="h-2.5 w-16 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Ad Skeleton */}
          <div className="h-[250px] w-full rounded-xl bg-slate-200/80" />
        </aside>
      </div>
    </main>
  );
}
