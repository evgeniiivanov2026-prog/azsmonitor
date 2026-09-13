import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { stations, generateSmartSlots } from '../data';

export const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const stationId = searchParams.get('station');

  const [selectedStation, setSelectedStation] = useState(stationId || stations[0].id);
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedLiters, setSelectedLiters] = useState(40);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [step, setStep] = useState(1);

  const station = stations.find(s => s.id === selectedStation);
  const slots = selectedStation ? generateSmartSlots(selectedStation) : [];
  const fuel = station?.fuelTypes.find(f => f.type === selectedFuel);
  const total = fuel ? fuel.price * selectedLiters : 0;

  const handleNext = () => {
    if (step === 1 && selectedFuel) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3 && selectedSlot) setStep(4);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (!station) return <div>Станция не найдена</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Предзаказ топлива</h1>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 4 && <div className={`w-16 h-1 ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`}></div>}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>Станция</span>
          <span>Топливо</span>
          <span>Слот</span>
          <span>Оплата</span>
        </div>
      </div>

      {/* Step 1: Station & Fuel */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Выберите АЗС</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {stations.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStation(s.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedStation === s.id
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-bold text-gray-800">{s.name}</div>
                  <div className="text-sm text-gray-600">{s.address}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {s.queueCount} авто • ~{s.avgWaitMinutes} мин
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Выберите топливо</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {station.fuelTypes.map((f) => (
                <button
                  key={f.type}
                  onClick={() => f.available && setSelectedFuel(f.type)}
                  disabled={!f.available}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    selectedFuel === f.type
                      ? 'border-orange-500 bg-orange-50'
                      : f.available
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="font-bold text-gray-800">{f.type}</div>
                  <div className="text-lg font-bold text-orange-600">{f.price} ₽</div>
                  {!f.available && <div className="text-xs text-red-500">Нет в наличии</div>}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedFuel}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
          >
            Далее
          </button>
        </div>
      )}

      {/* Step 2: Liters */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Объём топлива</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Выбрано:</span>
              <span className="text-3xl font-bold text-orange-600">{selectedLiters} л</span>
            </div>

            <input
              type="range"
              min="5"
              max="80"
              value={selectedLiters}
              onChange={(e) => setSelectedLiters(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />

            <div className="flex gap-2">
              {[20, 30, 40, 50, 60].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setSelectedLiters(amount)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedLiters === amount
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {amount}л
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{selectedFuel}</span>
                <span className="font-medium">{selectedLiters} л × {fuel?.price} ₽</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-orange-600">{total.toFixed(0)} ₽</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Назад
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              Далее
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Smart Slots */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Smart Slots</h2>
            <p className="text-gray-600 text-sm">
              Выберите время прибытия. Слоты каждые 3 минуты — приезжайте точно ко времени!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.number}
                onClick={() => slot.available && setSelectedSlot(slot.number)}
                disabled={!slot.available}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedSlot === slot.number
                    ? 'border-orange-500 bg-orange-50'
                    : slot.available
                    ? 'border-gray-200 hover:border-gray-300'
                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-lg font-bold text-gray-800">{slot.time}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {slot.available ? `${slot.carsInSlot} авто` : 'Занято'}
                </div>
              </button>
            ))}
          </div>

          {selectedSlot && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-green-700">
                <i className="fas fa-check-circle"></i>
                <span className="font-semibold">Слот выбран: {slots.find(s => s.number === selectedSlot)?.time}</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Ожидание на АЗС: ~2-3 минуты
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Назад
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedSlot}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
            >
              Далее
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Подтверждение заказа</h2>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Станция:</span>
              <span className="font-semibold">{station.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Топливо:</span>
              <span className="font-semibold">{selectedFuel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Объём:</span>
              <span className="font-semibold">{selectedLiters} л</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Слот:</span>
              <span className="font-semibold">{slots.find(s => s.number === selectedSlot)?.time}</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Итого:</span>
              <span className="text-orange-600">{total.toFixed(0)} ₽</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Способ оплаты:</h3>
            <button className="w-full p-4 border-2 border-orange-500 bg-orange-50 rounded-xl text-left">
              <div className="font-semibold">💼 Баланс: 5 420 ₽</div>
            </button>
            <button className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-gray-300">
              <div className="font-semibold">💳 Банковская карта</div>
            </button>
            <button className="w-full p-4 border-2 border-gray-200 rounded-xl text-left hover:border-gray-300">
              <div className="font-semibold">🪙 Бонусы: 1 250 баллов</div>
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Назад
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow">
              Оплатить {total.toFixed(0)} ₽
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
