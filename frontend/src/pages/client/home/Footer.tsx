
const navigationLinks = [
    { label: "Beranda", href: "#beranda" },
    { label: "Fitur", href: "#fitur" },
    { label: "Tentang", href: "#dampak" },
    { label: "FAQ", href: "#faq" },
];

function LocationIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7"
            aria-hidden="true"
        >
            <path
                d="M12 22s8-7.2 8-13a8 8 0 1 0-16 0c0 5.8 8 13 8 13Z"
                fill="#2563EB"
            />
            <circle cx="12" cy="9" r="3" fill="white" />
        </svg>
    );
}

function SocialIcon({ type }: { type: string }) {
    const common = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: "h-[17px] w-[17px]",
        "aria-hidden": true as const,
    };

    switch (type) {
        case "instagram":
            return (
                <svg {...common}>
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
                </svg>
            );
        case "x":
            return (
                <svg {...common}>
                    <path d="M4 4 20 20M20 4 4 20" />
                </svg>
            );
        default:
            return (
                <svg {...common}>
                    <path
                        d="M21 7.5a2.8 2.8 0 0 0-2-2C17.2 5 12 5 12 5s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2.5 12a29 29 0 0 0 .5 4.5 2.8 2.8 0 0 0 2 2C6.8 19 12 19 12 19s5.2 0 7-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 21.5 12a29 29 0 0 0-.5-4.5Z"
                        fill="currentColor"
                        stroke="none"
                    />
                    <path d="m10 9 5 3-5 3V9Z" fill="white" stroke="none" />
                </svg>
            );
    }
}

function FooterWaves() {
    return (
        <svg
            viewBox="0 0 180 65"
            fill="none"
            className="pointer-events-none absolute bottom-0 right-0 w-28 text-blue-200/70 sm:w-36"
            aria-hidden="true"
        >
            <path
                d="M0 58C35 58 35 34 70 34S105 10 140 10s30-8 40-10"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M0 64C35 64 35 40 70 40S105 16 140 16s30-8 40-10"
                stroke="currentColor"
                strokeWidth="2"
            />
            <path
                d="M0 52C35 52 35 28 70 28S105 4 140 4s30-8 40-10"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity=".6"
            />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-white">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                <div className="border-t border-slate-100" />

                {/* Main footer row */}
                <div className="grid grid-cols-1 items-center gap-6 py-8 sm:grid-cols-[1fr_auto_1fr] sm:gap-5">
                    {/* Brand */}
                    <a
                        href="#beranda"
                        className="flex w-fit items-center gap-2.5"
                        aria-label="PantauJalan - kembali ke beranda"
                    >
                        <LocationIcon />
                        <span className="text-base font-extrabold tracking-tight text-[#10294e]">
                            Pantau<span className="text-blue-600">Jalan</span>
                        </span>
                    </a>

                    {/* Navigation */}
                    <nav
                        aria-label="Navigasi footer"
                        className="flex flex-wrap items-center gap-x-5 gap-y-3 sm:justify-center sm:gap-x-7"
                    >
                        {navigationLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-600"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Social media */}
                    <div className="flex items-center gap-3 sm:justify-self-end">
                        {[
                            {
                                type: "instagram",
                                label: "Instagram",
                                href: "https://instagram.com/",
                            },
                            {
                                type: "x",
                                label: "X",
                                href: "https://x.com/",
                            },
                            {
                                type: "youtube",
                                label: "YouTube",
                                href: "https://youtube.com/",
                            },
                        ].map((social) => (
                            <a
                                key={social.type}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={social.label}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-600"
                            >
                                <SocialIcon type={social.type} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Copyright */}
                <div className="relative border-t border-slate-50 py-5 text-center">
                    <p className="text-[11px] leading-5 text-slate-400">
                        © {new Date().getFullYear()} PantauJalan. Bersama
                        untuk infrastruktur yang lebih baik.
                    </p>
                </div>
            </div>

            <FooterWaves />
        </footer>
    );
}
