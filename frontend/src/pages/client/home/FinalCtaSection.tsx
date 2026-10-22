
function RoadIllustration() {
    return (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <svg
                viewBox="0 0 700 300"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                fill="none"
            >
                <defs>
                    <linearGradient id="cta-sky" x1="350" y1="0" x2="350" y2="300">
                        <stop stopColor="#EAF5FF" />
                        <stop offset="1" stopColor="#CBE8FF" />
                    </linearGradient>
                    <linearGradient id="cta-road" x1="350" y1="160" x2="350" y2="300">
                        <stop stopColor="#8298AA" />
                        <stop offset="1" stopColor="#344F68" />
                    </linearGradient>
                </defs>

                <rect width="700" height="300" fill="url(#cta-sky)" />

                {/* Clouds */}
                <g fill="#FFFFFF" opacity=".85">
                    <path d="M390 48c0-9 8-16 17-16 6 0 12 3 15 8 3-5 8-8 14-8 10 0 18 8 18 18h-64Z" />
                    <path d="M525 28c0-7 6-12 13-12 5 0 9 2 11 6 3-4 7-6 12-6 8 0 14 6 14 14h-50Z" />
                    <path d="M605 78c0-6 5-11 11-11 4 0 8 2 10 5 2-3 6-5 10-5 7 0 12 5 12 12h-43Z" />
                </g>

                {/* Distant city */}
                <g fill="#A9D2F2">
                    <path d="M385 173V106h30v67Z" />
                    <path d="M419 173V78h39v95Z" />
                    <path d="M463 173V120h27v53Z" />
                    <path d="M497 173V56h35v117Z" />
                    <path d="M538 173V91h31v82Z" />
                    <path d="M575 173V112h24v61Z" />
                    <path d="M606 173V72h34v101Z" />
                    <path d="M644 173V120h27v53Z" />
                </g>

                {/* Tall building */}
                <path d="M497 56 514 22 532 56Z" fill="#B5D9F5" />
                <path d="M505 56V173h25V56Z" fill="#8EC2ED" />
                <g stroke="#D8EDFF" strokeWidth="2">
                    <path d="M511 68h13M511 82h13M511 96h13M511 110h13M511 124h13M511 138h13M511 152h13" />
                </g>

                {/* Trees */}
                <path
                    d="M0 215c45-20 68-4 103-25 38-24 58-5 90-18 30-13 54-1 82-16 34-18 66-3 96 8v136H0Z"
                    fill="#B4E6C1"
                />
                <path
                    d="M390 196c43-28 73-12 105-31 33-19 58-1 86-18 32-18 79-4 119 10v143H390Z"
                    fill="#80D6A0"
                />

                {/* Rolling green hills */}
                <path
                    d="M0 247c92-52 143-42 212-56 72-14 126 5 185 21 74 20 129-10 303-35v123H0Z"
                    fill="#5EC786"
                />
                <path
                    d="M420 235c65-49 108-34 155-48 44-14 80-6 125 5v113H420Z"
                    fill="#31B66F"
                />

                {/* Curved road */}
                <path
                    d="M250 310c36-66 99-93 175-105 79-12 145-15 180-75 17-28 25-65 29-103h66v276H250Z"
                    fill="#B9C9D5"
                />
                <path
                    d="M273 310c35-60 94-82 155-93 91-17 155-18 191-87 14-27 21-64 24-103h57v273H273Z"
                    fill="url(#cta-road)"
                />

                {/* Road markings */}
                <path
                    d="M365 300c39-49 77-59 130-70 83-17 133-32 158-103 9-26 13-59 16-100"
                    stroke="#F8FBFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="25 19"
                />

                {/* Roadside trees */}
                {[
                    [55, 210],
                    [105, 229],
                    [170, 216],
                    [580, 191],
                    [625, 173],
                    [665, 184],
                ].map(([x, y], i) => (
                    <g key={i}>
                        <path
                            d={`M${x} ${y + 22}v24`}
                            stroke="#8B6A45"
                            strokeWidth="5"
                            strokeLinecap="round"
                        />
                        <circle
                            cx={x}
                            cy={y}
                            r={i % 2 === 0 ? 19 : 15}
                            fill={i % 2 === 0 ? "#32B96D" : "#64D58A"}
                        />
                        <circle
                            cx={x - 5}
                            cy={y - 5}
                            r="6"
                            fill="#A2EDB5"
                            opacity=".8"
                        />
                    </g>
                ))}

                {/* Small navigation marker */}
                <g transform="translate(455 188) rotate(14)">
                    <circle r="18" fill="#2563EB" opacity=".18" />
                    <circle r="11" fill="#2563EB" />
                    <path d="m-4 4 3-9 7-3-3 8-7 4Z" fill="white" />
                </g>
            </svg>
        </div>
    );
}

function ArrowRight() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <path d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
    );
}

export default function FinalCtaSection() {
    return (
        <section className="bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-12">
            <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-blue-50 bg-[#EFF7FF] sm:rounded-[32px]">
                {/* Illustration */}
                <RoadIllustration />

                {/* Gradient for text readability */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F2F8FF] via-[#F2F8FF]/95 to-transparent"
                />

                <div className="relative z-10 max-w-2xl px-6 py-10 sm:px-10 sm:py-14 lg:px-12 lg:py-16">
                    <span className="inline-flex rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-blue-600 backdrop-blur-sm">
                        LANGKAH KECIL, DAMPAK BESAR
                    </span>

                    <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-[1.15] tracking-[-0.045em] text-[#10294e] sm:text-4xl lg:text-[42px]">
                        Laporkan Kerusakan,
                        <br />
                        Bantu Bangun Jalan yang{" "}
                        <span className="text-blue-600">Lebih Baik</span>
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                        Karena jalan yang baik adalah hak setiap orang.
                        Mulai dari satu laporan, kita bisa menciptakan
                        perjalanan yang lebih aman dan nyaman.
                    </p>

                    <a
                        href="/pengaduan"
                        className="mt-7 inline-flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(37,99,235,0.22)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                    >
                        Mulai Sekarang
                        <ArrowRight />
                    </a>
                </div>
            </div>
        </section>
    );
}
