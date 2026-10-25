import { m, useReducedMotion } from "framer-motion";
import { NavScreen } from "./AppScreens";
import PhoneFrame from "./PhoneFrame";
import Reveal from "./Reveal";

const highlights = [
    {
        title: "Navigasi real-time",
        text: "Ikuti arah perjalanan dengan panduan yang mudah dipahami.",
    },
    {
        title: "Info kerusakan di rute",
        text: "Lihat titik jalan rusak, foto, dan informasi kondisinya sebelum kamu melewatinya.",
    },
    {
        title: "Rute alternatif",
        text: "Temukan jalur lain untuk perjalanan yang lebih aman dan nyaman.",
    },
];

const features = [
    "Peta interaktif berbasis Leaflet & OpenStreetMap",
    "Titik kerusakan yang sudah diverifikasi tampil di peta",
    "Rute alternatif untuk menghindari jalan rusak",
    "Detail kerusakan dan status perbaikannya",
];

function MapMock() {
    const reduce = useReducedMotion();

    return (
        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl bg-[#effaf4] ring-1 ring-[#dceee2]">
            <svg
                viewBox="0 0 400 320"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
            >
                {/* Jalan utama pada peta */}
                <g
                    stroke="#c5dfcd"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                >
                    <path d="M-10 90 L410 60" />
                    <path d="M-10 190 L410 220" />
                    <path d="M90 -10 L120 330" />
                    <path d="M260 -10 L240 330" />
                    <path d="M-10 280 L410 270" />
                </g>

                {/* Detail jalan */}
                <g
                    stroke="#dceee2"
                    strokeWidth="1.5"
                    fill="none"
                >
                    <path d="M-10 140 L410 130" />
                    <path d="M180 -10 L190 330" />
                    <path d="M330 -10 L320 330" />
                </g>

                {/* Rute alternatif */}
                <path
                    d="M40 270 C 100 270, 150 245, 190 230 S 300 190, 330 100 S 350 60, 365 50"
                    stroke="#79cda2"
                    strokeOpacity="0.9"
                    strokeWidth="3"
                    strokeDasharray="4 7"
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Rute utama */}
                <m.path
                    d="M40 270 C 90 240, 110 190, 170 170 S 280 120, 365 50"
                    stroke="#25bd7b"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                    initial={reduce ? false : { pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{
                        duration: 1.6,
                        ease: "easeInOut",
                    }}
                />

                {/* Titik awal */}
                <circle
                    cx="40"
                    cy="270"
                    r="9"
                    fill="#ffffff"
                    stroke="#25bd7b"
                    strokeWidth="3"
                />

                {/* Titik tujuan */}
                <circle
                    cx="365"
                    cy="50"
                    r="15"
                    fill="#25bd7b"
                    fillOpacity="0.15"
                />
                <circle
                    cx="365"
                    cy="50"
                    r="7"
                    fill="#25bd7b"
                    stroke="#ffffff"
                    strokeWidth="2"
                />

                {/* Titik jalan rusak */}
                <circle
                    cx="170"
                    cy="170"
                    r="17"
                    fill="#ff6b57"
                    fillOpacity="0.18"
                />
                <circle
                    cx="170"
                    cy="170"
                    r="7"
                    fill="#ff6b57"
                    stroke="#ffffff"
                    strokeWidth="2"
                />
            </svg>

            {/* Informasi jalan rusak */}
            <m.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                    delay: 0.9,
                    duration: 0.5,
                }}
                className="absolute left-[30%] top-[58%] w-[min(200px,65%)] rounded-2xl border border-[#e5eee7] bg-white/95 p-3.5 text-[#163b2b] shadow-lg backdrop-blur-sm"
            >
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#ff6b57]" />
                    <p className="text-xs font-semibold">
                        Jalan rusak{" "}
                        <span className="text-[#e5483a]">
                            · Berat
                        </span>
                    </p>
                </div>

                <p className="mt-2 text-[11px] leading-4 text-[#617368]">
                    250 m di depan · Terverifikasi
                </p>
            </m.div>

            {/* Ringkasan rute */}
            <div className="absolute left-4 top-4 rounded-2xl border border-[#dceee2] bg-white/95 px-4 py-3 text-[#163b2b] shadow-sm backdrop-blur-sm">
                <p className="text-[11px] text-[#617368]">
                    Rute alternatif
                </p>
                <p className="mt-0.5 text-sm font-semibold">
                    12 km · 25 menit
                </p>
            </div>

            {/* Legenda */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-x-4 gap-y-2 rounded-xl border border-[#dceee2] bg-white/90 px-3 py-2 text-[11px] text-[#52665a] shadow-sm backdrop-blur-sm">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#25bd7b]" />
                    Rute utama
                </span>

                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ff6b57]" />
                    Jalan rusak
                </span>
            </div>
        </div>
    );
}

export default function NavigationFeatureSection() {
    return (
        <section
            id="fitur"
            className="px-4 py-12 sm:px-6 sm:py-20"
        >
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] border border-[#e5eee7] bg-white p-6 text-[#163b2b] shadow-sm sm:rounded-[36px] sm:p-12 lg:p-16">
                {/* Penjelasan */}
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
                    <Reveal>
                        <p className="text-sm font-medium text-[#21875a]">
                            Fitur navigasi
                        </p>

                        <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-[#163b2b] sm:text-5xl">
                            Temukan rute terbaik, hindari jalan rusak.
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-7 text-[#52665a]">
                            Masukkan lokasi awal dan tujuan, lalu biarkan
                            PantauJalan membantu kamu memahami kondisi
                            perjalanan dan menemukan jalur alternatif.
                            Navigasi ini tidak hanya mengarahkan, tetapi juga
                            memberi tahu jalan mana yang rusak sebelum kamu
                            melewatinya.
                        </p>
                    </Reveal>

                    <Reveal delay={0.08}>
                        <ul className="space-y-4 lg:pt-8">
                            {features.map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3 text-sm leading-6 text-[#40564a]"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e5f8ed] text-[#21875a]"
                                    >
                                        <svg
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            className="h-3 w-3"
                                        >
                                            <path
                                                d="m5 10 3 3 7-7"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </span>

                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                {/* Tiga poin utama */}
                <dl className="mt-12 grid gap-3 sm:grid-cols-3">
                    {highlights.map((h, i) => (
                        <div
                            key={h.title}
                            className="group rounded-2xl border border-[#dceee2] bg-[#f5fbf7] p-6 transition-colors duration-300 hover:bg-[#edf8f1]"
                        >
                            <dt className="flex items-baseline gap-3">
                                <span className="text-xs font-semibold tabular-nums text-[#21875a]">
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                <span className="text-base font-semibold text-[#163b2b]">
                                    {h.title}
                                </span>
                            </dt>

                            <dd className="mt-3 text-sm leading-6 text-[#617368]">
                                {h.text}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/* Visual peta dan layar ponsel */}
                <div className="relative mt-12 grid items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
                    <Reveal y={20}>
                        <MapMock />
                    </Reveal>

                    <Reveal
                        y={24}
                        delay={0.1}
                        className="flex justify-center"
                    >
                        <PhoneFrame className="ring-1 ring-[#dceee2]">
                            <NavScreen />
                        </PhoneFrame>
                    </Reveal>
                </div>

                {/* CTA */}
                <a
                    href="/maps"
                    className="mt-12 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25bd7b] focus-visible:ring-offset-4"
                >
                    Coba navigasi sekarang

                    <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                        →
                    </span>
                </a>
            </div>
        </section>
    );
}