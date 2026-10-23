
import { useEffect } from "react";
import {
    CircleMarker,
    MapContainer,
    Polyline,
    Popup,
    TileLayer,
    useMap,
} from "react-leaflet";
import type {
    Coordinates,
    RouteHazard,
    RoutePath,
} from "../types/routes.types";

interface NavigationMapProps {
    route: RoutePath | null;
    baseline: RoutePath | null;
    hazards: RouteHazard[];
    origin: Coordinates | null;
    destination: Coordinates | null;
}

const defaultCenter: [number, number] = [3.5952, 98.6722];

function FitRoute({
    route,
    origin,
    destination,
}: {
    route: RoutePath | null;
    origin: Coordinates | null;
    destination: Coordinates | null;
}) {
    const map = useMap();

    useEffect(() => {
        if (route?.geometry.coordinates.length) {
            const points = route.geometry.coordinates.map(
                ([lng, lat]) => [lat, lng] as [number, number],
            );

            map.fitBounds(points, { padding: [40, 40], maxZoom: 16 });
            return;
        }

        if (origin && destination) {
            map.fitBounds(
                [
                    [origin.lat, origin.lng],
                    [destination.lat, destination.lng],
                ],
                { padding: [40, 40] },
            );
            return;
        }

        if (origin) {
            map.setView([origin.lat, origin.lng], 15);
        }
    }, [map, route, origin, destination]);

    return null;
}

function toLatLngs(route: RoutePath | null): [number, number][] {
    return (
        route?.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng],
        ) ?? []
    );
}

export default function NavigationMap({
    route,
    baseline,
    hazards,
    origin,
    destination,
}: NavigationMapProps) {
    const routePoints = toLatLngs(route);
    const baselinePoints = toLatLngs(baseline);

    return (
        <div className="relative h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-[540px] lg:h-[calc(100vh-190px)] lg:min-h-[560px]">
            <MapContainer
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitRoute
                    route={route}
                    origin={origin}
                    destination={destination}
                />

                {baselinePoints.length > 1 && (
                    <Polyline
                        positions={baselinePoints}
                        pathOptions={{
                            color: "#94a3b8",
                            weight: 5,
                            opacity: 0.65,
                            dashArray: "8 8",
                        }}
                    />
                )}

                {routePoints.length > 1 && (
                    <Polyline
                        positions={routePoints}
                        pathOptions={{
                            color: "#2563eb",
                            weight: 6,
                            opacity: 0.95,
                            lineCap: "round",
                            lineJoin: "round",
                        }}
                    />
                )}

                {origin && (
                    <CircleMarker
                        center={[origin.lat, origin.lng]}
                        radius={8}
                        pathOptions={{
                            color: "#ffffff",
                            weight: 3,
                            fillColor: "#10b981",
                            fillOpacity: 1,
                        }}
                    >
                        <Popup>Lokasi awal</Popup>
                    </CircleMarker>
                )}

                {destination && (
                    <CircleMarker
                        center={[destination.lat, destination.lng]}
                        radius={8}
                        pathOptions={{
                            color: "#ffffff",
                            weight: 3,
                            fillColor: "#2563eb",
                            fillOpacity: 1,
                        }}
                    >
                        <Popup>Lokasi tujuan</Popup>
                    </CircleMarker>
                )}

                {hazards.map((hazard) => (
                    <CircleMarker
                        key={hazard.id}
                        center={[hazard.lat, hazard.lng]}
                        radius={8}
                        pathOptions={{
                            color: "#ffffff",
                            weight: 2,
                            fillColor: "#ef4444",
                            fillOpacity: 1,
                        }}
                    >
                        <Popup>
                            <div className="min-w-36">
                                <p className="font-semibold">{hazard.title}</p>
                                <p className="mt-1 text-sm">{hazard.address}</p>
                                <p className="mt-1 text-sm">
                                    Tingkat: {hazard.severity}
                                </p>
                                {hazard.status && (
                                    <p className="text-sm">Status: {hazard.status}</p>
                                )}
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            <div className="absolute bottom-4 left-4 z-[500] flex flex-wrap gap-3 rounded-xl border border-white/70 bg-white/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-5 rounded-full bg-blue-600" />
                    Rute aman
                </span>
                {baselinePoints.length > 0 && (
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-5 rounded-full bg-slate-400" />
                        Rute pembanding
                    </span>
                )}
                {hazards.length > 0 && (
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        Jalan rusak
                    </span>
                )}
            </div>
        </div>
    );
}
