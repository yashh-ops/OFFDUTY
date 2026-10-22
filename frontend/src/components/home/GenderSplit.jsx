import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import menImage from "../../assets/hero/unboxstorehero2.png";
import womenImage from "../../assets/hero/unboxstorehero3.png";

const panels = [
  {
    label: "Men",
    number: "01",
    description: "Everyday essentials, made different.",
    to: "/shop?gender=men",
    image: menImage,
  },
  {
    label: "Women",
    number: "02",
    description: "Find your own kind of comfort.",
    to: "/shop?gender=women",
    image: womenImage,
  },
];

export default function GenderSplit() {
  return (
    <section
      aria-label="Shop by collection"
      className="bg-[#f7f7f5] px-4 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="mx-auto max-w-[1600px]">
        {/* Section heading */}
        <div className="mb-7 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500">
              Find your fit
            </p>

            <h2 className="text-[24px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-black sm:text-[42px] lg:text-[46px]">
              Shop by collection<span className="text-neutral-400">.</span>
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-6 text-neutral-500">
            Thoughtful everyday pieces, selected for your own style.
          </p>
        </div>

        {/* Collection panels */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {panels.map((panel) => (
            <Link
              key={panel.label}
              to={panel.to}
              aria-label={`Shop the ${panel.label.toLowerCase()} collection`}
              className="group relative isolate block aspect-[4/4.5] overflow-hidden bg-neutral-200 sm:aspect-[4/5] lg:aspect-[0.91/1] xl:aspect-[1/1]"
            >
              {/* Collection image */}
              <img
                src={panel.image}
                alt={`${panel.label} collection`}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.045]"
              />

              {/* Contrast overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5 transition-colors duration-500 group-hover:from-black/75" />

              {/* Top information */}
              <div className="absolute inset-x-5 top-5 flex items-center justify-between text-white sm:inset-x-7 sm:top-7 lg:inset-x-9 lg:top-9">
                <span className="text-[10px] font-medium tracking-[0.18em]">
                  {panel.number} / 02
                </span>

                <span className="border border-white/50 px-3 py-1.5 text-[10px] tracking-wide backdrop-blur-sm">
                  New perspective
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white sm:inset-x-7 sm:bottom-7 lg:inset-x-9 lg:bottom-9">
                <div className="min-w-0">
                  <p className="mb-2 text-xs text-white/75 sm:text-sm">
                    {panel.description}
                  </p>

                  <h3 className="text-4xl font-medium tracking-[-0.055em] sm:text-5xl lg:text-6xl xl:text-7xl">
                    {panel.label}
                  </h3>

                  <span className="mt-4 inline-flex items-center gap-2 border-b border-white/70 pb-1.5 text-xs transition-all duration-300 group-hover:gap-3 sm:text-sm">
                    Explore collection
                    <ArrowUpRight
                      size={15}
                      strokeWidth={1.6}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>

                {/* Animated arrow */}
                <span className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/5 backdrop-blur-sm transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-neutral-950 sm:h-14 sm:w-14">
                  <ArrowUpRight
                    size={21}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:rotate-45"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-5 flex items-center justify-between border-t border-neutral-900/10 pt-4">
          <p className="text-[10px] tracking-wide text-neutral-500 sm:text-xs">
            Designed for everyday wear
          </p>

          <p className="text-[10px] tracking-wide text-neutral-500 sm:text-xs">
            Explore your style ↗
          </p>
        </div>
      </div>
    </section>
  );
}
