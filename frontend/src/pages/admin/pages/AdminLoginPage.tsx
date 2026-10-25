import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, LoaderCircle, ShieldCheck } from "lucide-react";
import LanguageSwitcher from "../../../components/LanguageSwitcher";
import { loginAdmin } from "../api/auth.api";
import { saveAdminSession, getAdminToken } from "../utils/auth-storage";
import { getApiErrorMessage } from "../../../utils/api-error";

export default function AdminLoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (getAdminToken()) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await loginAdmin({ email, password });

            if (!response.success || !response.data?.token || !response.data?.user) {
                throw new Error(response.message || "Login gagal.");
            }

            if (
                response.data.user.role !== "admin" ||
                !response.data.user.isActive
            ) {
                navigate("/403", { replace: true });
                return;
            }

            saveAdminSession(response.data.token, response.data.user);
            navigate("/admin", { replace: true });
        } catch (requestError: unknown) {
            setError(
                getApiErrorMessage(requestError, "Login gagal. Periksa email dan password."),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-100 p-3 sm:p-6">
            <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-6xl overflow-hidden rounded-2xl bg-white shadow-xl sm:min-h-[calc(100vh-58px)] lg:grid-cols-2">
                <section className="relative hidden min-h-[650px] overflow-hidden bg-teal-900 lg:block">
                    <img
                        src="/indonesia-city-potrait.jpg"
                        alt="Pemandangan alam"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-teal-950/20 to-teal-950/20" />

                    <div className="absolute left-10 top-10 flex items-center gap-3 text-white">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                            <ShieldCheck size={25} />
                        </span>
                        <div>
                            <p className="text-lg font-bold">PantauJalan</p>
                            <p className="text-xs text-white/75">Dashboard Admin</p>
                        </div>
                    </div>

                    <div className="absolute bottom-12 left-10 right-10 text-white">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                            Admin Dashboard
                        </p>
                        <h1 className="max-w-md text-4xl font-bold leading-tight">
                            Kelola laporan, pantau kondisi jalan.
                        </h1>
                        <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                            Masuk ke portal admin untuk mengelola informasi
                            kerusakan jalan dan mendukung perjalanan yang lebih aman.
                        </p>
                    </div>
                </section>

                <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-14">
                    <div className="w-full max-w-md">
                        <div className="mb-6 flex items-center justify-between">
                            <div className="lg:hidden flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
                                    <ShieldCheck size={22} />
                                </div>
                                <span className="text-base font-bold text-slate-900">
                                    PantauJalan
                                </span>
                            </div>
                            <div className="ml-auto">
                                <LanguageSwitcher variant="admin" />
                            </div>
                        </div>

                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                            {t("admin.loginTitle", "Selamat datang")}
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            {t("admin.loginSubtitle", "Masuk menggunakan akun administrator untuk melanjutkan.")}
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    {t("admin.emailLabel", "Email")}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="username"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder={t("admin.emailPlaceholder", "Masukkan email admin")}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    {t("admin.passwordLabel", "Password")}
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder={t("admin.passwordPlaceholder", "Masukkan password")}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((current) => !current)}
                                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-slate-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p
                                    role="alert"
                                    className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm leading-5 text-red-700"
                                >
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/15 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? (
                                    <>
                                        <LoaderCircle size={18} className="animate-spin" />
                                        {t("admin.loggingInBtn", "Memproses login...")}
                                    </>
                                ) : (
                                    t("admin.loginBtn", "Masuk ke Dashboard")
                                )}
                            </button>
                        </form>

                        <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                            <p className="text-xs leading-5 text-slate-400">
                                Akses terbatas untuk administrator yang berwenang.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}