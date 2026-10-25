import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";

/**
 * TODO: angka di bawah masih data contoh dari versi lama. Ganti dengan
 * data asli sebelum rilis (idealnya diambil dari API).
 */
const stats = [
    { value: 100, suffix: "K+", label: "Laporan masuk" },
    { value: 85, suffix: "%", label: "Terselesaikan" },
    { value: 12, suffix: "", label: "Kota terjangkau" },
    { value: 5, suffix: "x", label: "Lebih cepat" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
    const reduce = useReducedMotion();
    const [n, setN] = useState(reduce ? to : 0);

    useEffect(() => {
        if (!inView || reduce) return;
        const controls = animate(0, to, {
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, reduce, to]);

    return (
        <span ref={ref} className="tabular-nums">
            {n}
            {suffix}
        </span>
    );
}

export default function ImpactSection() {
    return (
        <section id="dampak" className="py-20 sm:py-28">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <Reveal>
                    <h2 className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-5xl">
                        Setiap laporan berarti.
                    </h2>
                </Reveal>

                <dl className="mt-12 grid grid-cols-2 gap-y-10 border-t border-[#dfeae3] pt-10 lg:grid-cols-4">
                    {stats.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.06} y={12}>
                            <div className="lg:border-l lg:border-[#dfeae3] lg:pl-8 lg:first:border-l-0 lg:first:pl-0">
                                <dd className="text-5xl font-semibold tracking-[-0.04em] text-[#0b7a52] sm:text-6xl">
                                    <CountUp to={s.value} suffix={s.suffix} />
                                </dd>
                                <dt className="mt-2 text-sm text-[#4b5d55]">
                                    {s.label}
                                </dt>
                            </div>
                        </Reveal>
                    ))}
                </dl>
            </div>
        </section>
    );
}
