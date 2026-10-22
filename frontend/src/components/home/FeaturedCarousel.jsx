import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getFeaturedProducts } from "../../services/productService";
import ProductCard from "../shop/ProductCard";
import { useCarousel } from "../../hooks/useCarousel";

const SKELETONS = [1, 2, 3, 4];

function ProductSkeleton() {
  return (
    <div className="min-w-0 animate-pulse">
      <div className="aspect-[3/4] rounded-sm bg-neutral-100" />

      <div className="space-y-3 pt-4">
        <div className="h-3 w-3/4 rounded bg-neutral-100" />
        <div className="h-3 w-1/2 rounded bg-neutral-100" />
        <div className="h-4 w-1/3 rounded bg-neutral-100" />
      </div>
    </div>
  );
}

export default function FeaturedCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { trackRef, canScrollLeft, canScrollRight, scroll } = useCarousel();

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getFeaturedProducts(10);
      setProducts(Array.isArray(result) ? result : []);
    } catch {
      setError("We couldn't load the featured collection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const result = await getFeaturedProducts(10);

        if (active) {
          setProducts(Array.isArray(result) ? result : []);
        }
      } catch {
        if (active) {
          setError("We couldn't load the featured collection.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Section heading — typography matched to reference */}
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-10 lg:mb-12">
          <div>
            <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.28em] text-neutral-500 sm:text-sm">
              Find Your Uniform
            </p>

            <h2 className="text-[24px] font-black uppercase leading-[1.05] tracking-[-0.035em] text-black sm:text-[42px] lg:text-[46px]">
              Featured Pieces
            </h2>
          </div>

          {/* Desktop navigation */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/shop"
              className="group mr-2 hidden items-center gap-2 border-b border-neutral-300 pb-1 text-xs font-bold uppercase tracking-wider text-neutral-950 transition-colors hover:border-black sm:inline-flex"
            >
              View All
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>

            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll featured products left"
              className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:hover:text-black"
            >
              <ChevronLeft size={19} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              aria-label="Scroll featured products right"
              className="flex h-10 w-10 items-center justify-center border border-neutral-200 text-black transition-colors hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-neutral-200 disabled:hover:bg-white disabled:hover:text-black"
            >
              <ChevronRight size={19} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {SKELETONS.map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex min-h-56 flex-col items-center justify-center border border-neutral-200 px-5 text-center">
            <p className="text-sm text-neutral-600">{error}</p>

            <button
              type="button"
              onClick={loadProducts}
              className="mt-5 inline-flex items-center gap-2 bg-black px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-neutral-700"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-sm text-neutral-500">
              New featured pieces are coming soon.
            </p>

            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black underline underline-offset-4"
            >
              Explore the Shop
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Product carousel */}
        {!loading && !error && products.length > 0 && (
          <>
            <div
              ref={trackRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-5 lg:gap-6"
            >
              {products.map((product) => (
                <div
                  key={product.id ?? product._id ?? product.slug}
                  className="w-[calc(50%-6px)] min-w-[calc(50%-6px)] snap-start sm:w-[calc(33.333%-14px)] sm:min-w-[calc(33.333%-14px)] lg:w-[calc(25%-18px)] lg:min-w-[calc(25%-18px)]"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Bottom row */}
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 sm:mt-7">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400 sm:text-xs">
                Made for your everyday rotation
              </p>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black sm:hidden"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
