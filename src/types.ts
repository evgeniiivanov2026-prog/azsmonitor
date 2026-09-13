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
}

export interface OrderCard {
  id: string;
  stationName: string;
  fuelType: string;
  liters: number;
  totalPrice: number;
  queueNumber: number;
  estimatedMinutes: number;
  status: 'confirmed' | 'ready' | 'completed';
  qrCode: string;
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
  image?: string;
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
  | 'viewing_profile';
