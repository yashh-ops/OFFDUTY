import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { getFeaturedProducts } from "../../services/productService";
import ProductCard from "../shop/ProductCard";
import { useCarousel } from "../../hooks/useCarousel";

export default function FeaturedCarousel({ title = "Featured Products" }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const { trackRef, canScrollLeft, canScrollRight, scroll } = useCarousel();

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getFeaturedProducts(10);

        if (active) {
          setProducts(Array.isArray(res) ? res : []);
        }
      } catch (err) {
        if (active) {
          setError("Unable to load featured products.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [retry]);

  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <section className="w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        {/* SECTION HEADER */}

        <div className="mb-9 flex items-end justify-between gap-4 border-b border-neutral-200 pb-6 sm:mb-12">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />

              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
                The OFFDUTY Edit
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.055em] text-black sm:text-4xl lg:text-5xl">
              {title}
              <span className="text-neutral-300">.</span>
            </h2>

            <p className="max-w-md text-xs leading-relaxed text-neutral-500 sm:text-sm">
              Everyday essentials. Anything but ordinary.
            </p>
          </div>

          {/* DESKTOP NAVIGATION */}

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={loading || !canScrollLeft}
              aria-label="Scroll products left"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 transition-all duration-300 hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              <ChevronLeft
                size={19}
                strokeWidth={1.5}
                className="transition-transform group-hover:-translate-x-0.5"
              />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={loading || !canScrollRight}
              aria-label="Scroll products right"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 transition-all duration-300 hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:bg-transparent disabled:hover:text-black"
            >
              <ChevronRight
                size={19}
                strokeWidth={1.5}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        {/* ERROR STATE */}

        {error ? (
          <div
            role="alert"
            className="flex min-h-48 flex-col items-center justify-center gap-4 bg-neutral-50 p-6 text-center"
          >
            <p className="text-sm text-neutral-500">{error}</p>

            <button
              type="button"
              onClick={() => setRetry((prev) => prev + 1)}
              className="border-b border-black pb-1 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-50"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          /* SKELETON LOADING */

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={
                  index === 3
                    ? "hidden lg:block"
                    : index === 2
                      ? "hidden sm:block"
                      : ""
                }
              >
                <div className="aspect-[3/4] animate-pulse bg-neutral-100" />

                <div className="mt-4 space-y-2">
                  <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />

                  <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* PRODUCT CAROUSEL */

          <div
            ref={trackRef}
            aria-label="Featured products"
            tabIndex={0}
            className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black motion-reduce:scroll-auto sm:gap-5"
          >
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="w-[calc((100%-12px)/2)] flex-none snap-start sm:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* BOTTOM SECTION */}

        {!loading && !error && products.length > 0 && (
          <div className="mt-10 flex flex-col items-center gap-5 sm:mt-12">
            <Link
              to="/shop"
              className="group inline-flex items-center justify-center gap-8 border border-black bg-black px-7 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Explore Collection
              <ArrowUpRight
                size={17}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>

            <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 sm:hidden">
              Swipe to explore
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
