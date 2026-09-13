import React, { useState } from 'react';
import { GasStation, Order } from '../types';
import { gasStations } from '../data';

interface OrderScreenProps {
  station?: GasStation | null;
  onCreateOrder: (order: Order) => void;
}

export const OrderScreen: React.FC<OrderScreenProps> = ({ station, onCreateOrder }) => {
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(station || null);
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [liters, setLiters] = useState<number>(40);
  const [paymentMethod, setPaymentMethod] = useState<'balance' | 'card' | 'bonus'>('balance');
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStation = selectedStation || gasStations[0];
  const selectedFuelData = currentStation.fuelTypes.find(f => f.type === selectedFuel);
  const totalPrice = selectedFuelData ? selectedFuelData.price * liters : 0;

  const handleCreateOrder = () => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      stationId: currentStation.id,
      stationName: currentStation.name,
      fuelType: selectedFuel,
      liters,
      totalPrice,
      status: 'confirmed',
      queueNumber: currentStation.queueCount + 1,
      estimatedMinutes: currentStation.avgWaitMinutes + 5,
      createdAt: new Date(),
      qrCode: `MAX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    onCreateOrder(order);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <i className="fas fa-check text-green-500 text-3xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Заказ создан!</h2>
        <p className="text-gray-500 mb-4">Ваш QR-код готов. Покажите его на заправке для быстрого обслуживания.</p>
        <div className="bg-white border-2 border-dashed border-orange-300 rounded-2xl p-6 w-full">
          <div className="text-center mb-3">
            <div className="text-sm text-gray-500">Номер заказа</div>
            <div className="text-xl font-bold text-gray-800">#{`ORD-${Date.now()}`.slice(-6)}</div>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 mb-3">
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="aspect-square bg-gray-800 rounded-sm"></div>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500">Отсканируйте на колонке</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 pb-20 overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-receipt text-orange-500 mr-2"></i>
        Предзаказ топлива
      </h2>

      {/* Station Selection */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-600 mb-2 block">Выберите АЗС</label>
        <div className="space-y-2 max-h-[150px] overflow-y-auto">
          {gasStations.map((s) => (
            <button
              key={s.id}
              onClick={() => { setSelectedStation(s); setSelectedFuel(''); }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                currentStation.id === s.id
                  ? 'border-orange-400 bg-orange-50 ring-1 ring-orange-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                <span className="font-medium text-gray-800 text-sm">{s.name}</span>
                <p className="text-xs text-gray-500">{s.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">~{s.avgWaitMinutes} мин</span>
                <div className={`w-3 h-3 rounded-full ${
                  s.loadLevel === 'low' ? 'bg-green-500' :
                  s.loadLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fuel Type */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-600 mb-2 block">Тип топлива</label>
        <div className="grid grid-cols-2 gap-2">
          {currentStation.fuelTypes.map((fuel) => (
            <button
              key={fuel.type}
              onClick={() => fuel.available && setSelectedFuel(fuel.type)}
              disabled={!fuel.available}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedFuel === fuel.type
                  ? 'border-orange-400 bg-orange-50 ring-1 ring-orange-200'
                  : fuel.available
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="font-bold text-gray-800">{fuel.type}</div>
              <div className="text-sm text-gray-500">{fuel.price} ₽/л</div>
              {!fuel.available && <div className="text-xs text-red-400">Нет в наличии</div>}
            </button>
          ))}
        </div>
      </div>

      {/* Liters */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-600 mb-2 block">Объём (литры)</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiters(Math.max(1, liters - 5))}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <i className="fas fa-minus text-gray-600"></i>
          </button>
          <div className="flex-1 relative">
            <input
              type="range"
              min="5"
              max="80"
              value={liters}
              onChange={(e) => setLiters(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="text-center mt-1">
              <span className="text-2xl font-bold text-gray-800">{liters}</span>
              <span className="text-gray-500 ml-1">л</span>
            </div>
          </div>
          <button
            onClick={() => setLiters(Math.min(80, liters + 5))}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
          >
            <i className="fas fa-plus text-gray-600"></i>
          </button>
        </div>
        {/* Quick amounts */}
        <div className="flex gap-2 mt-3">
          {[20, 30, 40, 50, 60].map((amount) => (
            <button
              key={amount}
              onClick={() => setLiters(amount)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                liters === amount
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {amount}л
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-5">
        <label className="text-sm font-semibold text-gray-600 mb-2 block">Способ оплаты</label>
        <div className="space-y-2">
          <button
            onClick={() => setPaymentMethod('balance')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
              paymentMethod === 'balance'
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200'
            }`}
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-wallet text-blue-600"></i>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800">Баланс</div>
              <div className="text-xs text-gray-500">5 420 ₽</div>
            </div>
          </button>
          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
              paymentMethod === 'card'
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200'
            }`}
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-credit-card text-purple-600"></i>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800">Банковская карта</div>
              <div className="text-xs text-gray-500">•••• 4567</div>
            </div>
          </button>
          <button
            onClick={() => setPaymentMethod('bonus')}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
              paymentMethod === 'bonus'
                ? 'border-orange-400 bg-orange-50'
                : 'border-gray-200'
            }`}
          >
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-coins text-yellow-600"></i>
            </div>
            <div className="text-left">
              <div className="font-medium text-gray-800">Бонусы</div>
              <div className="text-xs text-gray-500">1 250 баллов</div>
            </div>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">{selectedFuel || '—'}</span>
          <span className="font-medium text-gray-800">{liters} л × {selectedFuelData?.price || 0} ₽</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Станция</span>
          <span className="font-medium text-gray-800">{currentStation.name}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Ожидание</span>
          <span className="font-medium text-gray-800">~{currentStation.avgWaitMinutes + 5} мин</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
          <span className="font-bold text-gray-800">Итого</span>
          <span className="font-bold text-xl text-orange-600">{totalPrice.toFixed(0)} ₽</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleCreateOrder}
        disabled={!selectedFuel}
        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
          selectedFuel
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        {selectedFuel ? (
          <>
            <i className="fas fa-check-circle mr-2"></i>
            Оплатить {totalPrice.toFixed(0)} ₽
          </>
        ) : (
          'Выберите тип топлива'
        )}
      </button>
    </div>
  );
};
