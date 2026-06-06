"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CarFront, LayoutList, Map, Plus, Search, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { RideMapPreview } from "@/components/maps/RideMapPreview";
import { PrnGate } from "@/components/onboarding/PrnGate";
import { RidePostCard } from "@/components/rides/RidePostCard";
import { seedRidePosts } from "@/lib/rides";
import type { RidePost, RideRequestStatus } from "@/lib/types";

type ViewMode = "feed" | "map";

const initialRides: RidePost[] = seedRidePosts.map((ride) => ({
  ...ride,
  driver: { ...ride.driver },
  origin: { ...ride.origin, position: { ...ride.origin.position } },
  destination: { ...ride.destination, position: { ...ride.destination.position } },
  requests: ride.requests.map((request) => ({
    ...request,
    pickup: { ...request.pickup, position: { ...request.pickup.position } }
  }))
}));

export function DashboardFeed() {
  const [verifiedPrn, setVerifiedPrn] = useState<string | null>(null);
  const [rides, setRides] = useState<RidePost[]>(initialRides);
  const [viewMode, setViewMode] = useState<ViewMode>("feed");
  const [query, setQuery] = useState("");

  const filteredRides = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return rides;
    }

    return rides.filter((ride) =>
      [ride.origin.label, ride.destination.label, ride.driver.name, ride.vehicle]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query, rides]);

  function handleRequestPickup(rideId: string) {
    setRides((currentRides) =>
      currentRides.map((ride) => {
        if (ride.id !== rideId || ride.requests.some((request) => request.passenger === "You")) {
          return ride;
        }

        return {
          ...ride,
          requests: [
            ...ride.requests,
            {
              id: `req-${ride.id}-${Date.now()}`,
              passenger: "You",
              pickup: {
                label: "Symbiosis Hostel Circle",
                position: { lat: 18.5455, lng: 73.7358 }
              },
              status: "pending"
            }
          ]
        };
      })
    );
  }

  function handleResolveRequest(
    rideId: string,
    requestId: string,
    status: RideRequestStatus
  ) {
    setRides((currentRides) =>
      currentRides.map((ride) => {
        if (ride.id !== rideId) {
          return ride;
        }

        const request = ride.requests.find((item) => item.id === requestId);
        const canAccept =
          status === "accepted" &&
          request?.status === "pending" &&
          ride.availableSeats > 0;

        return {
          ...ride,
          availableSeats: canAccept ? ride.availableSeats - 1 : ride.availableSeats,
          requests: ride.requests.map((item) =>
            item.id === requestId ? { ...item, status } : item
          )
        };
      })
    );
  }

  if (!verifiedPrn) {
    return <PrnGate onVerified={setVerifiedPrn} />;
  }

  return (
    <main className="min-h-screen px-4 py-5 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="sticky top-0 z-30 -mx-4 border-b border-loop-line/70 bg-loop-ink/78 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-loop-blue/35 bg-loop-blue/15 shadow-glow-blue">
                <CarFront className="h-6 w-6 text-loop-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">LoopIn</h1>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-loop-green" />
                  Symbiosis verified - PRN {verifiedPrn}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="relative block sm:w-72">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search rides"
                  className="h-12 w-full rounded-2xl border border-loop-line bg-loop-panel/90 pl-11 pr-4 text-sm font-semibold text-white shadow-neo-pressed outline-none transition focus:border-loop-blue"
                />
              </label>

              <div className="grid grid-cols-2 rounded-2xl border border-loop-line bg-loop-panel p-1 shadow-neo-pressed">
                <ModeButton
                  active={viewMode === "feed"}
                  label="Feed"
                  icon={LayoutList}
                  onClick={() => setViewMode("feed")}
                />
                <ModeButton
                  active={viewMode === "map"}
                  label="Map"
                  icon={Map}
                  onClick={() => setViewMode("map")}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97, y: 2 }}
                className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-loop-green/40 bg-loop-green px-4 font-black text-loop-ink shadow-neo-button"
              >
                <Plus className="h-5 w-5" />
                Post Ride
              </motion.button>
            </div>
          </div>
        </header>

        <section className="py-6">
          <AnimatePresence mode="wait">
            {viewMode === "feed" ? (
              <motion.div
                key="feed"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.26 }}
                className="grid gap-5"
              >
                <FeedComposer />
                {filteredRides.map((ride, index) => (
                  <motion.div
                    key={ride.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <RidePostCard
                      ride={ride}
                      onRequestPickup={handleRequestPickup}
                      onResolveRequest={handleResolveRequest}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.26 }}
                className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"
              >
                <aside className="glass-panel rounded-[28px] bg-glass-sheen p-5 shadow-neo-panel">
                  <h2 className="text-xl font-black text-white">Active Routes</h2>
                  <div className="mt-5 space-y-3">
                    {filteredRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="rounded-2xl border border-loop-line bg-loop-ink/50 p-4 shadow-neo-pressed"
                      >
                        <p className="font-black text-white">{ride.driver.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {ride.origin.label} to {ride.destination.label}
                        </p>
                        <p className="mt-3 text-xs font-bold text-loop-green">
                          {ride.requests.filter((request) => request.status === "accepted").length} pickups
                          optimized
                        </p>
                      </div>
                    ))}
                  </div>
                </aside>
                <div className="grid gap-5">
                  {filteredRides.map((ride) => (
                    <RideMapPreview key={ride.id} ride={ride} heightClass="h-[28rem]" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}

function ModeButton({
  active,
  icon: Icon,
  label,
  onClick
}: {
  active: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pressable flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-black transition ${
        active
          ? "bg-loop-blue text-loop-ink shadow-neo-button"
          : "text-slate-400 hover:text-white"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function FeedComposer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-[28px] bg-glass-sheen p-5 shadow-neo-panel"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-loop-green/35 bg-loop-green/15 font-black text-loop-green shadow-glow-green">
          Y
        </div>
        <button className="pressable min-h-12 flex-1 rounded-2xl border border-loop-line bg-loop-ink/55 px-5 text-left text-sm font-semibold text-slate-400 shadow-neo-pressed">
          Share your next campus commute
        </button>
        <button className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-loop-purple/35 bg-loop-purple px-4 font-black text-white shadow-glow-purple">
          <CarFront className="h-5 w-5" />
          Ride Post
        </button>
      </div>
    </motion.div>
  );
}
