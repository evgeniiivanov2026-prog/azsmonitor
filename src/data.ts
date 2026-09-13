import { StationCard } from './types';

export const stations: StationCard[] = [
  {
    id: '1',
    name: 'Max Fuel #1',
    address: 'ул. Ленина, 45',
    loadLevel: 'low',
    queueCount: 2,
    avgWaitMinutes: 3,
    distance: '1.2 км',
    fuelTypes: [
      { type: 'АИ-92', price: 52.5, available: true },
      { type: 'АИ-95', price: 56.8, available: true },
      { type: 'АИ-98', price: 63.2, available: true },
      { type: 'ДТ', price: 58.9, available: true },
    ],
  },
  {
    id: '2',
    name: 'Max Fuel #2',
    address: 'пр. Мира, 112',
    loadLevel: 'medium',
    queueCount: 7,
    avgWaitMinutes: 12,
    distance: '2.8 км',
    fuelTypes: [
      { type: 'АИ-92', price: 52.5, available: true },
      { type: 'АИ-95', price: 56.8, available: true },
      { type: 'АИ-98', price: 63.2, available: false },
      { type: 'ДТ', price: 58.9, available: true },
    ],
  },
  {
    id: '3',
    name: 'Max Fuel #3',
    address: 'ул. Садовая, 78',
    loadLevel: 'high',
    queueCount: 15,
    avgWaitMinutes: 25,
    distance: '3.5 км',
    fuelTypes: [
      { type: 'АИ-92', price: 52.5, available: true },
      { type: 'АИ-95', price: 56.8, available: true },
      { type: 'АИ-98', price: 63.2, available: true },
      { type: 'ДТ', price: 58.9, available: true },
    ],
  },
  {
    id: '4',
    name: 'Max Fuel #4',
    address: 'Кутузовский пр., 33',
    loadLevel: 'low',
    queueCount: 1,
    avgWaitMinutes: 2,
    distance: '4.1 км',
    fuelTypes: [
      { type: 'АИ-92', price: 52.5, available: true },
      { type: 'АИ-95', price: 56.8, available: true },
      { type: 'АИ-98', price: 63.2, available: true },
      { type: 'ДТ', price: 58.9, available: true },
    ],
  },
];

export const userBalance = 5420;
export const userBonusPoints = 1250;
export const userName = 'Александр';
