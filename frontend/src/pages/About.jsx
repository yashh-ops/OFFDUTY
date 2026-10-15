import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import aboutImage from "../assets/10062.jpg";

const VALUES = [
  {
    number: "01",
    icon: ShieldCheck,
    title: "Quality, Always",
    desc: "We focus on considered pieces and dependable quality, so the things you wear feel right beyond the first impression.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Considered Design",
    desc: "Clean silhouettes, versatile essentials, and thoughtful details that make everyday style feel effortless.",
  },
  {
    number: "03",
    icon: Users,
    title: "People First",
    desc: "A better shopping experience starts with you. We aim to make discovering your next favourite piece simple.",
  },
];

export default function About() {
  return (
    <main className="overflow-hidden bg-[#f7f7f5] text-neutral-900">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12 lg:px-8 lg:pb-24">
        <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500 sm:text-xs">
            OFFDUTY / OUR STORY
          </p>

          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 sm:text-xs">
            Independent expression
          </p>
        </div>

        <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12 lg:gap-20">
          <div className="order-2 flex flex-col items-start md:order-1">
            <span className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              More than what you wear
            </span>

            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.065em] sm:text-6xl lg:text-7xl xl:text-[88px]">
              Style without
              <br />
              the noise<span className="text-neutral-400">.</span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-neutral-600 sm:mt-8 sm:text-base sm:leading-8">
              Everyday essentials. Individual expression. OFFDUTY is about
              finding your style, owning your choices, and feeling comfortable
              being yourself.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5 sm:mt-10">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-5 bg-neutral-900 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-neutral-700 sm:px-6"
              >
                Shop the collection
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#our-story"
                className="group inline-flex items-center gap-2 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-950"
              >
                Discover our story
                <ArrowDownRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                />
              </a>
            </div>

            <div className="mt-12 flex w-full max-w-md items-center justify-between border-t border-neutral-200 pt-5 sm:mt-16">
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Designed for everyday
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                EST. IN EXPRESSION
              </p>
            </div>
          </div>

          <div className="group relative order-1 md:order-2">
            <div className="relative aspect-[4/4.8] overflow-hidden bg-[#e9e8e3] sm:aspect-[4/4.5]">
              <img
                src={aboutImage}
                alt="OFFDUTY fashion and everyday style"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white sm:bottom-7 sm:left-7 sm:right-7">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-white/70">
                    The OFFDUTY perspective
                  </p>
                  <p className="mt-2 text-xl font-medium tracking-tight sm:text-2xl">
                    Wear it your way.
                  </p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/50 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white group-hover:text-neutral-900">
                  <ArrowDownRight size={18} />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-3 -right-2 -z-0 h-16 w-16 border-b border-r border-neutral-300 sm:-bottom-4 sm:-right-4 sm:h-24 sm:w-24" />
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-[0.7fr_1.3fr] md:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 sm:text-xs">
              01 / The beginning
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              Our
              <br className="hidden md:block" />
              story<span className="text-neutral-400">.</span>
            </h2>

            <div className="mt-6 h-px w-12 bg-neutral-900" />
          </div>

          <div className="max-w-2xl">
            <p className="text-xl font-medium leading-relaxed tracking-[-0.035em] sm:text-2xl sm:leading-relaxed">
              We believe personal style should feel natural, not complicated.
            </p>

            <p className="mt-6 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
              OFFDUTY was created around a simple idea: make it easier to
              discover pieces that feel like you. We want shopping to feel less
              overwhelming and more personal, with everyday essentials that
              leave room for individual expression.
            </p>

            <p className="mt-4 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
              From the pieces you reach for every morning to the details that
              make an outfit your own, our approach is rooted in versatility,
              thoughtful design, and a more considered way to explore style.
            </p>

            <div className="mt-9 border-l-2 border-neutral-900 pl-5 sm:mt-10 sm:pl-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Our mission
              </p>

              <p className="mt-3 text-base font-medium leading-7 tracking-tight text-neutral-900 sm:text-lg sm:leading-8">
                To make everyday style feel effortless, personal, and entirely
                your own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 sm:text-xs">
              02 / What matters
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl lg:text-5xl">
              What we stand for<span className="text-neutral-400">.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-neutral-500 sm:text-right">
            The principles behind the experience we want to create, from the
            pieces you discover to the service you receive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ number, icon: Icon, title, desc }) => (
            <article
              key={number}
              className="group relative flex min-h-[220px] flex-col border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-400 hover:bg-[#f0f0ec] sm:min-h-[235px] sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center border border-neutral-200 bg-[#f7f7f5] transition-colors duration-300 group-hover:border-neutral-900 group-hover:bg-neutral-900 group-hover:text-white">
                  <Icon size={18} strokeWidth={1.6} />
                </div>

                <span className="font-mono text-[10px] tracking-[0.16em] text-neutral-400">
                  {number}
                </span>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                  {title}
                </h3>

                <ArrowRight
                  size={15}
                  className="shrink-0 text-neutral-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-neutral-900"
                />
              </div>

              <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                {desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden bg-neutral-900 px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/[0.08] sm:-right-10 sm:-top-32 sm:h-96 sm:w-96"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 -top-12 h-48 w-48 rounded-full border border-white/[0.08] sm:h-72 sm:w-72"
          />

          <div className="relative z-10 max-w-3xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45 sm:text-xs">
              03 / The OFFDUTY mindset
            </p>

            <h2 className="mt-6 text-4xl font-medium leading-[1.05] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
              Less noise.
              <br />
              More expression<span className="text-white/35">.</span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/60 sm:mt-8 sm:text-base">
              Find the pieces that feel right, make them your own, and let your
              style speak for itself.
            </p>

            <Link
              to="/shop"
              className="group mt-8 inline-flex items-center gap-5 border border-white/25 px-5 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 hover:border-white hover:bg-white hover:text-neutral-900 sm:mt-10 sm:px-6"
            >
              Explore the collection
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>

          <p className="relative z-10 mt-12 border-t border-white/15 pt-4 text-[9px] uppercase tracking-[0.22em] text-white/35 sm:mt-16 sm:text-[10px]">
            OFFDUTY — Made for your everyday
          </p>
        </div>
      </section>
    </main>
  );
}
