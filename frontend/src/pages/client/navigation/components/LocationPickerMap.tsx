
import { useState } from "react";
import {
    CircleMarker,
    MapContainer,
    TileLayer,
    useMapEvents,
} from "react-leaflet";
import { MapPin, X } from "lucide-react";
import type { Coordinates } from "../types/routes.types";
import { REGION } from "../config/region";

interface LocationPickerMapProps {
    onClose: () => void;
    onConfirm: (location: Coordinates) => void;
    initialPosition?: Coordinates | null;
}


function MapClickHandler({
    position,
    onChange,
}: {
    position: Coordinates | null;
    onChange: (position: Coordinates) => void;
}) {
    useMapEvents({
        click(event) {
            onChange({
                lat: event.latlng.lat,
                lng: event.latlng.lng,
            });
        },
    });

    return position ? (
        <CircleMarker
            center={[position.lat, position.lng]}
            radius={9}
            pathOptions={{
                color: "#ffffff",
                weight: 3,
                fillColor: "#2563eb",
                fillOpacity: 1,
            }}
        />
    ) : null;
}

export default function LocationPickerMap({
    onClose,
    onConfirm,
    initialPosition,
}: LocationPickerMapProps) {
    const [position, setPosition] = useState<Coordinates | null>(
        initialPosition ?? null,
    );

    return (
        <div
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-picker-title"
        >
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-4 sm:p-5">
                    <div>
                        <h2
                            id="location-picker-title"
                            className="text-lg font-bold text-slate-900"
                        >
                            Pilih lokasi dari peta
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Ketuk titik jalan atau tempat yang ingin dipilih.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup peta"
                        className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="relative z-0 h-[50vh] min-h-[280px]">
                    <MapContainer
                        center={REGION.center}
                        zoom={13}
                        minZoom={11}
                        maxZoom={18}
                        maxBounds={REGION.bounds}
                        maxBoundsViscosity={1}
                        scrollWheelZoom
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapClickHandler
                            position={position}
                            onChange={setPosition}
                        />
                    </MapContainer>

                    <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-lg bg-white/95 px-3 py-2 text-xs font-medium text-slate-600 shadow">
                        <MapPin size={14} className="mr-1 inline text-blue-600" />
                        Ketuk peta untuk memilih titik
                    </div>
                </div>

                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="min-w-0 text-sm">
                        {position ? (
                            <>
                                <p className="font-semibold text-slate-800">
                                    Titik terpilih
                                </p>
                                <p className="mt-1 break-all text-xs text-slate-500">
                                    {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                                </p>
                            </>
                        ) : (
                            <p className="text-slate-500">
                                Belum ada titik yang dipilih.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                        >
                            Batal
                        </button>

                        <button
                            type="button"
                            disabled={!position}
                            onClick={() => {
                                if (position) onConfirm(position);
                            }}
                            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                        >
                            Gunakan lokasi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
