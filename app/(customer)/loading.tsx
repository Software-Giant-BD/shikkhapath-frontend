export default function CustomerLoading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 animate-pulse">
      <div className="h-28 w-full rounded-2xl bg-slate-200/80 mb-6" />
      <div className="space-y-4">
        <div className="h-8 w-1/3 rounded-lg bg-slate-200" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <div className="aspect-video w-full rounded-xl bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200 mt-2" />
              <div className="h-4 w-1/2 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
