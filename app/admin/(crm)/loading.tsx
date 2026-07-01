export default function AdminContentLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-28 rounded-[2rem] bg-white" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-[1.75rem] bg-white" />
        ))}
      </div>
      <div className="h-96 rounded-[2rem] bg-white" />
    </div>
  );
}
