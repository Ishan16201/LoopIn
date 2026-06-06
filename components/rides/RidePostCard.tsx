"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Clock3,
  MapPin,
  Navigation,
  Route,
  Sparkles,
  Star,
  UserPlus,
  Users,
  X
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { RideMapPreview } from "@/components/maps/RideMapPreview";
import type { RidePost, RideRequestStatus } from "@/lib/types";

type RidePostCardProps = {
  ride: RidePost;
  onRequestPickup: (rideId: string) => void;
  onResolveRequest: (rideId: string, requestId: string, status: RideRequestStatus) => void;
};

export function RidePostCard({
  ride,
  onRequestPickup,
  onResolveRequest
}: RidePostCardProps) {
  const [celebratingRequestId, setCelebratingRequestId] = useState<string | null>(null);
  const pendingRequests = ride.requests.filter((request) => request.status === "pending");
  const acceptedRequests = ride.requests.filter((request) => request.status === "accepted");
  const hasYourRequest = ride.requests.some((request) => request.passenger === "You");
  const seatsLabel = `${ride.availableSeats}/${ride.totalSeats}`;

  const routeStops = useMemo(
    () => [ride.origin.label, ...acceptedRequests.map((request) => request.pickup.label), ride.destination.label],
    [acceptedRequests, ride.destination.label, ride.origin.label]
  );

  function handleAccept(requestId: string) {
    setCelebratingRequestId(requestId);
    onResolveRequest(ride.id, requestId, "accepted");
    window.setTimeout(() => setCelebratingRequestId(null), 900);
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }}
      className="glass-panel relative overflow-hidden rounded-[28px] bg-glass-sheen p-5 shadow-neo-panel sm:p-6"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-loop-blue/30 bg-loop-blue/15 text-lg font-black text-loop-blue shadow-glow-blue">
            {ride.driver.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-white">{ride.driver.name}</h3>
              <span className="flex items-center gap-1 rounded-full border border-loop-green/25 bg-loop-green/10 px-2 py-1 text-xs font-bold text-loop-green">
                <Star className="h-3.5 w-3.5 fill-loop-green" />
                {ride.driver.rating}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {ride.driver.year} - PRN {ride.driver.prn}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:min-w-52">
          <Stat icon={Clock3} label="Leaves" value={ride.departureTime} />
          <Stat icon={Users} label="Seats" value={seatsLabel} />
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.86fr]">
        <div className="space-y-5">
          <div className="rounded-3xl border border-loop-line bg-loop-ink/46 p-4 shadow-neo-pressed">
            <RouteLine
              origin={ride.origin.label}
              destination={ride.destination.label}
              stops={acceptedRequests.length}
            />
            <p className="mt-4 text-sm leading-6 text-slate-300">{ride.vibe}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-slate-300">
              <span className="rounded-full border border-loop-line bg-loop-raised px-3 py-1.5">
                {ride.vehicle}
              </span>
              <span className="rounded-full border border-loop-purple/30 bg-loop-purple/10 px-3 py-1.5 text-loop-purple">
                Waypoint optimized
              </span>
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                Requests
              </h4>
              <span className="text-xs font-bold text-loop-green">
                {acceptedRequests.length} accepted
              </span>
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {ride.requests.map((request) => (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="relative overflow-hidden rounded-2xl border border-loop-line bg-loop-raised/70 p-3"
                  >
                    {celebratingRequestId === request.id ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1.22 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute inset-0 grid place-items-center bg-loop-green/10"
                      >
                        <Sparkles className="h-8 w-8 text-loop-green" />
                      </motion.div>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-bold text-white">{request.passenger}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          Pickup: {request.pickup.label}
                        </p>
                      </div>

                      {request.status === "pending" ? (
                        <div className="flex gap-2">
                          <IconButton
                            label="Accept request"
                            tone="green"
                            onClick={() => handleAccept(request.id)}
                            disabled={ride.availableSeats === 0}
                          >
                            <Check className="h-4 w-4" />
                          </IconButton>
                          <IconButton
                            label="Deny request"
                            tone="danger"
                            onClick={() => onResolveRequest(ride.id, request.id, "denied")}
                          >
                            <X className="h-4 w-4" />
                          </IconButton>
                        </div>
                      ) : (
                        <StatusPill status={request.status} />
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!ride.requests.length ? (
                <div className="rounded-2xl border border-dashed border-loop-line bg-loop-ink/40 p-4 text-sm text-slate-500">
                  No pickup requests yet.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <RideMapPreview ride={ride} />
          <div className="rounded-3xl border border-loop-line bg-loop-ink/45 p-4 shadow-neo-pressed">
            <h4 className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
              Live Route
            </h4>
            <ol className="space-y-3">
              {routeStops.map((stop, index) => (
                <li key={`${stop}-${index}`} className="flex items-center gap-3 text-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-loop-blue/25 bg-loop-blue/10 text-xs font-black text-loop-blue">
                    {index + 1}
                  </span>
                  <span className="text-slate-300">{stop}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-loop-line/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          {pendingRequests.length} pending request{pendingRequests.length === 1 ? "" : "s"} - Driver
          confirms every pickup.
        </p>
        <motion.button
          whileHover={{ scale: ride.availableSeats > 0 && !hasYourRequest ? 1.03 : 1 }}
          whileTap={{ scale: 0.97, y: 2 }}
          disabled={ride.availableSeats === 0 || hasYourRequest}
          onClick={() => onRequestPickup(ride.id)}
          className="pressable inline-flex items-center justify-center gap-2 rounded-2xl border border-loop-blue/45 bg-loop-blue px-5 py-3 font-black text-loop-ink shadow-neo-button disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
        >
          <UserPlus className="h-5 w-5" />
          {hasYourRequest ? "Request Sent" : ride.availableSeats === 0 ? "Full Ride" : "Pick Me Up"}
        </motion.button>
      </div>
    </motion.article>
  );
}

function Stat({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-loop-line bg-loop-ink/50 p-3 shadow-neo-pressed">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function RouteLine({
  origin,
  destination,
  stops
}: {
  origin: string;
  destination: string;
  stops: number;
}) {
  return (
    <div className="grid gap-4">
      <div className="flex gap-3">
        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-loop-blue" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Start
          </p>
          <p className="mt-1 font-bold text-white">{origin}</p>
        </div>
      </div>
      <div className="ml-2 h-8 w-px bg-gradient-to-b from-loop-blue to-loop-green" />
      <div className="flex gap-3">
        <Navigation className="mt-0.5 h-5 w-5 shrink-0 text-loop-green" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            Destination
          </p>
          <p className="mt-1 font-bold text-white">{destination}</p>
          <p className="mt-1 text-xs font-semibold text-loop-green">
            {stops ? `${stops} optimized pickup stop${stops > 1 ? "s" : ""}` : "Direct route"}
          </p>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  tone,
  disabled,
  onClick,
  children
}: {
  label: string;
  tone: "green" | "danger";
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "green"
      ? "border-loop-green/35 bg-loop-green text-loop-ink shadow-glow-green"
      : "border-loop-danger/35 bg-loop-danger text-loop-ink";

  return (
    <motion.button
      aria-label={label}
      title={label}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: 0.94, y: 2 }}
      disabled={disabled}
      onClick={onClick}
      className={`pressable grid h-10 w-10 place-items-center rounded-xl border font-black disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 ${toneClass}`}
    >
      {children}
    </motion.button>
  );
}

function StatusPill({ status }: { status: Exclude<RideRequestStatus, "pending"> }) {
  const styles =
    status === "accepted"
      ? "border-loop-green/30 bg-loop-green/10 text-loop-green"
      : "border-loop-danger/30 bg-loop-danger/10 text-loop-danger";

  return (
    <span className={`rounded-full border px-3 py-1.5 text-xs font-black uppercase ${styles}`}>
      {status}
    </span>
  );
}
