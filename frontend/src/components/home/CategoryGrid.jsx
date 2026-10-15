import { Link } from "react-router-dom";
import tees from "../../assets/carsouselimg1.jpg";
import hoodies from "../../assets/carsouselimg2.jpg";
import bottoms from "../../assets/carsouselimg3.jpg";
import sets from "../../assets/carsouselimg4.jpg";
const categories = [
  { name: "Oversized Tees", slug: "t-shirts", image: tees },
  { name: "Hoodies & Layers", slug: "sweatshirts", image: hoodies },
  { name: "Cargos & Denim", slug: "trousers", image: bottoms },
  { name: "Complete Looks", slug: "shirts", image: sets },
];
export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.25em] text-neutral-500">
            Find your uniform
          </p>
          <h2 className="mt-2 text-2xl font-black uppercase sm:text-4xl">
            Shop by Category
          </h2>
        </div>
        <Link
          to="/shop"
          className="shrink-0 text-sm underline underline-offset-4"
        >
          Shop all ↗
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        {categories.map((c) => (
          <Link
            key={c.image}
            to={`/shop?category=${c.slug}`}
            className="group relative aspect-[3/4] overflow-hidden bg-neutral-900"
          >
            <img
              src={c.image}
              alt={`${c.name} editorial artwork`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-4 left-4 right-3 text-sm font-black uppercase text-white sm:text-lg">
              {c.name} ↗
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
