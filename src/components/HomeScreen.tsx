import React from 'react';
import { GasStation } from '../types';
import { gasStations } from '../data';

interface HomeScreenProps {
  onSelectStation: (station: GasStation) => void;
  onNavigate: (screen: 'map' | 'order') => void;
}

const getLoadColor = (level: string) => {
  switch (level) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getLoadText = (level: string) => {
  switch (level) {
    case 'low': return 'Свободно';
    case 'medium': return 'Средняя';
    case 'high': return 'Загружено';
    default: return '';
  }
};

const getLoadBg = (level: string) => {
  switch (level) {
    case 'low': return 'bg-green-50 border-green-200';
    case 'medium': return 'bg-yellow-50 border-yellow-200';
    case 'high': return 'bg-red-50 border-red-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectStation, onNavigate }) => {
  const sortedStations = [...gasStations].sort((a, b) => a.queueCount - b.queueCount);
  const recommendedStation = sortedStations[0];

  return (
    <div className="pb-4">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Max Fuel</h1>
            <p className="text-orange-100 text-sm">Заправляйся без очередей</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-gas-pump text-xl"></i>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">5</div>
            <div className="text-xs text-orange-100">АЗС рядом</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">2</div>
            <div className="text-xs text-orange-100">Свободных</div>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">3 мин</div>
            <div className="text-xs text-orange-100">Мин. ожидание</div>
          </div>
        </div>
      </div>

      {/* Recommended Station */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-green-100">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
              <i className="fas fa-star mr-1"></i>Рекомендуем
            </span>
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              Нет очереди
            </span>
          </div>
          <h3 className="font-bold text-lg text-gray-800">{recommendedStation.name}</h3>
          <p className="text-gray-500 text-sm mb-3">{recommendedStation.address}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">Очередь: {recommendedStation.queueCount} авто</span>
              </div>
              <span className="text-sm text-gray-600">~{recommendedStation.avgWaitMinutes} мин</span>
            </div>
            <button
              onClick={() => onSelectStation(recommendedStation)}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
            >
              Заправить
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Быстрые действия</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('map')}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-map-marked-alt text-blue-600 text-xl"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">Карта АЗС</span>
          </button>
          <button
            onClick={() => onNavigate('order')}
            className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="fas fa-receipt text-orange-600 text-xl"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">Предзаказ</span>
          </button>
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fas fa-qrcode text-purple-600 text-xl"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">QR-оплата</span>
          </button>
          <button className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-gift text-green-600 text-xl"></i>
            </div>
            <span className="text-sm font-medium text-gray-700">Бонусы</span>
          </button>
        </div>
      </div>

      {/* Stations List */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">АЗС рядом</h2>
          <button className="text-orange-500 text-sm font-medium">Все →</button>
        </div>
        <div className="space-y-3">
          {sortedStations.map((station) => (
            <div
              key={station.id}
              className={`border rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow ${getLoadBg(station.loadLevel)}`}
              onClick={() => onSelectStation(station)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{station.name}</h3>
                    <div className={`w-2.5 h-2.5 rounded-full ${getLoadColor(station.loadLevel)}`}></div>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{station.address}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span><i className="fas fa-car mr-1"></i>{station.queueCount} в очереди</span>
                    <span><i className="fas fa-clock mr-1"></i>~{station.avgWaitMinutes} мин</span>
                    <span><i className="fas fa-star text-yellow-500 mr-1"></i>{station.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    station.loadLevel === 'low' ? 'bg-green-100 text-green-700' :
                    station.loadLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {getLoadText(station.loadLevel)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
