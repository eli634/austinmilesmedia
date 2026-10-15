export function VslSeat() {
  return (
    <figure className="mt-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.07] p-2.5 shadow-[0_28px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_50%_0%,rgba(248,251,255,0.34),rgba(70,205,240,0.16)_34%,rgba(2,7,19,0.72)_100%)]">
          <div
            aria-hidden
            className="absolute -top-20 left-1/2 size-64 -translate-x-1/2 rounded-full bg-[rgba(70,205,240,0.45)] blur-3xl"
          />
          <p className="relative rounded-full border border-white/20 bg-white/10 px-4 py-2 font-body text-[0.95rem] font-semibold text-creme shadow-[0_8px_30px_rgba(2,7,19,0.25)] backdrop-blur-md">
            VSL here
          </p>
        </div>
      </div>
    </figure>
  );
}
