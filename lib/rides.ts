import type { LatLngLiteral } from "@/lib/types";

export const campusCenter: LatLngLiteral = {
  lat: 18.5425,
  lng: 73.7266
};

export const seedRidePosts = [
  {
    id: "ride-1",
    driver: {
      name: "Aarav Mehta",
      prn: "22070143021",
      year: "BBA III",
      rating: 4.9
    },
    origin: {
      label: "Baner High Street",
      position: { lat: 18.559, lng: 73.7868 }
    },
    destination: {
      label: "Symbiosis Lavale Hill Base",
      position: { lat: 18.5425, lng: 73.7266 }
    },
    departureTime: "08:15 AM",
    availableSeats: 3,
    totalSeats: 4,
    vehicle: "Hyundai i20",
    vibe: "Quiet morning ride, one chai stop if everyone is alive enough.",
    requests: [
      {
        id: "req-1",
        passenger: "Riya S.",
        pickup: {
          label: "Balewadi Phata",
          position: { lat: 18.5687, lng: 73.7726 }
        },
        status: "pending"
      }
    ]
  },
  {
    id: "ride-2",
    driver: {
      name: "Naina Kulkarni",
      prn: "23070112044",
      year: "MBA I",
      rating: 4.8
    },
    origin: {
      label: "Aundh ITI Road",
      position: { lat: 18.5635, lng: 73.8077 }
    },
    destination: {
      label: "Symbiosis University Main Gate",
      position: { lat: 18.5416, lng: 73.7277 }
    },
    departureTime: "09:00 AM",
    availableSeats: 2,
    totalSeats: 3,
    vehicle: "Honda Activa",
    vibe: "Helmet required. Playlist democratic.",
    requests: []
  },
  {
    id: "ride-3",
    driver: {
      name: "Kabir Shah",
      prn: "21070156082",
      year: "SID IV",
      rating: 4.7
    },
    origin: {
      label: "Pashan Circle",
      position: { lat: 18.5394, lng: 73.7924 }
    },
    destination: {
      label: "SIBM Pune",
      position: { lat: 18.5419, lng: 73.7272 }
    },
    departureTime: "10:30 AM",
    availableSeats: 1,
    totalSeats: 4,
    vehicle: "Maruti Swift",
    vibe: "Leaving after studio review. Trunk has space for project boards.",
    requests: [
      {
        id: "req-2",
        passenger: "You",
        pickup: {
          label: "Sus Road Bus Stop",
          position: { lat: 18.5509, lng: 73.7661 }
        },
        status: "accepted"
      }
    ]
  }
] as const;
