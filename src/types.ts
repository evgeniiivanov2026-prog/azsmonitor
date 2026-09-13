export interface GasStation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  loadLevel: 'low' | 'medium' | 'high';
  queueCount: number;
  avgWaitMinutes: number;
  fuelTypes: FuelType[];
  open24h: boolean;
  rating: number;
}

export interface FuelType {
  type: string;
  price: number;
  available: boolean;
}

export interface Order {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: string;
  liters: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'ready' | 'completed';
  queueNumber: number;
  estimatedMinutes: number;
  createdAt: Date;
  qrCode: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  balance: number;
  bonusPoints: number;
  totalFuelLiters: number;
  visitsCount: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export type Screen = 'home' | 'map' | 'order' | 'queue' | 'profile';
