import { useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router";
import { getAdminReports } from "../../api/reports-admin.api";
import type {
  ReportItem,
  ReportStatus,
} from "../../../client/reports/types/reports.types";

const statusOptions: { value: "" | ReportStatus; label: string }[] = [
  { value: "", label: "Semua status" },
  { value: "menunggu", label: "Menunggu" },
  { value: "diverifikasi", label: "Diverifikasi" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];
const statusStyles: Record<ReportStatus, string> = {
  menunggu: "bg-amber-50 text-amber-700 ring-amber-200",
  diverifikasi: "bg-sky-50 text-sky-700 ring-sky-200",
  diproses: "bg-blue-50 text-blue-700 ring-blue-200",
  selesai: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  ditolak: "bg-rose-50 text-rose-700 ring-rose-200",
};
const severityStyles = {
  ringan: "bg-slate-100 text-slate-600",
  sedang: "bg-orange-50 text-orange-700",
  berat: "bg-rose-50 text-rose-700",
};
const statusLabels: Record<ReportStatus, string> = {
  menunggu: "Menunggu",
  diverifikasi: "Diverifikasi",
  diproses: "Diproses",
  selesai: "Selesai",
  ditolak: "Ditolak",
};
const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export default function AdminReportListPage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"" | ReportStatus>("");
  const [severity, setSeverity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const response = await getAdminReports({
          page,
          limit: 10,
          search: debouncedSearch,
          status: status || undefined,
          severity: severity || undefined,
        });
        if (cancelled) return;
        setReports(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.totalItems);
      } catch {
        if (!cancelled)
          setError("Daftar laporan gagal dimuat. Silakan periksa koneksi API.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status, severity, reloadKey]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Pusat pengelolaan
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Laporan Pengaduan
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tinjau laporan masyarakat, periksa tingkat kerusakan, dan kelola
            progres penanganan.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-white px-4 py-2.5 text-sm text-slate-600">
          <FileText size={17} className="text-emerald-700" />
          <span>
            <strong className="text-slate-900">
              {totalItems.toLocaleString("id-ID")}
            </strong>{" "}
            laporan
          </span>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                Daftar laporan masyarakat
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Pilih laporan untuk melihat detail dan memperbarui
                penanganannya.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_170px_150px] xl:min-w-[620px]">
              <label className="relative block">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari judul atau lokasi..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>
              <label className="relative">
                <SlidersHorizontal
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as "" | ReportStatus);
                    setPage(1);
                  }}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
                >
                  {statusOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <select
                value={severity}
                onChange={(event) => {
                  setSeverity(event.target.value);
                  setPage(1);
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-emerald-500"
              >
                <option value="">Semua kerusakan</option>
                <option value="ringan">Ringan</option>
                <option value="sedang">Sedang</option>
                <option value="berat">Berat</option>
              </select>
            </div>
          </div>
        </div>
        {error && (
          <div
            role="alert"
            className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            {error}
            <button
              onClick={() => setReloadKey((current) => current + 1)}
              className="ml-2 font-semibold underline"
            >
              Muat ulang
            </button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-3.5">Laporan</th>
                <th className="px-4 py-3.5">Lokasi</th>
                <th className="px-4 py-3.5">Kerusakan</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td colSpan={6} className="px-5 py-5">
                      <div className="h-8 animate-pulse rounded-lg bg-slate-100" />
                    </td>
                  </tr>
                ))
                : reports.map((report) => (
                  <tr
                    key={report._id}
                    className="group transition hover:bg-emerald-50/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-[250px] items-center gap-3">
                        <div className="h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          {report.images?.[0] ? (
                            <img
                              src={report.images[0]}
                              alt={report.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                              <FileText size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="line-clamp-1 text-sm font-semibold text-slate-800">
                            {report.title}
                          </p>
                          <p className="mt-1 line-clamp-1 max-w-[250px] text-xs text-slate-400">
                            {report.description}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            ID: {report._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex max-w-[230px] items-start gap-2 text-xs leading-5 text-slate-500">
                        <MapPin
                          size={15}
                          className="mt-0.5 shrink-0 text-emerald-700"
                        />
                        <span className="line-clamp-2">
                          {report.address || "Lokasi belum tersedia"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${severityStyles[report.severity] || severityStyles.sedang}`}
                      >
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyles[report.status]}`}
                      >
                        {statusLabels[report.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-2 text-xs text-slate-500">
                        <CalendarDays
                          size={14}
                          className="mt-0.5 shrink-0 text-slate-400"
                        />
                        <span>{dateLabel(report.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() =>
                          navigate(`/admin/reports/${report._id}`, {
                            state: { report },
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:border-emerald-600 hover:bg-emerald-700 hover:text-white"
                      >
                        <Eye size={14} /> Kelola
                      </button>
                    </td>
                  </tr>
                ))}
              {!loading && !reports.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <FileText size={22} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      Laporan tidak ditemukan
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Coba ubah kata kunci atau filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Menampilkan {reports.length ? (page - 1) * 10 + 1 : 0}–
            {Math.min(page * 10, totalItems)} dari{" "}
            {totalItems.toLocaleString("id-ID")} laporan
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1 || loading}
              onClick={() => setPage((current) => current - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft size={17} />
            </button>
            <span className="min-w-20 text-center text-xs font-medium text-slate-600">
              Halaman {page} / {Math.max(1, totalPages)}
            </span>
            <button
              disabled={page >= totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
