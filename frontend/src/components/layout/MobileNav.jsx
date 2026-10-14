import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  UserRound,
  Heart,
  ShoppingBag,
} from "lucide-react";

import Drawer from "../common/Drawer";
import { CATEGORIES } from "../../data/categories";

export default function MobileNav({ open, onClose }) {
  const [showCategories, setShowCategories] = useState(false);

  const closeMenu = () => {
    setShowCategories(false);
    onClose();
  };

  const mainLinks = [
    { name: "New Arrivals", path: "/shop?sort=newest", badge: "NEW" },
    { name: "Shop All", path: "/shop" },
  ];

  const infoLinks = [
    { name: "About OFFDUTY", path: "/about" },
    { name: "Contact Us", path: "/contact" },
  ];

  const accountLinks = [
    { name: "My Account", path: "/account", icon: UserRound },
    { name: "Wishlist", path: "/wishlist", icon: Heart },
    { name: "My Orders", path: "/account/orders", icon: ShoppingBag },
  ];

  return (
    <Drawer
      open={open}
      onClose={closeMenu}
      side="left"
      title="OFFDUTY."
      widthClass="max-w-md"
    >
      <div className="offduty-menu bg-[#0b0b0b] text-white min-h-full">
        {/* BRAND INTRO */}

        <div className="px-6 pt-7 pb-8">
          <p className="text-[9px] tracking-[0.4em] text-neutral-500 uppercase">
            Everyday is Offduty.
          </p>
        </div>

        {/* WOMEN / MEN IMAGE CARDS */}

        <div className="px-4 space-y-3">
          <Link
            to="/shop?gender=women"
            onClick={closeMenu}
            className="group relative block h-[155px] overflow-hidden rounded-sm bg-neutral-900"
          >
            <img
              src="/images/menu-women.jpg"
              alt="Shop Women"
              className="absolute inset-0 h-full w-full object-cover
                         transition-transform duration-700
                         group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <span className="font-serif text-[38px] leading-none tracking-wide">
                WOMEN
              </span>

              <span className="mt-4 flex items-center gap-3 text-[9px] tracking-[0.25em]">
                EXPLORE COLLECTION
                <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>

          <Link
            to="/shop?gender=men"
            onClick={closeMenu}
            className="group relative block h-[155px] overflow-hidden rounded-sm bg-neutral-900"
          >
            <img
              src="/images/menu-men.jpg"
              alt="Shop Men"
              className="absolute inset-0 h-full w-full object-cover
                         transition-transform duration-700
                         group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <span className="font-serif text-[38px] leading-none tracking-wide">
                MEN
              </span>

              <span className="mt-4 flex items-center gap-3 text-[9px] tracking-[0.25em]">
                EXPLORE COLLECTION
                <ArrowUpRight size={14} />
              </span>
            </div>
          </Link>
        </div>

        {/* MAIN LINKS */}

        <div className="px-6 pt-9">
          <p className="mb-4 text-[9px] tracking-[0.3em] text-neutral-500">
            01 / DISCOVER
          </p>

          {mainLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={closeMenu}
              className="group flex items-center justify-between
                         border-b border-white/10 py-5"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-[17px] font-light tracking-wide
                                 transition-all duration-300
                                 group-hover:translate-x-1"
                >
                  {item.name}
                </span>

                {item.badge && (
                  <span
                    className="rounded-full bg-white/10 px-2 py-1
                                   text-[8px] tracking-widest text-neutral-300"
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <ArrowRight
                size={17}
                strokeWidth={1}
                className="text-neutral-500 transition-all
                           group-hover:translate-x-1 group-hover:text-white"
              />
            </Link>
          ))}

          {/* CATEGORY ACCORDION */}

          <div className="border-b border-white/10">
            <button
              type="button"
              onClick={() => setShowCategories(!showCategories)}
              aria-expanded={showCategories}
              aria-controls="offduty-mobile-categories"
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="text-[17px] font-light tracking-wide">
                Shop by Category
              </span>

              <ChevronDown
                size={17}
                strokeWidth={1}
                className={`text-neutral-400 transition-transform duration-300
                  ${showCategories ? "rotate-180" : ""}`}
              />
            </button>

            {showCategories && (
              <div
                id="offduty-mobile-categories"
                className="grid grid-cols-2 gap-2 pb-6"
              >
                {CATEGORIES.map((cat, index) => (
                  <Link
                    key={cat.slug}
                    to={`/shop?category=${cat.slug}`}
                    onClick={closeMenu}
                    className="group relative flex min-h-[76px] flex-col
                               justify-between overflow-hidden
                               border border-white/10 bg-[#151515] p-3
                               transition-colors duration-300
                               hover:bg-[#222]"
                  >
                    <span className="text-[9px] text-neutral-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="flex items-end justify-between gap-2">
                      <span className="text-xs font-light tracking-wide">
                        {cat.name}
                      </span>

                      <ArrowUpRight
                        size={13}
                        className="shrink-0 text-neutral-500
                                   group-hover:text-white"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BRAND LINKS */}

        <div className="px-6 pt-9">
          <p className="mb-4 text-[9px] tracking-[0.3em] text-neutral-500">
            02 / THE BRAND
          </p>

          {infoLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={closeMenu}
              className="group flex items-center justify-between
                         border-b border-white/10 py-5"
            >
              <span
                className="text-[17px] font-light tracking-wide
                               transition-transform duration-300
                               group-hover:translate-x-1"
              >
                {item.name}
              </span>

              <ArrowUpRight
                size={17}
                strokeWidth={1}
                className="text-neutral-500 group-hover:text-white"
              />
            </Link>
          ))}
        </div>

        {/* ACCOUNT SECTION */}

        <div className="mt-10 border-y border-white/10 bg-[#111] px-6 py-7">
          <p className="mb-5 text-[9px] tracking-[0.3em] text-neutral-500">
            03 / YOUR SPACE
          </p>

          <div className="flex flex-col gap-1">
            {accountLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className="group flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-4">
                    <Icon
                      size={18}
                      strokeWidth={1}
                      className="text-neutral-400"
                    />

                    <span className="text-[13px] font-light tracking-wide">
                      {item.name}
                    </span>
                  </div>

                  <ArrowRight
                    size={15}
                    strokeWidth={1}
                    className="text-neutral-600 transition-transform
                               group-hover:translate-x-1"
                  />
                </Link>
              );
            })}
          </div>
        </div>

        {/* PREMIUM FOOTER */}

        <div className="relative overflow-hidden px-6 py-10">
          <div
            className="pointer-events-none absolute -bottom-10 -right-5
                          select-none text-[100px] font-black leading-none
                          tracking-tighter text-white/[0.025]"
          >
            OD.
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold tracking-[0.25em]">OFFDUTY.</h3>

            <p className="mt-3 text-[9px] tracking-[0.25em] text-neutral-500">
              BUILT FOR THE EVERYDAY UNIFORM.
            </p>

            <div className="mt-9 flex items-center justify-between">
              <span className="text-[9px] tracking-widest text-neutral-600">
                © {new Date().getFullYear()} OFFDUTY
              </span>

              <span className="text-[9px] tracking-widest text-neutral-600">
                EST. 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
