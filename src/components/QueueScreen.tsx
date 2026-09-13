import React, { useState, useEffect } from 'react';
import { Order } from '../types';

interface QueueScreenProps {
  orders: Order[];
}

export const QueueScreen: React.FC<QueueScreenProps> = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (orders.length > 0) {
      setCountdown(orders[0].estimatedMinutes * 60);
    }
  }, [orders]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const historyOrders = orders.filter(o => o.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'ready': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждён';
      case 'ready': return 'Готов к заправке';
      case 'pending': return 'Ожидает оплаты';
      case 'completed': return 'Завершён';
      default: return '';
    }
  };

  return (
    <div className="px-4 py-4 pb-20">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-list-ol text-orange-500 mr-2"></i>
        Моя очередь
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            activeTab === 'active'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Активные ({activeOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition-colors ${
            activeTab === 'history'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          История ({historyOrders.length})
        </button>
      </div>

      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-gray-400 text-3xl"></i>
              </div>
              <h3 className="font-semibold text-gray-600 mb-1">Нет активных заказов</h3>
              <p className="text-sm text-gray-400">Создайте предзаказ, чтобы встать в очередь</p>
            </div>
          ) : (
            activeOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{order.stationName}</h3>
                    <p className="text-xs text-gray-500">Заказ #{order.id.slice(-6)}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Countdown */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-3 text-center">
                  <div className="text-sm text-gray-600 mb-1">Ваше время</div>
                  <div className="text-3xl font-bold text-orange-600 font-mono">
                    {formatTime(countdown)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Позиция в очереди: <span className="font-bold text-gray-700">#{order.queueNumber}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Топливо</div>
                    <div className="font-bold text-gray-800">{order.fuelType}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Объём</div>
                    <div className="font-bold text-gray-800">{order.liters} л</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Сумма</div>
                    <div className="font-bold text-gray-800">{order.totalPrice.toFixed(0)} ₽</div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="border border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="grid grid-cols-5 gap-0.5 p-2">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-sm ${Math.random() > 0.3 ? 'bg-white' : 'bg-gray-900'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">QR-код для заправки</div>
                    <p className="text-xs text-gray-500">Покажите код на АЗС для быстрого обслуживания без очереди</p>
                    <div className="mt-2 flex gap-2">
                      <button className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                        <i className="fas fa-expand mr-1"></i>Увеличить
                      </button>
                      <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                        <i className="fas fa-share mr-1"></i>Поделиться
                      </button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                    <i className="fas fa-times mr-1"></i>Отменить
                  </button>
                  <button className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                    <i className="fas fa-route mr-1"></i>Маршрут
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {historyOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-history text-gray-400 text-3xl"></i>
              </div>
              <h3 className="font-semibold text-gray-600 mb-1">История пуста</h3>
              <p className="text-sm text-gray-400">Ваши завершённые заказы появятся здесь</p>
            </div>
          ) : (
            historyOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-3 opacity-70">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-700 text-sm">{order.stationName}</h4>
                    <p className="text-xs text-gray-500">{order.fuelType} • {order.liters}л • {order.totalPrice.toFixed(0)} ₽</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <i className="fas fa-info-circle text-blue-600"></i>
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 text-sm mb-1">Как это работает?</h4>
            <ol className="text-xs text-blue-700 space-y-1">
              <li>1. Создайте предзаказ и оплатите топливо</li>
              <li>2. Получите номер в виртуальной очереди</li>
              <li>3. Приезжайте когда подойдёт ваше время</li>
              <li>4. Покажите QR-код — заправка без очереди!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
