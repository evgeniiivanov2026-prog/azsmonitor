import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, BotState, StationCard, OrderCard, ChatRoomMessage, Review, SmartSlot } from '../types';
import { stations, userBalance, userBonusPoints, userName, stationChatMessages, stationReviews, generateSmartSlots } from '../data';

const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [botState, setBotState] = useState<BotState>('idle');
  const [selectedStation, setSelectedStation] = useState<StationCard | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [selectedLiters, setSelectedLiters] = useState<number>(0);
  const [activeOrders, setActiveOrders] = useState<OrderCard[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SmartSlot | null>(null);
  const [userReview, setUserReview] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      addBotMessage(
        `Привет, ${userName}! 👋\n\nЯ — бот сети АЗС **Max Fuel** с инновационной системой **Smart Slots** 🚀\n\nПомогу заправиться быстро и без очередей!\n\nЧто хотите сделать?`,
        [
          { buttons: [{ label: '⛽ Заправить авто', action: 'refuel', style: 'primary' }] },
          { buttons: [
            { label: '📍 Найти АЗС', action: 'find_station' },
            { label: '📋 Мои заказы', action: 'my_orders' },
          ]},
          { buttons: [
            { label: '💬 Чат водителей', action: 'drivers_chat' },
            { label: '⭐ Отзывы', action: 'reviews' },
          ]},
          { buttons: [
            { label: '💳 Баланс', action: 'balance' },
            { label: '🚀 Как работает Smart Slots?', action: 'how_smart_slots' },
          ]},
        ]
      );
      setBotState('choosing_action');
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const addBotMessage = useCallback((text: string, buttons?: ChatMessage['buttons'], extra?: Partial<ChatMessage>) => {
    setIsTyping(true);
    const delay = Math.min(600 + text.length * 10, 1500);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: generateId(),
        sender: 'bot',
        text,
        buttons,
        timestamp: new Date(),
        ...extra,
      }]);
    }, delay);
  }, []);

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: generateId(),
      sender: 'user',
      text,
      timestamp: new Date(),
    }]);
  };

  const handleAction = (action: string, label: string) => {
    addUserMessage(label);

    if (action.startsWith('select_station_')) {
      handleSelectStation(action.replace('select_station_', ''));
      return;
    }
    if (action.startsWith('fuel_')) {
      handleSelectFuel(action.replace('fuel_', ''));
      return;
    }
    if (action.startsWith('liters_')) {
      const liters = parseInt(action.replace('liters_', ''));
      handleSelectLiters(liters);
      return;
    }
    if (action.startsWith('slot_')) {
      const slotNum = parseInt(action.replace('slot_', ''));
      handleSelectSlot(slotNum);
      return;
    }
    if (action.startsWith('chat_')) {
      handleOpenStationChat(action.replace('chat_', ''));
      return;
    }
    if (action.startsWith('review_')) {
      handleOpenReviews(action.replace('review_', ''));
      return;
    }
    if (action.startsWith('rate_')) {
      const rating = parseInt(action.replace('rate_', ''));
      setUserRating(rating);
      addBotMessage(`Вы поставили ${'⭐'.repeat(rating)}. Напишите ваш отзыв:`, [
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]);
      return;
    }
    if (action.startsWith('yield_')) {
      handleYieldPosition(action.replace('yield_', ''));
      return;
    }

    switch (action) {
      case 'refuel':
        handleRefuel();
        break;
      case 'find_station':
        handleFindStation();
        break;
      case 'my_orders':
        handleMyOrders();
        break;
      case 'balance':
        handleBalance();
        break;
      case 'how_smart_slots':
        handleHowSmartSlots();
        break;
      case 'drivers_chat':
        handleDriversChat();
        break;
      case 'reviews':
        handleReviewsList();
        break;
      case 'back_to_menu':
        handleBackToMenu();
        break;
      case 'confirm_order':
        handleConfirmOrder();
        break;
      case 'pay_balance':
        handlePayment('balance');
        break;
      case 'pay_card':
        handlePayment('card');
        break;
      case 'pay_bonus':
        handlePayment('bonus');
        break;
      case 'cancel_order':
        handleCancelOrder();
        break;
      case 'show_qr':
        handleShowQR();
        break;
      case 'change_station':
        handleRefuel();
        break;
      case 'send_message':
        handleSendMessage();
        break;
      case 'submit_review':
        handleSubmitReview();
        break;
      default:
        addBotMessage('Извините, не понял команду. Попробуйте выбрать из кнопок ниже 👇', [
          { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu', style: 'primary' }] },
        ]);
    }
  };

  const handleRefuel = () => {
    setBotState('choosing_station');
    addBotMessage(
      '📍 Вот ближайшие АЗС Max Fuel с актуальной загруженностью:\n\n' +
      '🟢 Свободно • 🟡 Средняя • 🔴 Большая очередь\n\n' +
      '💡 **Рекомендация:** Max Fuel #4 — всего 1 авто!',
      [
        { buttons: [{ label: '✅ Max Fuel #4 (1 авто, 2 мин)', action: 'select_station_4', style: 'primary' }] },
        { buttons: [
          { label: 'Max Fuel #1 (2 авто, 3 мин)', action: 'select_station_1' },
          { label: 'Max Fuel #2 (7 авто, 12 мин)', action: 'select_station_2' },
        ]},
        { buttons: [{ label: 'Max Fuel #3 (15 авто, 25 мин)', action: 'select_station_3' }] },
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleFindStation = () => {
    addBotMessage(
      '🗺️ **АЗС Max Fuel рядом с вами:**\n\n' +
      stations.map(s => {
        const icon = s.loadLevel === 'low' ? '🟢' : s.loadLevel === 'medium' ? '🟡' : '🔴';
        return `${icon} **${s.name}** — ${s.address}\n   📏 ${s.distance} • 🚗 ${s.queueCount} авто • ⏱ ~${s.avgWaitMinutes} мин\n   ⭐ ${s.rating} (${s.reviewsCount} отзывов)`;
      }).join('\n\n'),
      [
        { buttons: [{ label: '⛽ Заправиться', action: 'refuel', style: 'primary' }] },
        { buttons: [
          { label: '💬 Чат водителей', action: 'drivers_chat' },
          { label: '⭐ Отзывы', action: 'reviews' },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleSelectStation = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;
    
    setSelectedStation(station);
    setBotState('choosing_fuel');

    const loadIcon = station.loadLevel === 'low' ? '🟢' : station.loadLevel === 'medium' ? '🟡' : '🔴';
    
    const fuelButtons: { buttons: { label: string; action: string; style?: 'primary' | 'secondary' | 'danger' }[] }[] = station.fuelTypes.map(fuel => {
      const fuelKey = fuel.type === 'ДТ' ? 'dt' : fuel.type.replace('АИ-', '');
      return {
        buttons: [{
          label: `${fuel.type} — ${fuel.price} ₽/л${fuel.available ? '' : ' ❌ нет'}`,
          action: `fuel_${fuelKey}`,
          style: 'secondary' as const,
        }]
      };
    });
    fuelButtons.push({ buttons: [{ label: '↩️ Выбрать другую АЗС', action: 'refuel' }] });

    addBotMessage(
      `${loadIcon} Вы выбрали **${station.name}**\n📍 ${station.address}\n🚗 В очереди: ${station.queueCount} авто (~${station.avgWaitMinutes} мин)\n⭐ ${station.rating}/5 (${station.reviewsCount} отзывов)\n\nВыберите тип топлива:`,
      fuelButtons
    );
  };

  const handleSelectFuel = (fuelType: string) => {
    const station = selectedStation;
    if (!station) return;

    const fuelKeyMap: { [key: string]: string } = { '92': 'АИ-92', '95': 'АИ-95', '98': 'АИ-98', 'dt': 'ДТ' };
    const actualFuelType = fuelKeyMap[fuelType] || fuelType;
    const fuel = station.fuelTypes.find(f => f.type === actualFuelType);
    
    if (!fuel || !fuel.available) {
      addBotMessage('❌ К сожалению, это топливо сейчас недоступно. Выберите другое:', [
        { buttons: [{ label: '↩️ Выбрать другое топливо', action: 'refuel' }] },
      ]);
      return;
    }

    setSelectedFuel(actualFuelType);
    setBotState('choosing_liters');

    addBotMessage(
      `⛽ Отлично! **${actualFuelType}** по цене ${fuel.price} ₽/л\n\nСколько литров заправить?`,
      [
        { buttons: [
          { label: '20 л', action: 'liters_20' },
          { label: '30 л', action: 'liters_30' },
          { label: '40 л', action: 'liters_40' },
        ]},
        { buttons: [
          { label: '50 л', action: 'liters_50' },
          { label: '✏️ Другое кол-во', action: 'liters_60' },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'refuel' }] },
      ]
    );
  };

  const handleSelectLiters = (liters: number) => {
    if (!selectedStation || !selectedFuel) return;

    setSelectedLiters(liters);
    setBotState('viewing_smart_slots');

    // Показываем Smart Slots
    const slots = generateSmartSlots(selectedStation.id);
    const availableSlots = slots.filter(s => s.available);

    const slotButtons: { buttons: { label: string; action: string; style?: 'primary' | 'secondary' | 'danger' }[] }[] = slots.slice(0, 5).map(slot => ({
      buttons: [{
        label: `${slot.available ? '✅' : '❌'} ${slot.time} (${slot.carsInSlot} авто)`,
        action: slot.available ? `slot_${slot.number}` : 'back_to_menu',
        style: 'secondary' as const,
      }]
    }));
    slotButtons.push({ buttons: [{ label: '↩️ Назад', action: 'refuel' }] });

    addBotMessage(
      `🚀 **Smart Slots** — инновационная система распределения!\n\n` +
      `Выберите удобный временной слот прибытия (каждые 3 минуты):\n\n` +
      `📦 Объём: **${liters} л ${selectedFuel}**\n` +
      `💰 Стоимость: **${(selectedStation.fuelTypes.find(f => f.type === selectedFuel)?.price || 0) * liters} ₽**\n\n` +
      `Доступно слотов: **${availableSlots.length}/${slots.length}**`,
      slotButtons
    );
  };

  const handleSelectSlot = (slotNumber: number) => {
    if (!selectedStation || !selectedFuel || !selectedLiters) return;

    const slots = generateSmartSlots(selectedStation.id);
    const slot = slots.find(s => s.number === slotNumber);
    if (!slot) return;

    setSelectedSlot(slot);
    setBotState('confirming_order');

    const fuel = selectedStation.fuelTypes.find(f => f.type === selectedFuel);
    const total = fuel ? fuel.price * selectedLiters : 0;

    addBotMessage(
      `📋 **Ваш заказ с Smart Slot:**\n\n` +
      `🏢 Станция: **${selectedStation.name}**\n` +
      `📍 ${selectedStation.address}\n` +
      `⛽ Топливо: **${selectedFuel}**\n` +
      `📦 Объём: **${selectedLiters} л**\n` +
      `🕐 Слот прибытия: **${slot.time}**\n` +
      `━━━━━━━━━━━━━━━\n` +
      `💳 **Итого: ${total.toFixed(0)} ₽**\n\n` +
      `🚗 Ваша позиция: **#${slot.carsInSlot + 1}** в слоте\n` +
      `⏱ Ожидание: **~2-3 мин** (вместо ${selectedStation.avgWaitMinutes} мин!)\n\n` +
      `✨ **Экономия времени: ${Math.max(0, selectedStation.avgWaitMinutes - 3)} мин!**\n\n` +
      `Подтверждаете заказ?`,
      [
        { buttons: [
          { label: '✅ Подтвердить', action: 'confirm_order', style: 'primary' },
          { label: '❌ Отменить', action: 'cancel_order' },
        ]},
      ]
    );
  };

  const handleConfirmOrder = () => {
    if (!selectedStation || !selectedFuel || !selectedLiters || !selectedSlot) return;

    const fuel = selectedStation.fuelTypes.find(f => f.type === selectedFuel);
    const total = fuel ? fuel.price * selectedLiters : 0;

    addBotMessage(
      `💳 Выберите способ оплаты:\n\n` +
      `💼 Баланс: **${userBalance.toLocaleString()} ₽**\n` +
      `🪙 Бонусы: **${userBonusPoints} баллов** (≈${Math.floor(userBonusPoints / 10)} ₽)`,
      [
        { buttons: [{ label: `💼 С баланса (${userBalance.toLocaleString()} ₽)`, action: 'pay_balance', style: 'primary' }] },
        { buttons: [{ label: '💳 Банковская карта', action: 'pay_card' }] },
        { buttons: [{ label: `🪙 Оплатить бонусами`, action: 'pay_bonus' }] },
        { buttons: [{ label: '↩️ Отменить', action: 'cancel_order' }] },
      ]
    );
  };

  const handlePayment = (method: string) => {
    if (!selectedStation || !selectedFuel || !selectedLiters || !selectedSlot) return;

    const fuel = selectedStation.fuelTypes.find(f => f.type === selectedFuel);
    const total = fuel ? fuel.price * selectedLiters : 0;

    const order: OrderCard = {
      id: `MF-${Date.now().toString(36).toUpperCase()}`,
      stationId: selectedStation.id,
      stationName: selectedStation.name,
      fuelType: selectedFuel,
      liters: selectedLiters,
      totalPrice: total,
      queueNumber: selectedSlot.carsInSlot + 1,
      estimatedMinutes: 3,
      status: 'confirmed',
      qrCode: `MAX-${Date.now()}`,
      slotTime: selectedSlot.time,
      slotNumber: selectedSlot.number,
    };

    setActiveOrders(prev => [...prev, order]);

    const methodText = method === 'balance' ? '💼 с баланса' : method === 'card' ? '💳 банковской картой' : '🪙 бонусами';

    addBotMessage(
      `✅ **Заказ оплачен** (${methodText})!\n\n` +
      `🎫 Номер: **${order.id}**\n` +
      `🏢 ${order.stationName}\n` +
      `⛽ ${order.fuelType}, ${order.liters} л\n` +
      `💰 ${order.totalPrice.toFixed(0)} ₽\n` +
      `🕐 Слот: **${order.slotTime}**\n\n` +
      `📍 Ваша позиция: **#${order.queueNumber}** в слоте\n` +
      `⏱ Приезжайте к **${order.slotTime}** — ожидание ~2 мин!\n\n` +
      `🚀 **Smart Slots сэкономили вам ${selectedStation.avgWaitMinutes - 3} мин!**\n\n` +
      `Я уведомлю вас, когда подойдёт ваша очередь! 🔔`,
      [
        { buttons: [{ label: '📱 Показать QR-код', action: 'show_qr', style: 'primary' }] },
        { buttons: [
          { label: '💬 Чат АЗС', action: `chat_${selectedStation.id}` },
          { label: '📋 Мои заказы', action: 'my_orders' },
        ]},
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
      ]
    );

    setBotState('order_created');

    // Simulate queue progress
    setTimeout(() => {
      addBotMessage(
        `🔔 **Уведомление:**\n\n` +
        `Ваш слот на **${order.stationName}** через **2 минуты**!\n\n` +
        `🕐 Время прибытия: **${order.slotTime}**\n` +
        `📍 Позиция: **#1** в слоте\n\n` +
        `Подъезжайте к колонке! Покажите QR-код оператору.`,
        [
          { buttons: [{ label: '📱 Показать QR-код', action: 'show_qr', style: 'primary' }] },
          { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
        ]
      );
    }, 15000);
  };

  const handleShowQR = () => {
    const order = activeOrders[activeOrders.length - 1];
    if (!order) {
      addBotMessage('У вас нет активных заказов.', [
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
      ]);
      return;
    }

    addBotMessage(
      `📱 **QR-код для заправки**\n\n` +
      `Покажите этот код на АЗС **${order.stationName}**\n` +
      `Заказ: ${order.id} • ${order.fuelType} ${order.liters}л\n` +
      `Слот: ${order.slotTime}`,
      [
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
      ],
      { qrCode: order.qrCode }
    );
  };

  const handleMyOrders = () => {
    setBotState('viewing_queue');
    if (activeOrders.length === 0) {
      addBotMessage(
        '📋 У вас пока нет активных заказов.\n\nСоздайте предзаказ с Smart Slots, чтобы заправиться без ожидания!',
        [
          { buttons: [{ label: '⛽ Заправить авто', action: 'refuel', style: 'primary' }] },
          { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
        ]
      );
    } else {
      const ordersText = activeOrders.map(o => 
        `🎫 **${o.id}** — ${o.stationName}\n   ⛽ ${o.fuelType}, ${o.liters}л • 💰 ${o.totalPrice.toFixed(0)} ₽\n   🕐 Слот: ${o.slotTime} • 📍 Позиция: #${o.queueNumber}`
      ).join('\n\n');

      addBotMessage(
        `📋 **Ваши активные заказы:**\n\n${ordersText}`,
        [
          { buttons: [{ label: '📱 QR-код последнего', action: 'show_qr', style: 'primary' }] },
          { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
        ]
      );
    }
  };

  const handleBalance = () => {
    addBotMessage(
      `💳 **Ваш баланс и бонусы:**\n\n` +
      `💼 Баланс: **${userBalance.toLocaleString()} ₽**\n` +
      `🪙 Бонусные баллы: **${userBonusPoints}**\n` +
      `   (≈${Math.floor(userBonusPoints / 10)} ₽)\n\n` +
      `🏆 Ваш уровень: **Gold** 🥇\n` +
      `📊 Заправок: 67 • ⛽ Литров: 2 840\n\n` +
      `💡 Используйте Smart Slots и получайте дополнительные бонусы за пунктуальность!`,
      [
        { buttons: [{ label: '💼 Пополнить баланс', action: 'back_to_menu', style: 'primary' }] },
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleHowSmartSlots = () => {
    addBotMessage(
      `🚀 **Как работает Smart Slots?**\n\n` +
      `Это инновационная система распределения времени прибытия на АЗС:\n\n` +
      `1️⃣ **Временные слоты** — бот создаёт слоты каждые 3 минуты\n\n` +
      `2️⃣ **Равномерное распределение** — машины не скапливаются в очереди\n\n` +
      `3️⃣ **Точное время** — вы приезжаете ровно к своему слоту\n\n` +
      `4️⃣ **Минимальное ожидание** — 2-3 минуты вместо 15-25!\n\n` +
      `5️⃣ **Бонусы за пунктуальность** — +50 баллов за прибытие вовремя\n\n` +
      `📊 **Результат:**\n` +
      `• Очереди сократились на **70%**\n` +
      `• Среднее ожидание: **3 мин** вместо **15 мин**\n` +
      `• Пропускная способность АЗС выросла на **40%**\n\n` +
      `💡 **Дополнительные фичи:**\n` +
      `• 💬 Живой чат водителей — актуальная информация с АЗС\n` +
      `• ⭐ Отзывы и рейтинги — выбирайте лучшие АЗС\n` +
      `• 🤝 Система "Уступи место" — получайте бонусы за помощь другим`,
      [
        { buttons: [{ label: '⛽ Попробовать Smart Slots', action: 'refuel', style: 'primary' }] },
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleDriversChat = () => {
    addBotMessage(
      '💬 **Выберите АЗС для просмотра чата водителей:**\n\n' +
      'Здесь водители делятся актуальной информацией о ситуации на АЗС в реальном времени!',
      [
        { buttons: [
          { label: '💬 Max Fuel #1', action: 'chat_1', style: 'primary' },
          { label: '💬 Max Fuel #2', action: 'chat_2' },
        ]},
        { buttons: [
          { label: '💬 Max Fuel #3', action: 'chat_3' },
          { label: '💬 Max Fuel #4', action: 'chat_4' },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleOpenStationChat = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    setSelectedStation(station);
    setBotState('station_chat');

    const chatMsgs = stationChatMessages.filter(m => m.stationId === stationId);
    
    let chatText = `💬 **Чат водителей — ${station.name}**\n📍 ${station.address}\n\n`;
    
    chatMsgs.slice(-5).forEach(msg => {
      const time = msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
      if (msg.type === 'alert') {
        chatText += `⚠️ **${msg.author}** [${time}]:\n${msg.text}\n\n`;
      } else if (msg.type === 'status_update') {
        chatText += `⚡ **${msg.author}** [${time}]:\n${msg.text}\n\n`;
      } else {
        chatText += `${msg.avatar} **${msg.author}** [${time}]:\n${msg.text}\n\n`;
      }
    });

    addBotMessage(
      chatText + 'Хотите написать сообщение или задать вопрос водителям?',
      [
        { buttons: [{ label: '✏️ Написать сообщение', action: 'send_message', style: 'primary' }] },
        { buttons: [
          { label: '⛽ Заправиться здесь', action: `select_station_${stationId}` },
          { label: '⭐ Отзывы', action: `review_${stationId}` },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleSendMessage = () => {
    if (!selectedStation) return;

    addBotMessage(
      `✏️ Напишите ваше сообщение для чата **${selectedStation.name}**:\n\n` +
      `(В реальном приложении здесь будет поле ввода текста)`,
      [
        { buttons: [
          { label: '👍 Очередь двигается быстро', action: 'back_to_menu' },
          { label: '⚠️ Большая очередь', action: 'back_to_menu' },
        ]},
        { buttons: [
          { label: '⛽ Колонка свободна', action: 'back_to_menu' },
          { label: '❌ Колонка не работает', action: 'back_to_menu' },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleReviewsList = () => {
    addBotMessage(
      '⭐ **Выберите АЗС для просмотра отзывов:**',
      [
        { buttons: [
          { label: `⭐ Max Fuel #1 (${stations[0].rating})`, action: 'review_1', style: 'primary' },
          { label: `⭐ Max Fuel #2 (${stations[1].rating})`, action: 'review_2' },
        ]},
        { buttons: [
          { label: `⭐ Max Fuel #3 (${stations[2].rating})`, action: 'review_3' },
          { label: `⭐ Max Fuel #4 (${stations[3].rating})`, action: 'review_4' },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleOpenReviews = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (!station) return;

    setSelectedStation(station);
    setBotState('writing_review');

    const reviews = stationReviews.filter(r => r.stationId === stationId);
    
    let reviewsText = `⭐ **Отзывы — ${station.name}**\n`;
    reviewsText += `Рейтинг: **${station.rating}/5** (${station.reviewsCount} отзывов)\n\n`;
    
    reviews.slice(0, 3).forEach(review => {
      const stars = '⭐'.repeat(review.rating);
      const date = review.timestamp.toLocaleDateString('ru-RU');
      reviewsText += `${review.avatar} **${review.author}** ${stars}\n`;
      reviewsText += `📅 ${date} • 👍 ${review.helpful}\n`;
      reviewsText += `${review.text}\n\n`;
    });

    addBotMessage(
      reviewsText + 'Хотите оставить свой отзыв?',
      [
        { buttons: [{ label: '✏️ Написать отзыв', action: 'submit_review', style: 'primary' }] },
        { buttons: [
          { label: '💬 Чат водителей', action: `chat_${stationId}` },
          { label: '⛽ Заправиться', action: `select_station_${stationId}` },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleSubmitReview = () => {
    if (!selectedStation) return;

    addBotMessage(
      `✏️ **Оставить отзыв о ${selectedStation.name}:**\n\n` +
      `Выберите оценку:`,
      [
        { buttons: [
          { label: '⭐', action: 'rate_1' },
          { label: '⭐⭐', action: 'rate_2' },
          { label: '⭐⭐⭐', action: 'rate_3' },
        ]},
        { buttons: [
          { label: '⭐⭐⭐⭐', action: 'rate_4' },
          { label: '⭐⭐⭐⭐⭐', action: 'rate_5', style: 'primary' },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleYieldPosition = (orderId: string) => {
    const order = activeOrders.find(o => o.id === orderId);
    if (!order) return;

    addBotMessage(
      `🤝 **Система "Уступи место"**\n\n` +
      `Вы можете уступить свою позицию в очереди другому водителю и получить бонусы!\n\n` +
      `🎫 Заказ: **${order.id}**\n` +
      `📍 ${order.stationName}\n` +
      `🕐 Слот: ${order.slotTime}\n\n` +
      `💎 **Награда:** +100 бонусных баллов\n\n` +
      `Подтверждаете?`,
      [
        { buttons: [
          { label: '✅ Да, уступить', action: 'back_to_menu', style: 'primary' },
          { label: '❌ Нет, оставить', action: 'back_to_menu' },
        ]},
      ]
    );
  };

  const handleCancelOrder = () => {
    addBotMessage(
      '❌ Заказ отменён. Возврат средств будет обработан в течение 5 минут.\n\nЧем ещё могу помочь?',
      [
        { buttons: [{ label: '⛽ Заправить авто', action: 'refuel', style: 'primary' }] },
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
      ]
    );
    setBotState('choosing_action');
  };

  const handleBackToMenu = () => {
    setBotState('choosing_action');
    setSelectedStation(null);
    setSelectedFuel('');
    setSelectedLiters(0);
    setSelectedSlot(null);

    addBotMessage(
      '🏠 Главное меню. Что хотите сделать?',
      [
        { buttons: [{ label: '⛽ Заправить авто', action: 'refuel', style: 'primary' }] },
        { buttons: [
          { label: '📍 Найти АЗС', action: 'find_station' },
          { label: '📋 Мои заказы', action: 'my_orders' },
        ]},
        { buttons: [
          { label: '💬 Чат водителей', action: 'drivers_chat' },
          { label: '⭐ Отзывы', action: 'reviews' },
        ]},
        { buttons: [
          { label: '💳 Баланс', action: 'balance' },
          { label: '🚀 Как работает Smart Slots?', action: 'how_smart_slots' },
        ]},
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const renderQRCode = (code: string) => {
    const cells = [];
    const seed = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    for (let i = 0; i < 225; i++) {
      const val = (seed * (i + 1) * 7 + i * 13) % 100;
      cells.push(val > 40);
    }

    return (
      <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
        <div className="grid gap-0 mx-auto w-[180px] h-[180px]" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
          {cells.map((filled, i) => (
            <div key={i} className={`w-full aspect-square ${filled ? 'bg-gray-900' : 'bg-white'}`}></div>
          ))}
        </div>
        <div className="text-center mt-3">
          <div className="text-xs text-gray-500 font-mono">{code}</div>
        </div>
      </div>
    );
  };

  const renderMessage = (msg: ChatMessage) => {
    const isBot = msg.sender === 'bot';

    return (
      <div key={msg.id} className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3 animate-fadeIn`}>
        <div className={`max-w-[85%] ${isBot ? 'order-1' : 'order-1'}`}>
          {isBot && (
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <i className="fas fa-gas-pump text-white text-[8px]"></i>
              </div>
              <span className="text-xs text-gray-500 font-medium">Max Fuel Bot</span>
              <span className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</span>
            </div>
          )}
          
          <div className={`rounded-2xl px-4 py-2.5 ${
            isBot 
              ? 'bg-white border border-gray-200 text-gray-800 shadow-sm' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
          }`}>
            {msg.text && (
              <div className="text-sm leading-relaxed whitespace-pre-line">
                {msg.text.split('**').map((part, i) => 
                  i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                )}
              </div>
            )}

            {msg.qrCode && (
              <div className="mt-3">
                {renderQRCode(msg.qrCode)}
              </div>
            )}
          </div>

          {msg.buttons && msg.buttons.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {msg.buttons.map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-wrap gap-1.5">
                  {row.buttons.map((btn, btnIdx) => (
                    <button
                      key={btnIdx}
                      onClick={() => handleAction(btn.action, btn.label)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${
                        btn.style === 'primary'
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg'
                          : btn.style === 'danger'
                          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#e8e3de]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
          <i className="fas fa-gas-pump text-white text-sm"></i>
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800 text-sm">Max Fuel Bot</h1>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
            онлайн • Smart Slots активны
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
            <i className="fas fa-search text-sm"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
            <i className="fas fa-ellipsis-v text-sm"></i>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex justify-center mb-4">
          <span className="bg-white/80 text-gray-500 text-[10px] px-3 py-1 rounded-full shadow-sm">
            Сегодня
          </span>
        </div>

        {messages.map(renderMessage)}

        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <i className="fas fa-paperclip"></i>
          </button>
          <div className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 flex items-center">
            <span className="text-sm text-gray-400">Используйте кнопки для взаимодействия...</span>
          </div>
          <button className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <i className="fas fa-microphone"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
