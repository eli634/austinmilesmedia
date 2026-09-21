const platforms = [
  { label: "IG", x: 100, y: 22 },
  { label: "TT", x: 155, y: 62 },
  { label: "YT", x: 134, y: 127 },
  { label: "FB", x: 66, y: 127 },
  { label: "X", x: 45, y: 62 },
];

const bars = [30, 44, 40, 58, 66, 82, 98];

function ClipGrid() {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`relative aspect-[9/16] w-9 overflow-hidden rounded-[5px] border ${
            i % 3 === 1
              ? "border-accent/40 bg-accent/15"
              : "border-creme/15 bg-creme/[0.06]"
          }`}
        >
          {i % 2 === 0 && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[7px] text-creme/50">
              ▶
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function ChannelsNode() {
  return (
    <svg
      viewBox="0 0 200 150"
      aria-hidden
      className="h-32 w-full max-w-[220px]"
    >
      {platforms.map((p) => (
        <line
          key={p.label}
          x1="100"
          y1="80"
          x2={p.x}
          y2={p.y}
          stroke="rgba(248,251,255,0.18)"
          strokeWidth="1"
        />
      ))}
      {platforms.map((p) => (
        <g key={`node-${p.label}`}>
          <circle
            cx={p.x}
            cy={p.y}
            r="12"
            fill="#08294a"
            stroke="rgba(248,251,255,0.25)"
            strokeWidth="1"
          />
          <text
            x={p.x}
            y={p.y + 3}
            textAnchor="middle"
            fontSize="8"
            fill="rgba(210,222,236,0.72)"
            fontFamily="var(--font-body)"
          >
            {p.label}
          </text>
        </g>
      ))}
      <circle cx="100" cy="80" r="17" fill="#f8fbff" />
      <text
        x="100"
        y="83"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#08294a"
        fontFamily="var(--font-body)"
      >
        YOU
      </text>
    </svg>
  );
}

function CadenceBars() {
  return (
    <svg viewBox="0 0 220 120" aria-hidden className="h-32 w-full max-w-[220px]">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={14 + i * 29}
          y={110 - h}
          width="18"
          height={h}
          rx="3"
          fill={i >= bars.length - 3 ? "#f8fbff" : "rgba(248,251,255,0.16)"}
        />
      ))}
    </svg>
  );
}

function CameraVisual() {
  return (
    <svg viewBox="0 0 180 130" aria-hidden className="h-32 w-full max-w-[200px]">
      <rect
        x="34"
        y="34"
        width="78"
        height="54"
        rx="12"
        fill="rgba(248,251,255,0.06)"
        stroke="rgba(248,251,255,0.28)"
      />
      <path
        d="M112 52L146 38V84L112 70V52Z"
        fill="rgba(248,251,255,0.1)"
        stroke="rgba(248,251,255,0.28)"
        strokeLinejoin="round"
      />
      <circle
        cx="72"
        cy="61"
        r="17"
        fill="rgba(8,41,74,0.72)"
        stroke="rgba(248,251,255,0.38)"
      />
      <circle cx="72" cy="61" r="7" fill="rgba(248,251,255,0.78)" />
      <circle cx="99" cy="48" r="4" fill="rgba(248,251,255,0.7)" />
      <rect
        x="55"
        y="93"
        width="36"
        height="7"
        rx="3.5"
        fill="rgba(248,251,255,0.18)"
      />
      <path
        d="M73 88V102"
        stroke="rgba(248,251,255,0.28)"
        strokeLinecap="round"
      />
      <g className="origin-center animate-pulse">
        <circle cx="40" cy="24" r="4" fill="#f8fbff" />
        <text
          x="50"
          y="27"
          fontSize="8"
          letterSpacing="2"
          fill="rgba(210,222,236,0.72)"
          fontFamily="var(--font-body)"
        >
          REC
        </text>
      </g>
    </svg>
  );
}

const stages = [
  {
    title: "On-site shoot",
    sub: "On-site at your location.",
    visual: <CameraVisual />,
  },
  {
    title: "Short-form clips",
    sub: "Fresh content, filmed consistently.",
    visual: <ClipGrid />,
  },
  {
    title: "Your channels",
    sub: "Posted where your customers actually scroll.",
    visual: <ChannelsNode />,
  },
  {
    title: "Steady output",
    sub: "Consistent, high-quality content every month.",
    visual: <CadenceBars />,
  },
];

const arrowLabels = ["We film", "We cut", "We post"];

const features = [
  {
    title: "We film the videos",
    body: [
      "You don\u2019t hire a camera guy, learn an editor, or manage a freelancer. Our crew films your videos and handles the edit, and the same people show up every time \u2014 by the third shoot they\u2019re not learning your business, they\u2019re just shooting it.",
    ],
  },
  {
    title: "Direct access. Real management.",
    body: [
      "You get a dedicated account manager who knows your business, understands your goals, and keeps the entire operation moving.",
      "You also get a direct line to the team creating your content, so questions get answered quickly, requests get handled, and changes are made without unnecessary back-and-forth.",
    ],
  },
  {
    title: "Content that compounds",
    body: [
      "Every shoot feeds a library of consistent, high-quality content built around the work you want more of. We\u2019re not chasing views for their own sake \u2014 we\u2019re building a feed that sells your business every day it\u2019s posted.",
    ],
  },
];

export function HowItWorks() {
  return (
    <section
      id="process"
      className="relative z-10 scroll-mt-24 bg-creme text-[#08294a]"
    >
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-10 pt-28 sm:px-8 lg:px-10 lg:pb-12 lg:pt-36">
      <div className="mb-14 text-center">
        <h2 className="mx-auto max-w-[18ch] font-[family-name:var(--font-goliath-sans)] text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[#08294a]">
          How it actually works.
        </h2>
      </div>

      {/* Flow panel */}
      <div className="hover-glow rounded-3xl border border-[#d8e3ef] bg-[#f4f8fc] p-6 shadow-[0_22px_70px_rgba(3,16,36,0.08)] sm:p-10">
        <div className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-center lg:justify-between">
          {stages.map((stage, index) => (
            <div
              key={stage.title}
              className="flex flex-col items-center gap-6 lg:flex-1"
            >
              <div className="flex w-full flex-col items-center gap-4">
                <div className="hover-glow flex min-h-[8.5rem] min-w-36 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#06111f] via-[#0a2842] to-[#0f5d73] px-6 py-4 shadow-[0_18px_48px_rgba(3,16,36,0.16)]">
                  {stage.visual}
                </div>
                <div className="text-center">
                  <p className="font-[family-name:var(--font-goliath-sans)] text-lg font-extrabold lowercase tracking-[-0.035em] text-[#08294a]">
                    {stage.title.toLowerCase()}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-goliath-sans)] text-xs font-medium leading-snug text-[#607086]">
                    {stage.sub}
                  </p>
                </div>
              </div>

              {index < stages.length - 1 && (
                <div className="flex flex-col items-center gap-1 lg:hidden">
                  <span className="text-xl text-[#0f5d73]">↓</span>
                  <span className="font-[family-name:var(--font-goliath-mono)] text-[0.7rem] uppercase tracking-widest text-[#607086]">
                    {arrowLabels[index]}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Supporting feature cards */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="hover-glow rounded-3xl border border-[#d8e3ef] bg-white p-7 shadow-[0_18px_55px_rgba(3,16,36,0.07)]"
          >
            <h3 className="font-[family-name:var(--font-goliath-sans)] text-xl font-extrabold lowercase tracking-[-0.04em] text-[#08294a]">
              {feature.title.toLowerCase()}
            </h3>
            <div className="mt-3 space-y-3">
              {feature.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="font-[family-name:var(--font-goliath-sans)] text-[0.95rem] font-medium leading-relaxed text-[#52677f]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
