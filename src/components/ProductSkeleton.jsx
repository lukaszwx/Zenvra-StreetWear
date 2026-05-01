function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
      <div className="h-64 animate-pulse bg-zinc-800" />

      <div className="space-y-4 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-zinc-800" />
        <div className="h-6 w-4/5 animate-pulse rounded bg-zinc-800" />
        <div className="h-7 w-32 animate-pulse rounded bg-zinc-800" />
        <div className="h-11 animate-pulse rounded-xl bg-zinc-800" />
        <div className="h-12 animate-pulse rounded-xl bg-zinc-800" />
      </div>
    </div>
  );
}

export default ProductSkeleton;