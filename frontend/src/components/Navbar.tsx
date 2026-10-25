import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
    { labelKey: "nav.home", defaultLabel: "Beranda", href: "/", type: "route" },
    { labelKey: "nav.reports", defaultLabel: "Pengaduan", href: "/pengaduan", type: "route" },
    { labelKey: "nav.navigation", defaultLabel: "Navigasi", href: "/navigasi", type: "route" },
    { labelKey: "nav.faq", defaultLabel: "FAQ", href: "#faq", type: "anchor" },
] as const;

function LocationPin() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
        >
            <path d="M12 2a8 8 0 0 0-8 8c0 5.5 8 12 8 12s8-6.5 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
        </svg>
    );
}

function MenuIcon({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
            aria-hidden="true"
        >
            {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
            ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
            )}
        </svg>
    );
}

export default function Navbar() {
    const { t } = useTranslation();
    const { pathname, hash } = useLocation();
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Tutup menu saat pindah halaman / anchor
    useEffect(() => {
        setOpen(false);
    }, [pathname, hash]);

    // Bayangan lebih tegas setelah di-scroll
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Tutup dengan tombol Escape
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const isActive = (href: string, type: "route" | "anchor") =>
        type === "route" ? pathname === href : hash === href;

    const desktopLink = (active: boolean) =>
        `relative py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 rounded ${active
            ? "text-emerald-700 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-emerald-600"
            : "text-slate-600 hover:text-emerald-700"
        }`;

    const mobileLink = (active: boolean) =>
        `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${active
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-700"
        }`;

    return (
        <header className="sticky top-0 z-50 h-0 mx-auto w-full max-w-7xl px-5  sm:px-8 lg:px-12">
            <nav
                aria-label="Navigasi utama"
                className={`relative top-4 border border-emerald-100/80 bg-white/85 px-5 backdrop-blur-xl transition-shadow duration-300 sm:px-7 ${open ? "rounded-3xl" : "rounded-full"
                    } ${scrolled || open
                        ? "shadow-[0_10px_40px_-12px_rgba(5,150,105,0.25)]"
                        : "shadow-[0_4px_30px_rgba(5,150,105,0.06)]"
                    }`}
            >
                <div className="flex min-h-[60px] items-center justify-between">
                    <Link
                        to="/"
                        className="flex shrink-0 items-center gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                        aria-label="PantauJalan Beranda"
                    >
                        <span className="text-emerald-600">
                            <LocationPin />
                        </span>
                        <span className="text-base font-extrabold tracking-tight text-slate-900">
                            Pantau<span className="text-emerald-600">Jalan</span>
                        </span>
                    </Link>

                    {/* Desktop */}
                    <div className="hidden items-center gap-6 md:flex lg:gap-8">
                        {navLinks.map((link) => {
                            const active = isActive(link.href, link.type);
                            const label = t(link.labelKey, link.defaultLabel);
                            return link.type === "route" ? (
                                <Link
                                    key={link.href}
                                    to={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={desktopLink(active)}
                                >
                                    {label}
                                </Link>
                            ) : (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    aria-current={active ? "location" : undefined}
                                    className={desktopLink(active)}
                                >
                                    {label}
                                </a>
                            );
                        })}

                        <LanguageSwitcher />
                    </div>

                    {/* Tombol menu mobile */}
                    <div className="flex items-center gap-2 md:hidden">
                        <LanguageSwitcher variant="subtle" />
                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-controls="mobile-menu"
                            aria-label={open ? t("common.close", "Tutup menu") : "Buka menu"}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
                        >
                            <MenuIcon open={open} />
                        </button>
                    </div>
                </div>

                {/* Menu mobile: animasi tinggi dengan grid rows */}
                <div
                    id="mobile-menu"
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:hidden ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                >
                    <div className="overflow-hidden">
                        <ul
                            className={`flex flex-col gap-1 border-t border-emerald-100 pb-4 pt-3 ${open ? "" : "invisible"
                                }`}
                        >
                            {navLinks.map((link) => {
                                const active = isActive(link.href, link.type);
                                const label = t(link.labelKey, link.defaultLabel);
                                return (
                                    <li key={link.href}>
                                        {link.type === "route" ? (
                                            <Link
                                                to={link.href}
                                                aria-current={active ? "page" : undefined}
                                                className={mobileLink(active)}
                                            >
                                                {label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                onClick={() => setOpen(false)}
                                                aria-current={active ? "location" : undefined}
                                                className={mobileLink(active)}
                                            >
                                                {label}
                                            </a>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}