
const navLinks = [
    { label: "Beranda", href: "#beranda", active: true },
    { label: "Fitur", href: "#fitur", active: false },
    { label: "Tentang", href: "#tentang", active: false },
    { label: "FAQ", href: "#faq", active: false },
];

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
    return (
        <header className="relative z-20 mx-auto w-full max-w-7xl px-5 pt-4 sm:px-8 lg:px-12">
            <nav className="flex min-h-[60px] items-center justify-between rounded-full border border-white/80 bg-white/80 px-5 shadow-[0_4px_30px_rgba(15,47,89,0.04)] backdrop-blur-xl sm:px-7">
                {/* Logo */}
                <a
                    href="#beranda"
                    className="flex shrink-0 items-center gap-1.5"
                    aria-label="PantauJalan Beranda"
                >
                    <span className="text-blue-600">
                        <LocationPin />
                    </span>
                    <span className="text-sm font-extrabold tracking-tight text-slate-900">
                        Pantau<span className="text-blue-600">Jalan</span>
                    </span>
                </a>

                {/* Navigation */}
                <div className="hidden items-center gap-7 md:flex lg:gap-9">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={`relative py-2 text-xs font-medium transition-colors ${link.active
                                    ? "text-blue-600 after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-blue-600"
                                    : "text-slate-500 hover:text-blue-600"
                                }`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Pengaturan tampilan"
                        className="hidden h-9 w-9 items-center justify-center rounded-full text-amber-500 transition-colors hover:bg-amber-50 sm:flex"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="4" />
                            <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                        </svg>
                    </button>

                    <a
                        href="#pengaduan"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                        Mulai Sekarang
                        <ArrowRight />
                    </a>
                </div>
            </nav>
        </header>
    );
}
