
import heroImage from "../../../assets/hero-pantaujalan.png";

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

function PlayIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" />
            <path d="m10 8 6 4-6 4V8Z" fill="currentColor" stroke="none" />
        </svg>
    );
}

function CommunityAvatars() {
    const avatars = [
        "photo-1500648767791-00dcc994a43e",
        "photo-1534528741775-53994a69daeb",
        "photo-1506794778202-cad84cf45f1d",
        "photo-1544005313-94ddf0286df2",
    ];

    return (
        <div className="flex -space-x-2.5">
            {avatars.map((avatar, index) => (
                <img
                    key={avatar}
                    src={`https://images.unsplash.com/${avatar}?auto=format&fit=crop&w=80&h=80&q=80`}
                    alt={`Pengguna PantauJalan ${index + 1}`}
                    className="h-9 w-9 rounded-full border-[2.5px] border-white object-cover"
                />
            ))}
        </div>
    );
}

export default function HeroSection() {
    return (
        <section
            id="beranda"
            className="relative isolate overflow-hidden bg-[#f3f9ff]"
        >
            {/* Background decoration */}
            <div className="pointer-events-none absolute -right-20 top-10 -z-10 h-80 w-80 rounded-full bg-blue-200/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-32 bottom-0 -z-10 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />

            <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-8 px-5 pb-12 pt-12 sm:px-8 md:grid-cols-2 md:gap-5 md:py-14 lg:min-h-[680px] lg:px-12">
                {/* Left content */}
                <div className="relative z-10 max-w-xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50/90 px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-cyan-500" />
                        <span className="text-[11px] font-medium tracking-wide text-cyan-800">
                            Bersama Wujudkan Jalan yang Lebih Baik
                        </span>
                    </div>

                    <h1 className="text-[clamp(2.25rem,4.2vw,3.65rem)] font-extrabold leading-[1.1] tracking-[-0.045em] text-[#10294e]">
                        Laporkan Kerusakan Fasilitas Umum,{" "}
                        <span className="text-blue-600">
                            Navigasi dengan Aman
                        </span>
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-[15px]">
                        PantauJalan adalah platform pelaporan kerusakan fasilitas
                        umum yang dilengkapi dengan fitur navigasi. Laporkan
                        kerusakan, lihat status perbaikan, dan temukan rute terbaik
                        di jalan.
                    </p>

                    {/* CTA buttons */}
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <a
                            id="pengaduan"
                            href="/pengaduan"
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-5 py-3.5 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(37,99,235,0.2)] transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                        >
                            Laporkan Kerusakan
                            <ArrowRight />
                        </a>

                        <a
                            href="#cara-kerja"
                            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white/80 px-5 py-3.5 text-xs font-semibold text-slate-700 transition-all hover:border-blue-200 hover:bg-white hover:text-blue-600"
                        >
                            <span className="text-blue-600">
                                <PlayIcon />
                            </span>
                            Lihat Cara Kerja
                        </a>
                    </div>

                    {/* Social proof */}
                    <div className="mt-9 flex items-center gap-3.5">
                        <CommunityAvatars />

                        <div className="text-[11px] leading-5 text-slate-500">
                            <p>Dipercaya oleh lebih dari</p>
                            <p className="font-bold text-slate-800">
                                100.000+ masyarakat
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right visual */}
                <div className="relative mx-auto flex w-full max-w-[570px] items-center justify-center md:ml-auto md:mr-0">
                    <div className="pointer-events-none absolute inset-8 rounded-full bg-blue-200/30 blur-3xl" />

                    <img
                        src={heroImage}
                        alt="Ilustrasi aplikasi PantauJalan dengan peta navigasi dan lokasi kerusakan jalan"
                        className="relative z-10 h-auto w-full object-contain drop-shadow-[0_20px_25px_rgba(29,78,137,0.08)]"
                    />

                    {/* Floating annotation */}
                    <div className="absolute right-0 top-5 z-10 hidden -rotate-6 rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold leading-5 text-slate-600 shadow-sm backdrop-blur-sm lg:block">
                        Jalan rusak?
                        <br />
                        Yuk lapor di PantauJalan!
                    </div>
                </div>
            </div>
        </section>
    );
}
