"use client";

import type { Map as LeafletMap, Marker } from "leaflet";
import { useEffect, useRef } from "react";

const origin: [number, number] = [15.1455, 120.5876];
const destination: [number, number] = [15.173, 120.596];
const pacificTriangle: [number, number] = [25.0, 137.0];

function buildWaypoints() {
  return Array.from({ length: 61 }, (_, index): [number, number] => {
    const progress = index / 60;
    return [
      origin[0] + (destination[0] - origin[0]) * progress + Math.sin(progress * Math.PI * 3) * 0.004,
      origin[1] + (destination[1] - origin[1]) * progress + Math.cos(progress * Math.PI * 2) * 0.003,
    ];
  });
}

export function TrackingMap({
  paused,
  mode = "normal",
  onProgress,
}: {
  paused: boolean;
  mode?: "normal" | "bermuda";
  onProgress: (remainingMinutes: number, arrived: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const courierRef = useRef<Marker | null>(null);
  const pausedRef = useRef(paused);
  const progressCallbackRef = useRef(onProgress);

  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { progressCallbackRef.current = onProgress; }, [onProgress]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let disposed = false;
    let timer: number | undefined;

    void import("leaflet").then((L) => {
      if (disposed || !containerRef.current) return;
      const styles = getComputedStyle(document.documentElement);
      const gold = styles.getPropertyValue("--gold").trim();
      const red = styles.getPropertyValue("--red").trim();

      const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(
        mode === "bermuda" ? pacificTriangle : [15.158, 120.591],
        mode === "bermuda" ? 4 : 14,
      );
      mapRef.current = map;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const marker = (className: string, label: string, size = 26) => L.divIcon({
        html: `<div class="tracking-marker ${className}">${label}</div>`,
        className: "",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      if (mode === "bermuda") {
        L.circle(pacificTriangle, { color: red, fillColor: red, fillOpacity: 0.12, radius: 420_000, dashArray: "7,9" }).addTo(map);
        L.marker(pacificTriangle, { icon: marker("tracking-marker--lost", "?", 30) })
          .addTo(map)
          .bindPopup("Final package ping. The whale declined further comment.");
        window.setTimeout(() => map.invalidateSize(), 0);
        return;
      }

      const waypoints = buildWaypoints();

      L.marker(origin, { icon: marker("tracking-marker--origin", "W") }).addTo(map).bindPopup("Joke Warehouse #4 (does not exist)");
      L.marker(destination, { icon: marker("tracking-marker--destination", "H") }).addTo(map).bindPopup("Your place");
      L.polyline(waypoints, { color: gold, weight: 3, opacity: 0.55, dashArray: "6,8" }).addTo(map);
      const courier = L.marker(waypoints[0], { icon: marker("tracking-marker--courier", "→", 28) }).addTo(map);
      courierRef.current = courier;

      let index = 0;
      timer = window.setInterval(() => {
        if (pausedRef.current) return;
        if (index >= waypoints.length - 1) {
          progressCallbackRef.current(0, true);
          if (timer) window.clearInterval(timer);
          return;
        }
        index += 1;
        courier.setLatLng(waypoints[index]);
        progressCallbackRef.current(Math.max(1, Math.round((waypoints.length - index) / 4)), false);
      }, 700);

      window.setTimeout(() => map.invalidateSize(), 0);
    });

    return () => {
      disposed = true;
      if (timer) window.clearInterval(timer);
      courierRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [mode]);

  return <div className="size-full" ref={containerRef} />;
}
