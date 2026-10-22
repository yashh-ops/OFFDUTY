import { Link } from "react-router-dom";
import heroImage from "../../assets/hero/unboxstorehero1.png";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="offduty-hero relative isolate flex min-h-[660px] overflow-hidden bg-[#20221e] text-white sm:min-h-[min(800px,calc(100svh-100px))] lg:min-h-[min(850px,calc(100svh-97px))]"
    >
      {/* Full-width campaign image */}
      <img
        src={heroImage}
        alt="OFFDUTY streetwear campaign"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[58%_center] sm:object-center"
      />

      {/* Image overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/10"
      />

      {/* Hero content */}
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-between px-5 pb-7 pt-14 sm:px-10 sm:pb-9 sm:pt-16 lg:px-14 lg:pb-10 lg:pt-20">
        {/* Campaign label */}
        <div className="flex items-center justify-between gap-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-[10px]">
          <span>Independent streetwear</span>
          <span>Campaign No. 001</span>
        </div>

        {/* Main headline */}
        <div className="my-auto max-w-[1000px] py-16 sm:py-20">
          <div className="hero-reveal">
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-white/85 sm:mb-7 sm:text-xs">
              OFFDUTY® — YOUR EVERYDAY UNIFORM
            </p>

            <h1
              id="hero-heading"
              className="text-[clamp(3.7rem,10.4vw,10rem)] font-black uppercase leading-[0.79] tracking-[-0.085em]"
            >
              <span className="block">Not made</span>

              <span className="mt-3 block sm:mt-5">
                to fit <span className="text-white/55">in.</span>
              </span>
            </h1>

            <p className="mt-7 max-w-md text-sm leading-6 text-white/80 sm:mt-9 sm:text-base sm:leading-7">
              Oversized fits. Everyday essentials.
              <br className="hidden sm:block" />
              No dress code. No compromise.
            </p>

            {/* Compact shopping buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
              <Link
                to="/shop?gender=men"
                className="group inline-flex min-h-11 items-center justify-center gap-3 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-950 transition-colors duration-300 hover:bg-[#d6d2c8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-w-[150px]"
              >
                Shop Men
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </Link>

              <Link
                to="/shop?gender=women"
                className="group inline-flex min-h-11 items-center justify-center gap-3 border border-white/75 bg-black/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:min-w-[150px]"
              >
                Shop Women
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Campaign footer — no horizontal border */}
        <div className="flex items-end justify-between gap-4 pt-4 sm:pt-5">
          <div className="space-y-1">
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/65">
              Designed for your own lane
            </p>

            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
              Drop 001 — Explore the collection
            </p>
          </div>

          <Link
            to="/shop"
            className="shrink-0 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-opacity hover:opacity-65"
          >
            Discover all <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      {/* Entrance animation */}
      <style>{`
        @keyframes offdutyHeroReveal {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-reveal {
          animation: offdutyHeroReveal 750ms ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-reveal {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
