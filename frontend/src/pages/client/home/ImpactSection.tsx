
const statistics = [
    {
        value: "100K+",
        label: "Laporan Masuk",
        icon: "file",
        color: "blue",
    },
    {
        value: "85%",
        label: "Terselesaikan",
        icon: "check",
        color: "green",
    },
    {
        value: "12",
        label: "Kota Terjangkau",
        icon: "chart",
        color: "blue",
    },
    {
        value: "5x",
        label: "Lebih Cepat",
        icon: "zap",
        color: "amber",
    },
];

function StatisticIcon({ type }: { type: string }) {
    const common = {
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: "h-6 w-6",
        "aria-hidden": true as const,
    };

    switch (type) {
        case "file":
            return (
                <svg {...common}>
                    <path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10Z" />
                    <path d="M13 3v7h7M8 14h8M8 18h8" />
                </svg>
            );

        case "check":
            return (
                <svg {...common}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8 12 2.5 2.5L16 9" />
                </svg>
            );

        case "chart":
            return (
                <svg {...common}>
                    <path d="M3 21h18M5 21V11h4v10M10 21V4h4v17M15 21v-8h4v8" />
                </svg>
            );

        default:
            return (
                <svg {...common}>
                    <path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z" />
                </svg>
            );
    }
}

function StatCard({
    value,
    label,
    icon,
    color,
}: (typeof statistics)[number]) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        amber: "bg-amber-50 text-amber-500 ring-amber-100",
    };

    return (
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-1 ${colorStyles[color as keyof typeof colorStyles]}`}
            >
                <StatisticIcon type={icon} />
            </div>

            <div className="min-w-0 pt-0.5">
                <p className="text-2xl font-extrabold tracking-tight text-[#10294e] sm:text-3xl">
                    {value}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm">
                    {label}
                </p>
            </div>
        </div>
    );
}

export default function ImpactSection() {
    return (
        <section
            id="dampak"
            className="relative isolate overflow-hidden bg-white py-20 sm:py-20 lg:py-20"
        >
            <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12">
                {/* Left content */}
                <div className="max-w-xl">
                    <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-blue-600">
                        BERSAMA MEMBAWA PERUBAHAN
                    </span>

                    <h2 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-[-0.045em] text-[#10294e] sm:text-4xl lg:text-[42px]">
                        Bersama, Kita Wujudkan Jalan yang{" "}
                        <span className="text-blue-600">
                            Lebih Baik
                        </span>
                    </h2>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                        Setiap laporan Anda berarti. Mari bersama-sama
                        membangun infrastruktur yang lebih aman dan nyaman
                        untuk semua.
                    </p>

                    <a
                        href="/pengaduan"
                        className="mt-7 inline-flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                        Lihat Laporan Terbaru
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                    </a>
                </div>

                {/* Statistics panel */}
                <div className="relative mx-auto w-full max-w-[580px] lg:ml-auto">
                    <div
                        aria-hidden="true"
                        className="absolute inset-4 rounded-[32px] bg-blue-200/40 blur-3xl"
                    />

                    <div className="relative rounded-[28px] border border-white/90 bg-white/85 p-6 shadow-[0_20px_70px_rgba(37,99,235,0.10)] backdrop-blur-xl sm:p-9">
                        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:gap-x-8 sm:gap-y-10">
                            {statistics.map((stat, index) => (
                                <div
                                    key={stat.label}
                                    className={`min-w-0 ${index % 2 === 1
                                        ? "border-l border-slate-100 pl-5 sm:pl-8"
                                        : ""
                                        } ${index >= 2
                                            ? "border-t border-slate-100 pt-7 sm:pt-8"
                                            : ""
                                        }`}
                                >
                                    <StatCard {...stat} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
