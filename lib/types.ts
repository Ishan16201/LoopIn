export type LatLngLiteral = {
  lat: number;
  lng: number;
};

export type RidePoint = {
  label: string;
  position: LatLngLiteral;
};

export type RideRequestStatus = "pending" | "accepted" | "denied";

export type RideRequest = {
  id: string;
  passenger: string;
  pickup: RidePoint;
  status: RideRequestStatus;
};

export type RidePost = {
  id: string;
  driver: {
    name: string;
    prn: string;
    year: string;
    rating: number;
  };
  origin: RidePoint;
  destination: RidePoint;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  vehicle: string;
  vibe: string;
  requests: RideRequest[];
};
