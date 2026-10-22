import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, UserRound } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import MobileNav from "./MobileNav";
import ShopMegaMenu from "./ShopMegaMenu";
import SearchOverlay from "./SearchOverlay";

const announcements = [
  "FREE SHIPPING ON ORDERS ABOVE ₹1,499",
  "DROP 001 — EXPLORE THE COLLECTION",
  "NEW SEASON. SAME ATTITUDE.",
];

export default function Navbar() {
  const { user } = useAuth();
  const { itemCount, setCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);

  const shopMenuRef = useRef(null);

  // Header shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Rotate announcement messages
  useEffect(() => {
    const timer = window.setInterval(() => {
      setAnnouncementIndex((current) => (current + 1) % announcements.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  // Close menus after navigation
  useEffect(() => {
    setShopMenuOpen(false);
    setMobileNavOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  // Close mega menu when clicking outside
  useEffect(() => {
    if (!shopMenuOpen) return;

    const handleOutsideClick = (event) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target)) {
        setShopMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [shopMenuOpen]);

  // Close overlays with Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShopMenuOpen(false);
        setMobileNavOpen(false);
        setSearchOpen(false);
      }

      const target = event.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMenus = () => {
    setShopMenuOpen(false);
    setMobileNavOpen(false);
    setSearchOpen(false);
  };

  const toggleShopMenu = () => {
    setShopMenuOpen((previous) => !previous);
    setMobileNavOpen(false);
    setSearchOpen(false);
  };

  const navLinkClass =
    "relative inline-flex items-center whitespace-nowrap py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-700 transition-colors duration-200 hover:text-black after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full";

  const iconButtonClass =
    "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-900 transition-colors duration-200 hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-[#fafaf8] text-neutral-950 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_5px_25px_rgba(0,0,0,0.07)]" : ""
        }`}
      >
        {/* Announcement bar */}
        <div className="flex h-7 items-center justify-center bg-[#20201e] px-3 text-center text-[9px] font-medium uppercase tracking-[0.16em] text-white sm:text-[10px] sm:tracking-[0.2em]">
          <span key={announcementIndex} aria-live="polite">
            {announcements[announcementIndex]}
          </span>
        </div>

        {/* Main navbar */}
        <div className="relative mx-auto flex h-[66px] max-w-[1600px] items-center justify-between gap-3 border-b border-neutral-200/70 px-3 sm:px-6 lg:h-[76px] lg:px-10">
          {/* Logo and mobile menu button */}
          <div className="flex min-w-0 shrink-0 items-center">
            <button
              type="button"
              onClick={() => {
                setMobileNavOpen(true);
                setShopMenuOpen(false);
              }}
              aria-label="Open navigation menu"
              aria-expanded={mobileNavOpen}
              className={`${iconButtonClass} mr-1 lg:hidden`}
            >
              <Menu size={21} strokeWidth={1.7} />
            </button>

            <Link
              to="/"
              onClick={closeMenus}
              aria-label="OFFDUTY home"
              className="text-[19px] font-black tracking-[0.18em] sm:text-[23px] lg:text-[25px]"
            >
              OFFDUTY<span className="text-neutral-400">®</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden h-full items-center gap-5 lg:flex xl:gap-7 2xl:gap-9"
          >
            {/* SHOP: CLICK ONLY — NEVER NAVIGATES */}
            <button
              type="button"
              onClick={toggleShopMenu}
              aria-expanded={shopMenuOpen}
              aria-haspopup="true"
              className={`${navLinkClass} ${
                shopMenuOpen ? "text-black after:!w-full" : ""
              }`}
            >
              Shop
            </button>

            <Link
              to="/shop?gender=women"
              onClick={closeMenus}
              className={navLinkClass}
            >
              Women
            </Link>

            <Link
              to="/shop?gender=men"
              onClick={closeMenus}
              className={navLinkClass}
            >
              Men
            </Link>

            <Link
              to="/shop?sort=newest"
              onClick={closeMenus}
              className={navLinkClass}
            >
              New arrivals
            </Link>

            <Link to="/shop" onClick={closeMenus} className={navLinkClass}>
              Featured
            </Link>
          </nav>

          {/* Search, wishlist, account and cart */}
          <div className="flex shrink-0 items-center gap-0 sm:gap-1">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setShopMenuOpen(false);
              }}
              aria-label="Open search"
              className={iconButtonClass}
            >
              <Search size={19} strokeWidth={1.7} />
            </button>

            <Link
              to="/wishlist"
              onClick={closeMenus}
              aria-label={`Wishlist, ${wishlistCount} items`}
              className={iconButtonClass}
            >
              <Heart size={19} strokeWidth={1.7} />

              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/account" : "/login"}
              onClick={closeMenus}
              aria-label={user ? "My account" : "Log in"}
              className={`${iconButtonClass} hidden sm:inline-flex`}
            >
              <UserRound size={19} strokeWidth={1.7} />
            </Link>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${itemCount} items`}
              className={iconButtonClass}
            >
              <ShoppingBag size={19} strokeWidth={1.7} />

              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop mega menu — rendered only after clicking Shop */}
          {shopMenuOpen && (
            <div
              ref={shopMenuRef}
              className="absolute left-0 right-0 top-full hidden lg:block"
            >
              <ShopMegaMenu
                open={shopMenuOpen}
                onClose={() => setShopMenuOpen(false)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Mobile navigation */}
      <MobileNav open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
