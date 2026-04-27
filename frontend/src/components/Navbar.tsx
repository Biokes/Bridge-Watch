import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { desktopNavItems, isNavItemActive } from "./MobileNav/navigation";
import HamburgerButton from "./MobileNav/HamburgerButton";
import MobileMenu from "./MobileNav/MobileMenu";
import GlobalSearch from "./search/GlobalSearch";

export default function Navbar() {
  const { pathname } = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  return (
    <>
      <nav className="border-b border-stellar-border bg-stellar-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand + desktop nav links */}
            <div className="flex items-center gap-6">
              <Link to="/" className="text-xl font-bold text-white">
                Bridge Watch
              </Link>

              <div className="hidden md:flex gap-1">
                {desktopNavItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    aria-current={isNavItemActive(pathname, item.to) ? "page" : undefined}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isNavItemActive(pathname, item.to)
                        ? "bg-stellar-blue text-white"
                        : "text-stellar-text-secondary hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right-side actions: search autocomplete trigger + mobile menu toggle */}
            <div className="flex items-center gap-3">
              <GlobalSearch />
              <HamburgerButton
                open={isMobileOpen}
                onClick={isMobileOpen ? closeMobile : openMobile}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Off-canvas mobile navigation panel */}
      <MobileMenu
        open={isMobileOpen}
        pathname={pathname}
        onClose={closeMobile}
      />
    </>
  );
}
