
const features = [
    {
        icon: "navigation",
        title: "Navigasi real-time",
        description: "Ikuti arah perjalanan dengan panduan yang mudah dipahami.",
    },
    {
        icon: "shield",
        title: "Info kerusakan di rute",
        description: "Lihat titik jalan rusak, foto, dan informasi kondisinya.",
    },
    {
        icon: "route",
        title: "Rute alternatif",
        description: "Temukan jalur alternatif untuk perjalanan yang lebih aman.",
    },
];

function FeatureIcon({ type }: { type: string }) {
    const common = {
        className: "h-5 w-5",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        viewBox: "0 0 24 24",
        "aria-hidden": true as const,
    };

    switch (type) {
        case "navigation":
            return (
                <svg {...common}>
                    <path d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z" />
                    <path d="m10 14 5-5" />
                </svg>
            );
        case "shield":
            return (
                <svg {...common}>
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            );
        default:
            return (
                <svg {...common}>
                    <circle cx="6" cy="19" r="2" />
                    <circle cx="18" cy="5" r="2" />
                    <path d="M8 19h2a4 4 0 0 0 4-4V9a4 4 0 0 1 4-4" />
                </svg>
            );
    }
}

function TurnIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-9 w-9 shrink-0"
            aria-hidden="true"
        >
            <path d="M5 21V9a4 4 0 0 1 4-4h10" />
            <path d="m13 1 6 4-6 4" />
        </svg>
    );
}

function NavigationPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[440px] lg:ml-auto">
            {/* Decorative glow */}
            <div
                aria-hidden="true"
                className="absolute inset-8 rounded-full bg-blue-400/20 blur-3xl"
            />

            {/* Turn instruction */}
            <div className="absolute right-0 top-[5%] z-20 flex w-[min(290px,85%)] items-center gap-4 rounded-2xl border border-white/10 bg-[#071d34]/90 p-4 text-white shadow-2xl backdrop-blur-xl sm:right-2 sm:p-5">
                <TurnIcon />
                <div>
                    <p className="text-xl font-bold tracking-tight">200 m</p>
                    <p className="mt-1 text-xs text-slate-300">
                        Belok kanan ke jalan berikutnya
                    </p>
                </div>
            </div>

            {/* Road report card */}
            <div className="absolute right-[10%] top-[34%] z-20 w-[min(245px,75%)] rounded-2xl border border-slate-100 bg-white p-3.5 text-slate-800 shadow-[0_18px_45px_rgba(0,0,0,0.2)] sm:right-[12%] sm:p-4">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M12 3 22 20H2L12 3Z" />
                            <path d="M12 9v4m0 3h.01" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold">
                            Jalan Rusak{" "}
                            <span className="text-red-500">(Berat)</span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                            250 m di depan
                        </p>
                    </div>
                </div>

                <div className="mt-3 h-24 overflow-hidden rounded-xl bg-slate-100 sm:h-28">
                    <img
                        src="/jalan-rusak.jpg"
                        alt="Ilustrasi kondisi jalan"
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Floating navigation button */}
            <div className="absolute bottom-[10%] right-[8%] z-20 flex h-[66px] w-[66px] items-center justify-center rounded-full border-[5px] border-white bg-blue-600 text-white shadow-[0_8px_30px_rgba(37,99,235,0.45)] sm:bottom-[8%] sm:right-[7%] sm:h-[76px] sm:w-[76px]">
                <FeatureIcon type="navigation" />
            </div>

            {/* Decorative route line */}
            <svg
                viewBox="0 0 400 430"
                fill="none"
                className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                aria-hidden="true"
            >
                <path
                    d="M75 95 C65 145 100 170 120 205 S190 225 205 275 S275 320 315 355"
                    stroke="#60a5fa"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity=".35"
                />
                <path
                    d="M75 95 C65 145 100 170 120 205 S190 225 205 275 S275 320 315 355"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="5 9"
                    opacity=".9"
                />
            </svg>

            {/* Background image */}
            <div className="overflow-hidden rounded-[28px]">
                <img
                    src="/indonesia-city-potrait.jpg"
                    alt="Ilustrasi perjalanan dan jalan perkotaan"
                    className="aspect-[4/5] w-full object-cover opacity-70"
                    loading="lazy"
                />
            </div>
        </div>
    );
}

export default function NavigationBannerSection() {
    return (
        <section className="bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-16">
            <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#092b49] shadow-[0_24px_70px_rgba(15,45,75,0.12)] sm:rounded-[36px]">
                {/* Background photo */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-20"
                >
                    <img
                        src="/indonesia-city.jpg"
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Dark overlay */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,30,53,0.97)_0%,rgba(7,39,66,0.91)_44%,rgba(7,39,66,0.52)_100%)]"
                />

                <div className="grid items-center gap-10 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-12 lg:py-14">
                    {/* Left content */}
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-flex rounded-full border border-blue-300/20 bg-blue-400/20 px-3 py-1.5 text-[10px] font-bold tracking-[0.13em] text-blue-200">
                            FITUR NAVIGASI
                        </span>

                        <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-[1.15] tracking-[-0.04em] text-white sm:text-4xl lg:text-[42px]">
                            Temukan Rute Terbaik, Hindari{" "}
                            <span className="text-blue-300">
                                Jalan Rusak
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                            Masukkan lokasi awal dan tujuan, lalu biarkan
                            PantauJalan membantu Anda memahami kondisi
                            perjalanan dan menemukan jalur alternatif.
                        </p>

                        {/* Feature highlights */}
                        <div className="mt-9 grid gap-6 sm:grid-cols-3 sm:gap-5">
                            {features.map((feature) => (
                                <div key={feature.title}>
                                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-500/20 text-blue-300">
                                        <FeatureIcon type={feature.icon} />
                                    </div>

                                    <h3 className="text-sm font-bold text-white">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-xs leading-5 text-slate-300">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <a
                            href="/maps"
                            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#10294e] transition-all hover:-translate-y-0.5 hover:bg-blue-50 sm:mt-9"
                        >
                            Coba Navigasi Sekarang
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>

                    {/* Right visual */}
                    <div className="relative z-10 min-w-0">
                        <NavigationPreview />
                    </div>
                </div>
            </div>
        </section>
    );
}
