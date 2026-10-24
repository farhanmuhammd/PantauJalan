import { useNavigate } from "react-router";
import {
    Activity,
    AlertTriangle,
    Clock3,
    LogOut,
    MapPinned,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { getAdminUser, clearAdminSession } from "../utils/auth-storage";

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const user = getAdminUser();

    const handleLogout = () => {
        clearAdminSession();
        navigate("/admin/login", { replace: true });
    };

    const stats = [
        {
            label: "Total laporan",
            value: "—",
            description: "Data belum dihubungkan",
            icon: AlertTriangle,
            color: "bg-amber-50 text-amber-700",
        },
        {
            label: "Laporan diproses",
            value: "—",
            description: "Data belum dihubungkan",
            icon: Clock3,
            color: "bg-blue-50 text-blue-700",
        },
        {
            label: "Titik kerusakan",
            value: "—",
            description: "Data belum dihubungkan",
            icon: MapPinned,
            color: "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Status sistem",
            value: "Admin",
            description: "Sesi administrator aktif",
            icon: Activity,
            color: "bg-violet-50 text-violet-700",
        },
    ];

    return (
        <main className="min-h-screen bg-slate-50">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
                            <ShieldCheck size={24} />
                        </span>
                        <div>
                            <h1 className="font-bold text-slate-900">PantauJalan</h1>
                            <p className="text-xs text-slate-500">Admin Dashboard</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                    >
                        <LogOut size={17} />
                        <span className="hidden sm:inline">Keluar</span>
                    </button>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
                <section className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-teal-800 to-teal-600 p-6 text-white sm:flex-row sm:items-center sm:p-8">
                    <div>
                        <p className="text-sm font-medium text-teal-100">
                            Ringkasan administrasi
                        </p>
                        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                            Halo, {user?.name || "Administrator"}
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50">
                            Selamat datang di dashboard admin PantauJalan.
                            Kelola informasi dan pantau laporan kerusakan jalan dari sini.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-4">
                        <UserRound size={22} />
                        <div>
                            <p className="text-sm font-semibold">{user?.name}</p>
                            <p className="text-xs text-teal-100">{user?.email}</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Ringkasan dashboard
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Statistik akan tersedia setelah API dashboard dihubungkan.
                        </p>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <article
                                    key={stat.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-slate-500">
                                            {stat.label}
                                        </p>
                                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                                            <Icon size={20} />
                                        </span>
                                    </div>
                                    <p className="mt-5 text-2xl font-bold text-slate-900">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-400">
                                        {stat.description}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                    <h3 className="font-bold text-slate-900">Informasi akun</h3>
                    <div className="mt-4 divide-y divide-slate-100">
                        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                            <span className="text-sm text-slate-500">Nama</span>
                            <span className="text-sm font-medium text-slate-800">
                                {user?.name || "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                            <span className="text-sm text-slate-500">Email</span>
                            <span className="text-sm font-medium text-slate-800">
                                {user?.email || "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                            <span className="text-sm text-slate-500">Role</span>
                            <span className="text-sm font-medium text-slate-800">
                                {user?.role || "—"}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
                            <span className="text-sm text-slate-500">Status akun</span>
                            <span className="text-sm font-medium text-emerald-700">
                                {user?.isActive ? "Aktif" : "Tidak aktif"}
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}