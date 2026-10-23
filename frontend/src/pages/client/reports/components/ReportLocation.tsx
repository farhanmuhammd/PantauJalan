
import { useEffect, useState } from "react";
import {
    Copy,
    Crosshair,
    LoaderCircle,
    MapPin,
    MousePointer2,
} from "lucide-react";
import {
    CircleMarker,
    MapContainer,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";

interface ReportLocationProps {
    latitude: number | null;
    longitude: number | null;
    onCoordinatesChange: (latitude: number, longitude: number) => void;
    locationError?: string;
}

const defaultCenter: [number, number] = [3.587576, 98.642247];

function MapClickHandler({
    onCoordinatesChange,
}: {
    onCoordinatesChange: (latitude: number, longitude: number) => void;
}) {
    useMapEvents({
        click(event) {
            onCoordinatesChange(event.latlng.lat, event.latlng.lng);
        },
    });

    return null;
}

function RecenterMap({ position }: { position: [number, number] }) {
    const map = useMap();

    useEffect(() => {
        map.flyTo(position, Math.max(map.getZoom(), 15), {
            duration: 0.7,
        });
    }, [map, position]);

    return null;
}

export default function ReportLocation({
    latitude,
    longitude,
    onCoordinatesChange,
    locationError,
}: ReportLocationProps) {
    const [locating, setLocating] = useState(false);
    const [locationMessage, setLocationMessage] = useState("");
    const position: [number, number] =
        latitude !== null && longitude !== null
            ? [latitude, longitude]
            : defaultCenter;

    const getMyLocation = () => {
        if (!navigator.geolocation) {
            setLocationMessage("Browser Anda tidak mendukung lokasi perangkat.");
            return;
        }

        setLocating(true);
        setLocationMessage("");

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                onCoordinatesChange(coords.latitude, coords.longitude);
                setLocating(false);
            },
            () => {
                setLocationMessage(
                    "Lokasi tidak dapat diakses. Izinkan akses lokasi atau pilih titik di peta.",
                );
                setLocating(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000,
            },
        );
    };

    const copyCoordinates = async () => {
        if (latitude === null || longitude === null) return;

        try {
            await navigator.clipboard.writeText(`${latitude}, ${longitude}`);
            setLocationMessage("Koordinat berhasil disalin.");
        } catch {
            setLocationMessage("Koordinat tidak dapat disalin dari browser ini.");
        }
    };

    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <MapPin size={20} />
                </span>

                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Lokasi kerusakan
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        Pilih titik kerusakan pada peta atau gunakan lokasi perangkat Anda.
                    </p>
                </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                    type="button"
                    onClick={() => setLocationMessage("Klik titik lokasi kerusakan pada peta.")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                    <MousePointer2 size={17} />
                    Pilih di peta
                </button>

                <button
                    type="button"
                    onClick={getMyLocation}
                    disabled={locating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
                >
                    {locating ? (
                        <LoaderCircle className="animate-spin" size={17} />
                    ) : (
                        <Crosshair size={17} />
                    )}
                    {locating ? "Mencari lokasi..." : "Lokasi saya"}
                </button>
            </div>

            <div className="relative z-0 h-[280px] overflow-hidden rounded-xl border border-slate-200 sm:h-[350px]">
                <MapContainer
                    center={position}
                    zoom={14}
                    scrollWheelZoom
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <MapClickHandler onCoordinatesChange={onCoordinatesChange} />
                    <RecenterMap position={position} />

                    {latitude !== null && longitude !== null && (
                        <>
                            <CircleMarker
                                center={position}
                                radius={17}
                                pathOptions={{
                                    color: "#2563eb",
                                    weight: 2,
                                    fillColor: "#60a5fa",
                                    fillOpacity: 0.2,
                                }}
                            />
                            <CircleMarker
                                center={position}
                                radius={7}
                                pathOptions={{
                                    color: "#ffffff",
                                    weight: 3,
                                    fillColor: "#2563eb",
                                    fillOpacity: 1,
                                }}
                            />
                        </>
                    )}
                </MapContainer>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Klik peta untuk menentukan titik yang tepat. Geser dan perbesar peta
                untuk memilih lokasi lebih akurat.
            </p>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">
                        Koordinat lokasi
                    </p>

                    <button
                        type="button"
                        onClick={copyCoordinates}
                        disabled={latitude === null || longitude === null}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 disabled:opacity-40"
                    >
                        <Copy size={14} />
                        Salin
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="latitude"
                            className="mb-1.5 block text-xs text-slate-500"
                        >
                            Latitude
                        </label>
                        <input
                            id="latitude"
                            type="number"
                            step="any"
                            value={latitude ?? ""}
                            onChange={(event) => {
                                const nextLatitude = Number(event.target.value);
                                if (
                                    event.target.value !== "" &&
                                    Number.isFinite(nextLatitude) &&
                                    nextLatitude >= -90 &&
                                    nextLatitude <= 90
                                ) {
                                    onCoordinatesChange(nextLatitude, longitude ?? defaultCenter[1]);
                                }
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="longitude"
                            className="mb-1.5 block text-xs text-slate-500"
                        >
                            Longitude
                        </label>
                        <input
                            id="longitude"
                            type="number"
                            step="any"
                            value={longitude ?? ""}
                            onChange={(event) => {
                                const nextLongitude = Number(event.target.value);
                                if (
                                    event.target.value !== "" &&
                                    Number.isFinite(nextLongitude) &&
                                    nextLongitude >= -180 &&
                                    nextLongitude <= 180
                                ) {
                                    onCoordinatesChange(latitude ?? defaultCenter[0], nextLongitude);
                                }
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>

                {locationError && (
                    <p className="mt-2 text-sm text-red-600">{locationError}</p>
                )}

                {locationMessage && (
                    <p aria-live="polite" className="mt-3 text-xs text-slate-500">
                        {locationMessage}
                    </p>
                )}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3.5 text-xs leading-relaxed text-blue-800">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <p>
                    Koordinat digunakan untuk membantu petugas menemukan lokasi laporan.
                    Pastikan titik yang dipilih benar.
                </p>
            </div>
        </section>
    );
}
