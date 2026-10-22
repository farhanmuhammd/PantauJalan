
import { useState } from "react";

const testimonials = [
    {
        name: "Siti Nurhaliza",
        location: "Medan",
        avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
        quote:
            "Aplikasi ini sangat membantu. Saya bisa melaporkan jalan rusak dengan mudah dan langsung ditindaklanjuti oleh petugas.",
    },
    {
        name: "Rizky Pratama",
        location: "Jakarta",
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
        quote:
            "Fitur navigasinya sangat berguna, terutama saat ada jalan yang rusak. Jadi lebih aman dan nyaman dalam perjalanan.",
    },
    {
        name: "Dewi Anggraini",
        location: "Bandung",
        avatar:
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&h=120&q=80",
        quote:
            "Sekarang kita bisa ikut memantau proses perbaikan. Transparan dan jelas, keren banget!",
    },
    {
        name: "Andi Saputra",
        location: "Surabaya",
        avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&h=120&q=80",
        quote:
            "Proses pelaporannya praktis. Saya bisa menyampaikan kondisi jalan tanpa harus bingung mencari tempat pengaduan.",
    },
    {
        name: "Nadia Putri",
        location: "Yogyakarta",
        avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
        quote:
            "Informasi kondisi jalan membantu saya lebih berhati-hati dan memilih perjalanan yang lebih nyaman setiap hari.",
    },
    {
        name: "Bima Prakoso",
        location: "Semarang",
        avatar:
            "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=120&h=120&q=80",
        quote:
            "Menurut saya, platform seperti ini membuat masyarakat lebih mudah berpartisipasi dalam menjaga fasilitas umum.",
    },
];

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
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
            {direction === "left" ? (
                <path d="m15 18-6-6 6-6" />
            ) : (
                <path d="m9 18 6-6-6-6" />
            )}
        </svg>
    );
}

function QuoteIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7"
            aria-hidden="true"
        >
            <path d="M10 11H5.5C5.8 8.4 7.1 7 9.5 6.2L8.4 4C4.3 5.3 2 8.4 2 13v6h8v-8Zm12 0h-4.5c.3-2.6 1.6-4 4-4.8L20.4 4C16.3 5.3 14 8.4 14 13v6h8v-8Z" />
        </svg>
    );
}

export default function TestimonialsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const visibleTestimonials = Array.from(
        { length: 3 },
        (_, index) =>
            testimonials[(activeIndex + index) % testimonials.length],
    );

    const goToPrevious = () => {
        setActiveIndex(
            (current) =>
                (current - 1 + testimonials.length) % testimonials.length,
        );
    };

    const goToNext = () => {
        setActiveIndex(
            (current) => (current + 1) % testimonials.length,
        );
    };

    return (
        <section
            id="testimoni"
            className="relative isolate overflow-hidden bg-white py-20 sm:py-24 lg:py-20"
        >

            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
                {/* Section heading */}
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div className="max-w-2xl">
                        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-blue-600">
                            APA KATA MEREKA
                        </span>

                        <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#10294e] sm:text-4xl">
                            Dari Masyarakat,{" "}
                            <span className="text-blue-600">
                                Untuk Masyarakat
                            </span>
                        </h2>

                        <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                            Pengalaman pengguna dalam melaporkan kerusakan
                            dan membantu mewujudkan jalan yang lebih baik.
                        </p>
                    </div>

                    <div className="hidden items-center gap-2 sm:flex">
                        <button
                            type="button"
                            onClick={goToPrevious}
                            aria-label="Testimoni sebelumnya"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                        >
                            <ArrowIcon direction="left" />
                        </button>

                        <button
                            type="button"
                            onClick={goToNext}
                            aria-label="Testimoni berikutnya"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                        >
                            <ArrowIcon direction="right" />
                        </button>
                    </div>
                </div>

                {/* Testimonial cards */}
                <div className="relative mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {visibleTestimonials.map((testimonial, index) => (
                        <article
                            key={testimonial.name}
                            className={`flex min-h-[250px] flex-col rounded-[24px] border border-slate-100/90 bg-white/90 p-6 shadow-[0_12px_40px_rgba(30,64,175,0.045)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(30,64,175,0.09)] sm:p-7 ${index === 2 ? "md:hidden xl:flex" : ""
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3.5">
                                    <img
                                        src={testimonial.avatar}
                                        alt=""
                                        loading="lazy"
                                        className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-slate-100"
                                    />

                                    <div>
                                        <h3 className="text-sm font-bold text-[#10294e]">
                                            {testimonial.name}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Pengguna di {testimonial.location}
                                        </p>
                                    </div>
                                </div>

                                <span className="text-blue-100">
                                    <QuoteIcon />
                                </span>
                            </div>

                            <div className="my-5 h-px bg-slate-100" />

                            <blockquote className="text-sm leading-7 text-slate-600">
                                “{testimonial.quote}”
                            </blockquote>

                            <div className="mt-auto flex items-center gap-1 pt-5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                        key={star}
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="h-3.5 w-3.5 text-amber-400"
                                        aria-hidden="true"
                                    >
                                        <path d="m10 1.5 2.6 5.3 5.9.9-4.25 4.15 1 5.85L10 14.9l-5.25 2.8 1-5.85L1.5 7.7l5.9-.9L10 1.5Z" />
                                    </svg>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                {/* Mobile controls */}
                <div className="mt-6 flex items-center justify-center gap-3 sm:hidden">
                    <button
                        type="button"
                        onClick={goToPrevious}
                        aria-label="Testimoni sebelumnya"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
                    >
                        <ArrowIcon direction="left" />
                    </button>
                    <button
                        type="button"
                        onClick={goToNext}
                        aria-label="Testimoni berikutnya"
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600"
                    >
                        <ArrowIcon direction="right" />
                    </button>
                </div>

                {/* Pagination dots */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    {testimonials.map((testimonial, index) => (
                        <button
                            key={testimonial.name}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Lihat testimoni ${index + 1}`}
                            aria-current={
                                activeIndex === index ? "true" : undefined
                            }
                            className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index
                                ? "w-7 bg-blue-600"
                                : "w-2 bg-blue-200 hover:bg-blue-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
