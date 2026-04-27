import { useEffect, useRef, useState, type TouchEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { SkeletonText } from "./Skeleton";
import NotificationCenter from "./NotificationCenter";
import { useNotificationContext } from "../context/NotificationContext";
import { WatchlistSidebar } from "./WatchlistSidebar";

const navGroups = [
  {
    label: "Monitor",
    links: [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/bridges", label: "Bridges" },
      { to: "/transactions", label: "Transactions" },
      { to: "/dependencies", label: "Dependencies" },
    ],
  },
  {
    label: "Operations",
    links: [
      { to: "/analytics", label: "Analytics" },
      { to: "/watchlist", label: "Watchlist" },
      { to: "/reports", label: "Reports" },
      { to: "/settings", label: "Settings" },
    ],
  },
];

interface NavbarProps {
  isLoading?: boolean;
}

export default function Navbar({ isLoading = false }: NavbarProps) {
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { unreadCount } = useNotificationContext();
  const navRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const panel = mobilePanelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || !first || !last) {
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileOpen]);

  function isActiveRoute(path: string): boolean {
    return location.pathname === path;
  }

  function handleMobileTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleMobileTouchMove(event: TouchEvent<HTMLDivElement>) {
    const currentX = event.touches[0].clientX;
    if (touchStartX.current - currentX > 70) {
      setIsMobileOpen(false);
    }
  }

  const desktopLinks = navGroups.flatMap((group) => group.links);

  if (isLoading) {
    return (
      <nav className="border-b border-stellar-border bg-stellar-card px-4 py-3" aria-label="Primary loading navigation">
        <div className="flex items-center gap-3">
          <SkeletonText width="110px" height="1rem" variant="title" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonText key={i} width="70px" height="1rem" variant="text" />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-stellar-border bg-stellar-card sticky top-0 z-50" aria-label="Primary" ref={navRef}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-stellar-card focus:px-3 focus:py-2 focus:text-white focus:outline-none focus:ring-2 focus:ring-stellar-blue"
      >
        Skip to content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-stellar-blue focus:ring-offset-2 focus:ring-offset-stellar-card rounded-sm"
              aria-label="Bridge Watch home"
            >
              Bridge <span className="text-stellar-blue">Watch</span>
            </Link>
            <div className="hidden md:flex space-x-4">
              {desktopLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={isActiveRoute(link.to) ? "page" : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(link.to)
                      ? "bg-stellar-blue text-white"
                      : "text-stellar-text-secondary hover:text-white"
                  } focus:outline-none focus:ring-2 focus:ring-stellar-blue focus:ring-offset-2 focus:ring-offset-stellar-card`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-md text-stellar-text-secondary hover:text-white hover:bg-stellar-dark focus:outline-none focus:ring-2 focus:ring-stellar-blue"
              aria-label="Open mobile navigation menu"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-panel"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <button
              onClick={() => setIsWatchlistOpen(true)}
              className="p-2 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-stellar-blue text-stellar-text-secondary hover:text-white"
              aria-label="Open Watchlist"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <WatchlistSidebar isOpen={isWatchlistOpen} onClose={() => setIsWatchlistOpen(false)} />

            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-stellar-blue ${
                  isNotifOpen ? "bg-stellar-dark text-white" : "text-stellar-text-secondary hover:text-white"
                }`}
                aria-label={`${unreadCount} notifications`}
                aria-expanded={isNotifOpen}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 block h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-stellar-card">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              
              <NotificationCenter
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
              />
            </div>

            <div className="hidden sm:block text-sm text-stellar-text-secondary border-l border-stellar-border pl-4">
              Stellar Network Monitor
            </div>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="presentation"
        >
          <button
            ref={firstFocusableRef}
            onClick={() => setIsMobileOpen(false)}
            className="absolute inset-0 h-full w-full bg-black/45"
            aria-label="Close mobile menu overlay"
          />
          <div
            id="mobile-nav-panel"
            ref={mobilePanelRef}
            onTouchStart={handleMobileTouchStart}
            onTouchMove={handleMobileTouchMove}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="absolute right-0 top-0 h-full w-80 max-w-[88vw] overflow-y-auto border-l border-stellar-border bg-stellar-card p-5 shadow-xl transition-transform duration-300"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide text-stellar-text-secondary">
                Navigation
              </p>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="rounded-md p-2 text-stellar-text-secondary hover:bg-stellar-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-stellar-blue"
                aria-label="Close mobile navigation menu"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="space-y-5" aria-label="Mobile primary navigation">
              {navGroups.map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-stellar-text-secondary">{group.label}</p>
                  <div className="space-y-1">
                    {group.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        aria-current={isActiveRoute(link.to) ? "page" : undefined}
                        className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActiveRoute(link.to)
                            ? "bg-stellar-blue text-white"
                            : "text-stellar-text-secondary hover:bg-stellar-dark hover:text-white"
                        } focus:outline-none focus:ring-2 focus:ring-stellar-blue`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-6 space-y-3 border-t border-stellar-border pt-4">
              <div className="rounded-lg bg-stellar-dark p-3">
                <p className="text-xs uppercase tracking-wide text-stellar-text-secondary">Account</p>
                <p className="mt-1 text-sm font-semibold text-white">@operator.dimka</p>
                <p className="text-xs text-stellar-text-secondary">Incident Commander</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsWatchlistOpen(true);
                    setIsMobileOpen(false);
                  }}
                  className="rounded-md border border-stellar-border bg-stellar-dark px-3 py-2 text-sm text-white transition hover:border-stellar-blue focus:outline-none focus:ring-2 focus:ring-stellar-blue"
                >
                  Watchlist
                </button>
                <Link
                  to="/reports"
                  className="rounded-md border border-stellar-border bg-stellar-dark px-3 py-2 text-center text-sm text-white transition hover:border-stellar-blue focus:outline-none focus:ring-2 focus:ring-stellar-blue"
                >
                  Reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
