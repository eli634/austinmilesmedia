export default function AdminLoading() {
  return (
    <main className="relative z-10 min-h-screen bg-[#f6f9fc] text-[#0b4a7a]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 border-r border-white/10 bg-ink lg:block" />
      <div className="min-h-screen px-4 py-6 lg:ml-56 lg:px-8 lg:py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-28 rounded-[2rem] bg-white" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-[1.75rem] bg-white" />
            ))}
          </div>
          <div className="h-96 rounded-[2rem] bg-white" />
        </div>
      </div>
    </main>
  );
}
