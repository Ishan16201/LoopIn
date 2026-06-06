"use client";

import { GoogleMap, DirectionsRenderer, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { MapPinned, Route } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { RidePost } from "@/lib/types";

type RideMapPreviewProps = {
  ride: RidePost;
  heightClass?: string;
};

const mapContainerStyle = {
  width: "100%",
  height: "100%"
};

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  gestureHandling: "cooperative",
  styles: [
    { elementType: "geometry", stylers: [{ color: "#111827" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#05070d" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#263349" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#334155" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f2538" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] }
  ]
};

export function RideMapPreview({ ride, heightClass = "h-64" }: RideMapPreviewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? ""
  });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const acceptedPickups = useMemo(
    () => ride.requests.filter((request) => request.status === "accepted"),
    [ride.requests]
  );

  useEffect(() => {
    if (!apiKey || !isLoaded || !window.google) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: ride.origin.position,
        destination: ride.destination.position,
        waypoints: acceptedPickups.map((request) => ({
          location: request.pickup.position,
          stopover: true
        })),
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        }
      }
    );
  }, [acceptedPickups, apiKey, isLoaded, ride.destination.position, ride.origin.position]);

  if (!apiKey) {
    return (
      <div
        className={`${heightClass} relative overflow-hidden rounded-3xl border border-loop-line bg-loop-ink shadow-neo-pressed`}
      >
        <FallbackRoute ride={ride} />
      </div>
    );
  }

  return (
    <div
      className={`${heightClass} overflow-hidden rounded-3xl border border-loop-line bg-loop-ink shadow-neo-pressed`}
    >
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={ride.destination.position}
          zoom={12}
          options={mapOptions}
        >
          {directions ? (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: "#3cffb4",
                  strokeOpacity: 0.92,
                  strokeWeight: 5
                }
              }}
            />
          ) : (
            <>
              <MarkerF position={ride.origin.position} />
              <MarkerF position={ride.destination.position} />
            </>
          )}
        </GoogleMap>
      ) : (
        <FallbackRoute ride={ride} />
      )}
    </div>
  );
}

function FallbackRoute({ ride }: { ride: RidePost }) {
  const accepted = ride.requests.filter((request) => request.status === "accepted");

  return (
    <div className="relative flex h-full min-h-56 flex-col justify-between overflow-hidden p-5">
      <div className="absolute inset-0 bg-carbon-grid bg-[length:22px_22px] opacity-40" />
      <div className="absolute left-8 right-8 top-1/2 h-1 -translate-y-1/2 rounded-full bg-loop-blue/40 shadow-glow-blue" />
      <div className="relative z-10 flex items-center justify-between">
        <MapPinLabel label={ride.origin.label} tone="blue" />
        <MapPinLabel label={ride.destination.label} tone="green" />
      </div>
      <div className="relative z-10 mx-auto flex items-center gap-2 rounded-full border border-loop-line bg-loop-panel/90 px-4 py-2 text-xs font-semibold text-slate-300">
        <Route className="h-4 w-4 text-loop-green" />
        {accepted.length
          ? `${accepted.length} accepted pickup${accepted.length > 1 ? "s" : ""} queued`
          : "Add a Google Maps key for live routing"}
      </div>
    </div>
  );
}

function MapPinLabel({ label, tone }: { label: string; tone: "blue" | "green" }) {
  const toneClass = tone === "blue" ? "text-loop-blue shadow-glow-blue" : "text-loop-green shadow-glow-green";

  return (
    <div className="max-w-[44%] rounded-2xl border border-white/10 bg-loop-raised/85 p-3 shadow-neo-panel">
      <MapPinned className={`mb-2 h-5 w-5 ${toneClass}`} />
      <p className="text-xs font-bold leading-4 text-white">{label}</p>
    </div>
  );
}
