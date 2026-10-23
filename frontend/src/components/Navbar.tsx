
import { useLocation, Link } from "react-router";

const navLinks = [
    { label: "Beranda", href: "/", type: "route" },
    { label: "Pengaduan", href: "/pengaduan", type: "route" },
    { label: "Navigasi", href: "/navigasi", type: "route" },
    { label: "FAQ", href: "#faq", type: "anchor" },
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

function ArrowRight() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
    );
}

export default function Navbar() {
    const { pathname, hash } = useLocation();

    const isActive = (href: string, type: "route" | "anchor") => {
        if (type === "route") {
            return pathname === href;
        }

        return hash === href;
    };

    const linkClass = (active: boolean) =>
        `relative py-2 text-xs font-medium transition-colors ${active
            ? "text-blue-600 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-blue-600"
            : "text-slate-500 hover:text-blue-600"
        }`;

    return (
        <header className="relative z-20 mx-auto w-full max-w-7xl px-5 pt-4 sm:px-8 lg:px-12">
            <nav className="flex min-h-[60px] items-center justify-between rounded-full border border-white/80 bg-white/80 px-5 shadow-[0_4px_30px_rgba(15,47,89,0.04)] backdrop-blur-xl sm:px-7">
                <Link
                    to="/"
                    className="flex shrink-0 items-center gap-1.5"
                    aria-label="PantauJalan Beranda"
                >
                    <span className="text-blue-600">
                        <LocationPin />
                    </span>
                    <span className="text-sm font-extrabold tracking-tight text-slate-900">
                        Pantau<span className="text-blue-600">Jalan</span>
                    </span>
                </Link>

                <div className="hidden items-center gap-7 md:flex lg:gap-9">
                    {navLinks.map((link) => {
                        const active = isActive(link.href, link.type);

                        return link.type === "route" ? (
                            <Link
                                key={link.label}
                                to={link.href}
                                aria-current={active ? "page" : undefined}
                                className={linkClass(active)}
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.href}
                                aria-current={active ? "location" : undefined}
                                className={linkClass(active)}
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </div>

                <Link
                    to="/pengaduan"
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                >
                    Mulai Sekarang
                    <ArrowRight />
                </Link>
            </nav>
        </header>
    );
}
