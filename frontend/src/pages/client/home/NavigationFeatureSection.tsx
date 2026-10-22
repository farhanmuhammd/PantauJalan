
const features = [
    "Peta interaktif berbasis Leaflet & OpenStreetMap",
    "Tampilkan titik kerusakan yang sudah diverifikasi",
    "Cari rute alternatif untuk menghindari jalan rusak",
    "Informasi detail kerusakan dan status perbaikan",
];

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 shrink-0"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10" fill="#22C55E" />
            <path
                d="m7.5 12 3 3 6-6"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function MapPin({
    color = "#2563EB",
    alert = false,
}: {
    color?: string;
    alert?: boolean;
}) {
    return (
        <div
            className="relative flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-white shadow-lg"
            style={{ backgroundColor: color }}
        >
            {alert ? (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    className="h-4 w-4"
                    aria-hidden="true"
                >
                    <path d="M12 7v6m0 4h.01" strokeLinecap="round" />
                </svg>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    className="h-4 w-4"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="4" />
                </svg>
            )}
            <span
                className="absolute -bottom-1 h-2 w-2 rotate-45 rounded-[2px]"
                style={{ backgroundColor: color }}
            />
        </div>
    );
}

function NavigationMap() {
    return (
        <div className="relative aspect-[1.05/1] w-full overflow-hidden rounded-[28px] border border-blue-100/80 bg-[#edf4e9] shadow-[0_24px_70px_rgba(30,64,175,0.10)] sm:aspect-[1.25/1] lg:aspect-[1.08/1]">
            {/* Map background */}
            <svg
                viewBox="0 0 600 540"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                <defs>
                    <pattern
                        id="map-grid"
                        width="48"
                        height="48"
                        patternUnits="userSpaceOnUse"
                    >
                        <path
                            d="M48 0H0V48"
                            fill="none"
                            stroke="#d7e2d7"
                            strokeWidth="1"
                        />
                    </pattern>
                </defs>

                <rect width="600" height="540" fill="#f3f6ed" />
                <rect width="600" height="540" fill="url(#map-grid)" />

                {/* Parks and green spaces */}
                <path
                    d="M0 40 120 0 180 65 155 150 70 172 0 130Z"
                    fill="#d9efcf"
                />
                <path
                    d="M405 0H600V150L530 180 455 120Z"
                    fill="#dcefd1"
                />
                <path
                    d="M0 365 95 320 160 390 120 540H0Z"
                    fill="#dcefd1"
                />
                <path
                    d="M420 355 510 320 600 370V540H455Z"
                    fill="#d9edce"
                />

                {/* Waterway */}
                <path
                    d="M-20 190C80 150 120 240 210 205S355 125 430 185 520 260 630 205"
                    fill="none"
                    stroke="#c7e8f6"
                    strokeWidth="28"
                />
                <path
                    d="M-20 190C80 150 120 240 210 205S355 125 430 185 520 260 630 205"
                    fill="none"
                    stroke="#e7f5fb"
                    strokeWidth="20"
                />

                {/* Minor roads */}
                <g
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="12"
                    strokeLinecap="round"
                >
                    <path d="M70 -20 125 130 105 245 185 355 165 560" />
                    <path d="M220 -20 245 95 220 180 290 290 275 560" />
                    <path d="M390 -20 355 100 395 225 365 340 410 560" />
                    <path d="M520 -20 475 115 510 250 485 370 545 560" />
                    <path d="M-20 95 150 120 300 90 450 120 620 90" />
                    <path d="M-20 290 140 270 270 315 420 285 620 320" />
                    <path d="M-20 450 130 420 300 455 460 420 620 455" />
                </g>

                {/* Road edges */}
                <g
                    fill="none"
                    stroke="#e0e6dc"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                >
                    <path d="M70 -20 125 130 105 245 185 355 165 560" />
                    <path d="M220 -20 245 95 220 180 290 290 275 560" />
                    <path d="M390 -20 355 100 395 225 365 340 410 560" />
                    <path d="M520 -20 475 115 510 250 485 370 545 560" />
                    <path d="M-20 95 150 120 300 90 450 120 620 90" />
                    <path d="M-20 290 140 270 270 315 420 285 620 320" />
                    <path d="M-20 450 130 420 300 455 460 420 620 455" />
                </g>

                {/* Main roads */}
                <g
                    fill="none"
                    stroke="#e6d8b8"
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M-20 340 125 305 240 350 365 300 620 350" />
                    <path d="M320 -20 300 110 330 220 300 335 330 560" />
                </g>
                <g
                    fill="none"
                    stroke="#fffdf5"
                    strokeWidth="15"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M-20 340 125 305 240 350 365 300 620 350" />
                    <path d="M320 -20 300 110 330 220 300 335 330 560" />
                </g>

                {/* Route shadow */}
                <path
                    d="M112 145 112 205 160 242 240 250 285 315 380 315 415 385 475 425"
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="11"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Main navigation route */}
                <path
                    d="M112 145 112 205 160 242 240 250 285 315 380 315 415 385 475 425"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Alternative route */}
                <path
                    d="M240 250 230 205 295 175 365 180"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="4"
                    strokeDasharray="7 7"
                    strokeLinecap="round"
                />

                {/* Route checkpoints */}
                {[
                    [160, 242],
                    [285, 315],
                    [380, 315],
                ].map(([cx, cy]) => (
                    <circle
                        key={`${cx}-${cy}`}
                        cx={cx}
                        cy={cy}
                        r="5"
                        fill="#ffffff"
                        stroke="#2563eb"
                        strokeWidth="3"
                    />
                ))}
            </svg>

            {/* Start marker */}
            <div className="absolute left-[13%] top-[19%]">
                <MapPin />
            </div>

            {/* Damage markers */}
            <div className="absolute left-[38%] top-[41%]">
                <MapPin color="#ef4444" alert />
            </div>
            <div className="absolute left-[62%] top-[31%]">
                <MapPin color="#ef4444" alert />
            </div>

            {/* Destination */}
            <div className="absolute bottom-[17%] right-[17%]">
                <MapPin color="#10b981" />
            </div>

            {/* Floating damage report card */}
            <div className="absolute right-3 top-3 flex max-w-[235px] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[0_10px_35px_rgba(15,23,42,0.12)] backdrop-blur-md sm:right-5 sm:top-5 sm:gap-3.5 sm:p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                        aria-hidden="true"
                    >
                        <path d="M12 3 22 20H2L12 3Z" />
                        <path d="M12 9v4m0 3h.01" strokeLinecap="round" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-900 sm:text-xs">
                        Jalan rusak{" "}
                        <span className="text-red-500">(Berat)</span>
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500 sm:text-[11px]">
                        Jl. Sudirman, Medan
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-blue-600 px-3 py-1 text-[10px] font-semibold text-white">
                        Terverifikasi
                    </span>
                </div>
            </div>

            {/* Route summary card */}
            <div className="absolute bottom-4 right-3 w-[190px] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_12px_35px_rgba(15,23,42,0.12)] backdrop-blur-md sm:bottom-5 sm:right-5 sm:w-[220px]">
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M4 19V5l6-2 4 2 6-2v14l-6 2-4-2-6 2Z" />
                            <path d="m10 3 0 14m4-12v14" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-800">
                            Rute alternatif
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                            12 km · 25 menit
                        </p>
                    </div>
                </div>

                <div className="my-3 h-px bg-slate-100" />

                <div className="space-y-3 text-[10px] font-medium text-slate-600 sm:text-[11px]">
                    <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Jalan utama
                        </span>
                        <span className="text-emerald-500">✓</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Rute alternatif
                        </span>
                        <span className="text-emerald-500">✓</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Jalan rusak
                        </span>
                        <span className="text-red-500">!</span>
                    </div>
                </div>
            </div>

            {/* Floating route notice */}
            <div className="absolute bottom-[20%] left-3 flex max-w-[180px] items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-2.5 shadow-lg backdrop-blur-md sm:bottom-[17%] sm:left-5 sm:max-w-[200px] sm:gap-3 sm:px-4 sm:py-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                        aria-hidden="true"
                    >
                        <path d="M12 3 4 21l8-5 8 5-8-18Z" />
                    </svg>
                </div>
                <p className="text-[10px] font-medium leading-4 text-slate-600 sm:text-[11px]">
                    Jalan rusak di depan, rute alternatif tersedia.
                </p>
            </div>

            {/* Map label */}
            <div className="absolute bottom-4 left-4 rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-[9px] font-medium text-slate-500 backdrop-blur-md sm:bottom-5 sm:left-5">
                Ilustrasi peta navigasi
            </div>
        </div>
    );
}

export default function NavigationFeatureSection() {
    return (
        <section
            id="fitur"
            className="relative isolate overflow-hidden bg-white py-20 sm:py-24 lg:py-10"
        >
            {/* Soft background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
            >
                <div className="absolute inset-0 bg-[linear-gradient(115deg,#f8fbff_0%,#ffffff_48%,#f1f7ff_100%)]" />
                <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-blue-100/35 blur-3xl" />
                <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-sky-100/30 blur-3xl" />
            </div>

            <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12">
                {/* Left content */}
                <div className="max-w-xl">
                    <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold tracking-[0.12em] text-blue-600">
                        FITUR UNGGULAN
                    </span>

                    <h2 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-[-0.045em] text-[#10294e] sm:text-4xl lg:text-[42px]">
                        Navigasi Pintar untuk Perjalanan{" "}
                        <span className="text-blue-600">
                            Lebih Aman
                        </span>
                    </h2>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                        PantauJalan tidak hanya membantu melaporkan
                        kerusakan, tetapi juga menemukan rute perjalanan
                        yang lebih aman. Ketika ada jalan rusak, Anda dapat
                        mempertimbangkan jalur alternatif.
                    </p>

                    {/* Feature list */}
                    <ul className="mt-7 space-y-4">
                        {features.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                            >
                                <span className="mt-0.5">
                                    <CheckIcon />
                                </span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <a
                        href="/maps"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                        Jelajahi Fitur Navigasi
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

                {/* Custom map illustration */}
                <div className="relative mx-auto w-full max-w-[650px] lg:ml-auto">
                    <div
                        aria-hidden="true"
                        className="absolute inset-8 rounded-full bg-blue-200/40 blur-3xl"
                    />
                    <NavigationMap />
                </div>
            </div>
        </section>
    );
}


