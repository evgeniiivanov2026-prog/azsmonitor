import { StationCard, ChatRoomMessage, Review, SmartSlot, YandexReview } from './types';

// Интеграция с Яндекс Картами (симуляция API)
// В реальном приложении здесь был бы запрос к Yandex Maps API
export const yandexRatings: Record<string, { rating: number; reviewsCount: number; lastUpdated: string }> = {
  '1': { rating: 4.6, reviewsCount: 1243, lastUpdated: '2 мин назад' },
  '2': { rating: 4.1, reviewsCount: 876, lastUpdated: '5 мин назад' },
  '3': { rating: 3.7, reviewsCount: 2105, lastUpdated: '1 мин назад' },
  '4': { rating: 4.8, reviewsCount: 3421, lastUpdated: 'сейчас' },
};

// Отзывы из Яндекс Карт (симуляция)
export const yandexReviews: YandexReview[] = [
  {
    id: 'ya-1',
    author: 'Алексей М.',
    avatar: '👤',
    stationId: '1',
    rating: 5,
    text: 'Отличная заправка! Всегда чисто, быстрый сервис. Smart Slots — это просто спасение, больше не стою в очередях.',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 42,
  },
  {
    id: 'ya-2',
    author: 'Ирина К.',
    avatar: '👤',
    stationId: '1',
    rating: 4,
    text: 'Хорошая АЗС, удобная навигация через бота. Единственное — хотелось бы больше слотов в час пик.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 28,
  },
  {
    id: 'ya-3',
    author: 'Дмитрий В.',
    avatar: '👤',
    stationId: '2',
    rating: 4,
    text: 'Нормальная заправка. Бот помогает выбрать лучшее время, очереди стали меньше.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 15,
  },
  {
    id: 'ya-4',
    author: 'Ольга С.',
    avatar: '👤',
    stationId: '2',
    rating: 3,
    text: 'Бывает очередь, но с Smart Slots стало лучше. Персонал вежливый.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 9,
  },
  {
    id: 'ya-5',
    author: 'Сергей П.',
    avatar: '👤',
    stationId: '3',
    rating: 3,
    text: 'Часто бывают очереди. Колонки старые, но топливо качественное. Бот реально помогает.',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 22,
  },
  {
    id: 'ya-6',
    author: 'Наталья Р.',
    avatar: '👤',
    stationId: '3',
    rating: 4,
    text: 'С приложением стало намного удобнее! Не трачу время на ожидание.',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 18,
  },
  {
    id: 'ya-7',
    author: 'Андрей Л.',
    avatar: '👤',
    stationId: '4',
    rating: 5,
    text: 'Лучшая АЗС в городе! Всегда свободные слоты, быстрое обслуживание. Рекомендую всем!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 56,
  },
  {
    id: 'ya-8',
    author: 'Елена Т.',
    avatar: '👤',
    stationId: '4',
    rating: 5,
    text: 'Пользуюсь Smart Slots уже месяц — экономия времени колоссальная! Спасибо разработчикам.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    source: 'yandex',
    helpful: 41,
  },
];

export const stations: StationCard[] = [
  {
    id: '1',
    name: 'Max Fuel #1',
    address: 'ул. Ленина, 45',
    loadLevel: 'low',
    queueCount: 2,
    avgWaitMinutes: 3,
    distance: '1.2 км',
    rating: 4.8,
    reviewsCount: 156,
    yandexRating: yandexRatings['1'].rating,
    yandexReviewsCount: yandexRatings['1'].reviewsCount,
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
    rating: 4.3,
    reviewsCount: 89,
    yandexRating: yandexRatings['2'].rating,
    yandexReviewsCount: yandexRatings['2'].reviewsCount,
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
    rating: 3.9,
    reviewsCount: 234,
    yandexRating: yandexRatings['3'].rating,
    yandexReviewsCount: yandexRatings['3'].reviewsCount,
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
    rating: 4.9,
    reviewsCount: 312,
    yandexRating: yandexRatings['4'].rating,
    yandexReviewsCount: yandexRatings['4'].reviewsCount,
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

// Живые сообщения от водителей на АЗС (симуляция реалтайм-чата)
export const stationChatMessages: ChatRoomMessage[] = [
  {
    id: '1',
    author: 'Дмитрий К.',
    avatar: '🚗',
    text: 'Колонка №3 работает, очередь двигается быстро',
    timestamp: new Date(Date.now() - 2 * 60000),
    type: 'message',
    stationId: '1',
  },
  {
    id: '2',
    author: 'Елена М.',
    avatar: '🚙',
    text: 'Заправились за 5 минут, рекомендую!',
    timestamp: new Date(Date.now() - 5 * 60000),
    type: 'message',
    stationId: '1',
  },
  {
    id: '3',
    author: 'Система',
    avatar: '⚡',
    text: 'Свободных слотов на ближайшие 10 минут: 4',
    timestamp: new Date(Date.now() - 1 * 60000),
    type: 'status_update',
    stationId: '1',
  },
  {
    id: '4',
    author: 'Игорь В.',
    avatar: '🚕',
    text: 'Очередь большая, но движется. Минут 15 подождать',
    timestamp: new Date(Date.now() - 3 * 60000),
    type: 'message',
    stationId: '2',
  },
  {
    id: '5',
    author: 'Анна С.',
    avatar: '🚐',
    text: 'Кто-нибудь знает, ДТ есть?',
    timestamp: new Date(Date.now() - 7 * 60000),
    type: 'message',
    stationId: '2',
  },
  {
    id: '6',
    author: 'Система',
    avatar: '⚠️',
    text: 'Внимание: колонка №2 временно не работает',
    timestamp: new Date(Date.now() - 10 * 60000),
    type: 'alert',
    stationId: '3',
  },
  {
    id: '7',
    author: 'Максим Р.',
    avatar: '🏎️',
    text: 'Очень долго, лучше на другую АЗС',
    timestamp: new Date(Date.now() - 4 * 60000),
    type: 'message',
    stationId: '3',
  },
  {
    id: '8',
    author: 'Ольга Т.',
    avatar: '🚗',
    text: 'Свободно, заправилась моментально!',
    timestamp: new Date(Date.now() - 1 * 60000),
    type: 'message',
    stationId: '4',
  },
];

// Отзывы водителей (внутренние)
export const stationReviews: Review[] = [
  {
    id: '1',
    author: 'Виктор П.',
    avatar: '👨',
    stationId: '1',
    rating: 5,
    text: 'Отличная заправка! Всегда чисто, персонал вежливый. Smart Slots реально работают — приезжаю точно ко времени.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    helpful: 24,
  },
  {
    id: '2',
    author: 'Мария К.',
    avatar: '👩',
    stationId: '1',
    rating: 5,
    text: 'Лучшая АЗС в районе! Удобно что можно посмотреть очередь заранее.',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    helpful: 18,
  },
  {
    id: '3',
    author: 'Сергей Л.',
    avatar: '👨',
    stationId: '2',
    rating: 4,
    text: 'Нормальная заправка, но в часы пик бывает очередь. Советую бронировать слот заранее.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    helpful: 12,
  },
  {
    id: '4',
    author: 'Татьяна Н.',
    avatar: '👩',
    stationId: '3',
    rating: 3,
    text: 'Часто бывают очереди. Колонки старые, но топливо качественное.',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    helpful: 8,
  },
  {
    id: '5',
    author: 'Андрей В.',
    avatar: '👨',
    stationId: '4',
    rating: 5,
    text: 'Идеальное место! Всегда свободные слоты, быстрое обслуживание. Рекомендую!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    helpful: 31,
  },
];

// Генерация Smart Slots для станции
export const generateSmartSlots = (stationId: string): SmartSlot[] => {
  const station = stations.find(s => s.id === stationId);
  if (!station) return [];

  const slots: SmartSlot[] = [];
  const now = new Date();
  
  for (let i = 0; i < 8; i++) {
    const slotTime = new Date(now.getTime() + (i + 1) * 3 * 60000);
    const isAvailable = Math.random() > 0.3;
    const carsInSlot = isAvailable ? Math.floor(Math.random() * 2) : 0;
    
    slots.push({
      number: i + 1,
      time: slotTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      available: isAvailable,
      carsInSlot,
    });
  }

  return slots;
};

// Получить лучшую АЗС по рейтингу и загруженности
export const getBestStation = (): StationCard => {
  return [...stations].sort((a, b) => {
    const scoreA = a.yandexRating * 10 - a.queueCount * 2;
    const scoreB = b.yandexRating * 10 - b.queueCount * 2;
    return scoreB - scoreA;
  })[0];
};
