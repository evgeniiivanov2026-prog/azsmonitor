export type MessageSender = 'bot' | 'user';

export interface InlineButton {
  label: string;
  action: string;
  style?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface ButtonRow {
  buttons: InlineButton[];
}

export interface FuelCard {
  type: string;
  price: number;
  available: boolean;
}

export interface StationCard {
  id: string;
  name: string;
  address: string;
  loadLevel: 'low' | 'medium' | 'high';
  queueCount: number;
  avgWaitMinutes: number;
  fuelTypes: FuelCard[];
  distance: string;
  rating: number;
  reviewsCount: number;
  yandexRating: number;
  yandexReviewsCount: number;
}

export interface OrderCard {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: string;
  liters: number;
  totalPrice: number;
  queueNumber: number;
  estimatedMinutes: number;
  status: 'confirmed' | 'ready' | 'completed';
  qrCode: string;
  slotTime?: string;
  slotNumber?: number;
}

export interface ChatRoomMessage {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: Date;
  type: 'message' | 'status_update' | 'alert';
  stationId: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  stationId: string;
  rating: number;
  text: string;
  timestamp: Date;
  helpful: number;
}

export interface YandexReview {
  id: string;
  author: string;
  avatar: string;
  stationId: string;
  rating: number;
  text: string;
  timestamp: Date;
  source: 'yandex';
  helpful: number;
}

export interface SmartSlot {
  number: number;
  time: string;
  available: boolean;
  carsInSlot: number;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text?: string;
  buttons?: ButtonRow[];
  stationCard?: StationCard;
  stationList?: StationCard[];
  orderCard?: OrderCard;
  qrCode?: string;
  timestamp: Date;
  isTyping?: boolean;
}

export type BotState =
  | 'idle'
  | 'choosing_action'
  | 'choosing_station'
  | 'choosing_fuel'
  | 'choosing_liters'
  | 'confirming_order'
  | 'order_created'
  | 'viewing_queue'
  | 'viewing_profile'
  | 'station_chat'
  | 'writing_review'
  | 'viewing_smart_slots'
  | 'yield_position';
