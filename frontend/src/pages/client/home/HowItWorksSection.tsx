
type StepIcon = "camera" | "shield" | "wrench" | "clock";

const steps: {
    number: string;
    title: string;
    description: string;
    icon: StepIcon;
}[] = [
        {
            number: "01",
            title: "Laporkan Kerusakan",
            description:
                "Isi formulir, unggah foto, dan bagikan lokasi kerusakan dengan mudah melalui perangkat Anda.",
            icon: "camera",
        },
        {
            number: "02",
            title: "Verifikasi Petugas",
            description:
                "Laporan Anda diperiksa oleh petugas untuk memastikan informasi akurat dan dapat ditindaklanjuti.",
            icon: "shield",
        },
        {
            number: "03",
            title: "Proses Perbaikan",
            description:
                "Petugas melakukan penanganan dan perbaikan berdasarkan kondisi serta prioritas di lapangan.",
            icon: "wrench",
        },
        {
            number: "04",
            title: "Pantau Perkembangan",
            description:
                "Pantau status laporan dan lihat perkembangan penanganan hingga selesai melalui PantauJalan.",
            icon: "clock",
        },
    ];

function StepIcon({ type }: { type: StepIcon }) {
    const iconClass = "h-6 w-6";

    switch (type) {
        case "camera":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={iconClass}
                    aria-hidden="true"
                >
                    <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11H3V8a1 1 0 0 1 1-1Z" />
                    <circle cx="12" cy="12.5" r="3.5" />
                </svg>
            );

        case "shield":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={iconClass}
                    aria-hidden="true"
                >
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            );

        case "wrench":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={iconClass}
                    aria-hidden="true"
                >
                    <path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3.5 17.5a2.1 2.1 0 0 0 3 3l4.8-4.8a5 5 0 0 0 6.4-6.4L14 13l-3-3 3.7-3.7Z" />
                </svg>
            );

        case "clock":
            return (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={iconClass}
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            );
    }
}

function StepCard({
    number,
    title,
    description,
    icon,
}: (typeof steps)[number]) {
    return (
        <article className="group relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-[0_16px_40px_rgba(37,99,235,0.08)] sm:p-7">
            {/* Icon */}
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100/80 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <StepIcon type={icon} />
            </div>

            {/* Step number */}
            <span className="mb-2 text-xs font-bold tracking-[0.16em] text-blue-600/70">
                LANGKAH {number}
            </span>

            {/* Content */}
            <h3 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500">
                {description}
            </p>

            {/* Bottom accent */}
            <div className="mt-auto pt-6">
                <div className="h-1 w-9 rounded-full bg-blue-100 transition-all duration-300 group-hover:w-16 group-hover:bg-blue-600" />
            </div>
        </article>
    );
}

export default function HowItWorksSection() {
    return (
        <section
            id="cara-kerja"
            className="relative isolate overflow-hidden bg-white py-20 sm:py-24 lg:py-20"
        >
            {/* Subtle background gradient */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-50/60 to-transparent" />

                <div className="absolute left-1/2 top-20 h-72 w-[min(800px,100%)] -translate-x-1/2 rounded-full bg-blue-100/25 blur-3xl" />

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-blue-50/30 to-transparent" />
            </div>

            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                {/* Section heading */}
                <div className="mb-12 flex flex-col gap-5 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-blue-600">
                            MUDAH & EFEKTIF
                        </span>

                        <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.04em] text-[#10294e] sm:text-4xl">
                            Cara Kerja{" "}
                            <span className="text-blue-600">
                                PantauJalan
                            </span>
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                            Laporan Anda akan diproses dan ditindaklanjuti
                            oleh petugas. Pantau setiap perkembangannya
                            dengan mudah dan transparan.
                        </p>
                    </div>

                    <a
                        href="#faq"
                        className="inline-flex w-fit shrink-0 items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800"
                    >
                        Pelajari lebih lanjut
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>

                {/* Steps grid — no connecting arrows */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
                    {steps.map((step) => (
                        <StepCard key={step.number} {...step} />
                    ))}
                </div>
            </div>
        </section>
    );
}
