import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, BotState, StationCard, OrderCard } from '../types';
import { stations, userBalance, userBonusPoints, userName } from '../data';

const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

export const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [botState, setBotState] = useState<BotState>('idle');
  const [selectedStation, setSelectedStation] = useState<StationCard | null>(null);
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [selectedLiters, setSelectedLiters] = useState<number>(0);
  const [activeOrders, setActiveOrders] = useState<OrderCard[]>([]);
  const [isTyping, setIsTyping] = useState(false);
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
        `Привет, ${userName}! 👋\n\nЯ — бот сети АЗС **Max Fuel**. Помогу заправиться быстро и без очередей!\n\nЧто хотите сделать?`,
        [
          { buttons: [
            { label: '⛽ Заправить авто', action: 'refuel', style: 'primary' },
          ]},
          { buttons: [
            { label: '📍 Найти АЗС', action: 'find_station' },
            { label: '📋 Мои заказы', action: 'my_orders' },
          ]},
          { buttons: [
            { label: '💳 Баланс и бонусы', action: 'balance' },
            { label: 'ℹ️ Как это работает', action: 'how_it_works' },
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
      case 'how_it_works':
        handleHowItWorks();
        break;
      case 'back_to_menu':
        handleBackToMenu();
        break;
      case 'select_station_1':
      case 'select_station_2':
      case 'select_station_3':
      case 'select_station_4':
        handleSelectStation(action.replace('select_station_', ''));
        break;
      case 'fuel_92':
        handleSelectFuel('АИ-92');
        break;
      case 'fuel_95':
        handleSelectFuel('АИ-95');
        break;
      case 'fuel_98':
        handleSelectFuel('АИ-98');
        break;
      case 'fuel_dt':
        handleSelectFuel('ДТ');
        break;
      case 'liters_20':
        handleSelectLiters(20);
        break;
      case 'liters_30':
        handleSelectLiters(30);
        break;
      case 'liters_40':
        handleSelectLiters(40);
        break;
      case 'liters_50':
        handleSelectLiters(50);
        break;
      case 'liters_custom':
        addBotMessage('Введите нужное количество литров числом:', [
          { buttons: [{ label: '↩️ Назад', action: 'back_to_menu' }] },
        ]);
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
      default:
        addBotMessage('Извините, не понял команду. Попробуйте выбрать из кнопок ниже 👇', [
          { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu', style: 'primary' }] },
        ]);
    }
  };

  const handleRefuel = () => {
    setBotState('choosing_station');
    addBotMessage(
      '📍 Вот ближайшие АЗС Max Fuel. Зелёный — свободно, жёлтый — средняя загрузка, красный — большая очередь:\n\nРекомендую **Max Fuel #4** — всего 1 авто в очереди!',
      [
        { buttons: [
          { label: '✅ Max Fuel #4 (1 авто, 2 мин)', action: 'select_station_4', style: 'primary' },
        ]},
        { buttons: [
          { label: 'Max Fuel #1 (2 авто, 3 мин)', action: 'select_station_1' },
        ]},
        { buttons: [
          { label: 'Max Fuel #2 (7 авто, 12 мин)', action: 'select_station_2' },
          { label: 'Max Fuel #3 (15 авто, 25 мин)', action: 'select_station_3' },
        ]},
        { buttons: [
          { label: '↩️ Назад', action: 'back_to_menu' },
        ]},
      ]
    );
  };

  const handleFindStation = () => {
    addBotMessage(
      '🗺️ **АЗС Max Fuel рядом с вами:**\n\n' +
      stations.map(s => {
        const icon = s.loadLevel === 'low' ? '🟢' : s.loadLevel === 'medium' ? '🟡' : '🔴';
        return `${icon} **${s.name}** — ${s.address}\n   📏 ${s.distance} • 🚗 ${s.queueCount} авто • ⏱ ~${s.avgWaitMinutes} мин`;
      }).join('\n\n'),
      [
        { buttons: [{ label: '⛽ Заправиться', action: 'refuel', style: 'primary' }] },
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
      `${loadIcon} Вы выбрали **${station.name}**\n📍 ${station.address}\n🚗 В очереди: ${station.queueCount} авто (~${station.avgWaitMinutes} мин)\n\nВыберите тип топлива:`,
      fuelButtons
    );
  };

  const handleSelectFuel = (fuelType: string) => {
    const station = selectedStation;
    if (!station) return;

    const fuel = station.fuelTypes.find(f => f.type === fuelType);
    if (!fuel || !fuel.available) {
      addBotMessage('❌ К сожалению, это топливо сейчас недоступно на выбранной АЗС. Выберите другое:', [
        { buttons: [{ label: '↩️ Выбрать другое топливо', action: 'refuel' }] },
      ]);
      return;
    }

    setSelectedFuel(fuelType);
    setBotState('choosing_liters');

    addBotMessage(
      `⛽ Отлично! **${fuelType}** по цене ${fuel.price} ₽/л\n\nСколько литров заправить?`,
      [
        { buttons: [
          { label: '20 л', action: 'liters_20' },
          { label: '30 л', action: 'liters_30' },
          { label: '40 л', action: 'liters_40' },
        ]},
        { buttons: [
          { label: '50 л', action: 'liters_50' },
          { label: '✏️ Другое кол-во', action: 'liters_custom' },
        ]},
        { buttons: [{ label: '↩️ Назад', action: 'refuel' }] },
      ]
    );
  };

  const handleSelectLiters = (liters: number) => {
    if (!selectedStation || !selectedFuel) return;

    setSelectedLiters(liters);
    setBotState('confirming_order');

    const fuel = selectedStation.fuelTypes.find(f => f.type === selectedFuel);
    const total = fuel ? fuel.price * liters : 0;

    addBotMessage(
      `📋 **Ваш заказ:**\n\n` +
      `🏢 Станция: **${selectedStation.name}**\n` +
      `📍 ${selectedStation.address}\n` +
      `⛽ Топливо: **${selectedFuel}**\n` +
      `📦 Объём: **${liters} л**\n` +
      `💰 Цена: ${fuel?.price} ₽/л\n` +
      `━━━━━━━━━━━━━━━\n` +
      `💳 **Итого: ${total.toFixed(0)} ₽**\n\n` +
      `🚗 Ваша позиция в очереди: **#${selectedStation.queueCount + 1}**\n` +
      `⏱ Примерное ожидание: **~${selectedStation.avgWaitMinutes + 3} мин**\n\n` +
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
    if (!selectedStation || !selectedFuel || !selectedLiters) return;

    const fuel = selectedStation.fuelTypes.find(f => f.type === selectedFuel);
    const total = fuel ? fuel.price * selectedLiters : 0;

    addBotMessage(
      `💳 Выберите способ оплаты:\n\n` +
      `💼 Баланс: **${userBalance.toLocaleString()} ₽**\n` +
      `🪙 Бонусы: **${userBonusPoints} баллов** (≈${Math.floor(userBonusPoints / 10)} ₽)`,
      [
        { buttons: [
          { label: `💼 С баланса (${userBalance.toLocaleString()} ₽)`, action: 'pay_balance', style: 'primary' },
        ]},
        { buttons: [
          { label: '💳 Банковская карта', action: 'pay_card' },
        ]},
        { buttons: [
          { label: `🪙 Оплатить бонусами`, action: 'pay_bonus' },
        ]},
        { buttons: [{ label: '↩️ Отменить', action: 'cancel_order' }] },
      ]
    );
  };

  const handlePayment = (method: string) => {
    if (!selectedStation || !selectedFuel || !selectedLiters) return;

    const fuel = selectedStation.fuelTypes.find(f => f.type === selectedFuel);
    const total = fuel ? fuel.price * selectedLiters : 0;
    const queueNumber = selectedStation.queueCount + 1;

    const order: OrderCard = {
      id: `MF-${Date.now().toString(36).toUpperCase()}`,
      stationName: selectedStation.name,
      fuelType: selectedFuel,
      liters: selectedLiters,
      totalPrice: total,
      queueNumber,
      estimatedMinutes: selectedStation.avgWaitMinutes + 3,
      status: 'confirmed',
      qrCode: `MAX-${Date.now()}`,
    };

    setActiveOrders(prev => [...prev, order]);

    const methodText = method === 'balance' ? '💼 с баланса' : method === 'card' ? '💳 банковской картой' : '🪙 бонусами';

    addBotMessage(
      `✅ **Заказ оплачен** (${methodText})!\n\n` +
      `🎫 Номер: **${order.id}**\n` +
      `🏢 ${order.stationName}\n` +
      `⛽ ${order.fuelType}, ${order.liters} л\n` +
      `💰 ${order.totalPrice.toFixed(0)} ₽\n\n` +
      `📍 Ваша позиция: **#${order.queueNumber}**\n` +
      `⏱ Приезжайте через ~**${order.estimatedMinutes} мин**\n\n` +
      `Я уведомлю вас, когда подойдёт ваша очередь! 🔔`,
      [
        { buttons: [
          { label: '📱 Показать QR-код', action: 'show_qr', style: 'primary' },
        ]},
        { buttons: [
          { label: '📋 Мои заказы', action: 'my_orders' },
          { label: '🏠 Главное меню', action: 'back_to_menu' },
        ]},
      ]
    );

    setBotState('order_created');

    // Simulate queue progress
    setTimeout(() => {
      addBotMessage(
        `🔔 **Уведомление:**\n\n` +
        `Ваша позиция в очереди на **${order.stationName}**: **#1**\n\n` +
        `⏱ Подъезжайте к колонке! Ваша очередь почти готова.\n\n` +
        `Покажите QR-код оператору для быстрого обслуживания.`,
        [
          { buttons: [
            { label: '📱 Показать QR-код', action: 'show_qr', style: 'primary' },
          ]},
          { buttons: [
            { label: '🏠 Главное меню', action: 'back_to_menu' },
          ]},
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
      `Заказ: ${order.id} • ${order.fuelType} ${order.liters}л`,
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
        '📋 У вас пока нет активных заказов.\n\nСоздайте предзаказ, чтобы встать в виртуальную очередь и заправиться без ожидания!',
        [
          { buttons: [{ label: '⛽ Заправить авто', action: 'refuel', style: 'primary' }] },
          { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
        ]
      );
    } else {
      const ordersText = activeOrders.map(o => 
        `🎫 **${o.id}** — ${o.stationName}\n   ⛽ ${o.fuelType}, ${o.liters}л • 💰 ${o.totalPrice.toFixed(0)} ₽\n   📍 Позиция: #${o.queueNumber} • ⏱ ~${o.estimatedMinutes} мин`
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
      `До уровня Platinum: ещё 3 750 баллов`,
      [
        { buttons: [{ label: '💼 Пополнить баланс', action: 'back_to_menu', style: 'primary' }] },
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
      ]
    );
  };

  const handleHowItWorks = () => {
    addBotMessage(
      `ℹ️ **Как работает Max Fuel:**\n\n` +
      `1️⃣ Выберите АЗС — бот покажет загруженность в реальном времени\n\n` +
      `2️⃣ Оформите предзаказ — выберите топливо и объём\n\n` +
      `3️⃣ Оплатите онлайн — с баланса, карты или бонусами\n\n` +
      `4️⃣ Получите номер в виртуальной очереди\n\n` +
      `5️⃣ Приезжайте ко времени — покажите QR-код на колонке\n\n` +
      `✅ **Никаких очередей! Вы приезжаете точно к своему времени.**\n\n` +
      `💡 Совет: бот рекомендует менее загруженные АЗС, чтобы вы экономили время.`,
      [
        { buttons: [{ label: '⛽ Заправить авто', action: 'refuel', style: 'primary' }] },
        { buttons: [{ label: '🏠 Главное меню', action: 'back_to_menu' }] },
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

    addBotMessage(
      '🏠 Главное меню. Что хотите сделать?',
      [
        { buttons: [{ label: '⛽ Заправить авто', action: 'refuel', style: 'primary' }] },
        { buttons: [
          { label: '📍 Найти АЗС', action: 'find_station' },
          { label: '📋 Мои заказы', action: 'my_orders' },
        ]},
        { buttons: [
          { label: '💳 Баланс и бонусы', action: 'balance' },
          { label: 'ℹ️ Как это работает', action: 'how_it_works' },
        ]},
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const renderQRCode = (code: string) => {
    // Generate a deterministic QR-like pattern
    const cells = [];
    const seed = code.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    for (let i = 0; i < 225; i++) {
      const val = (seed * (i + 1) * 7 + i * 13) % 100;
      cells.push(val > 40);
    }

    return (
      <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
        <div className="grid grid-cols-15 gap-0 mx-auto w-[180px] h-[180px]" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
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

          {/* Buttons */}
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
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-md">
          <i className="fas fa-gas-pump text-white text-sm"></i>
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800 text-sm">Max Fuel Bot</h1>
          <p className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
            онлайн
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {/* Date separator */}
        <div className="flex justify-center mb-4">
          <span className="bg-white/80 text-gray-500 text-[10px] px-3 py-1 rounded-full shadow-sm">
            Сегодня
          </span>
        </div>

        {messages.map(renderMessage)}

        {/* Typing indicator */}
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

      {/* Input Area (decorative - bot interaction is via buttons) */}
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
