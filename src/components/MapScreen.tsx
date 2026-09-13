import React, { useState } from 'react';
import { GasStation } from '../types';
import { gasStations } from '../data';

interface MapScreenProps {
  onSelectStation: (station: GasStation) => void;
}

const getLoadColor = (level: string) => {
  switch (level) {
    case 'low': return 'bg-green-500';
    case 'medium': return 'bg-yellow-500';
    case 'high': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getLoadBorderColor = (level: string) => {
  switch (level) {
    case 'low': return 'border-green-400 ring-green-200';
    case 'medium': return 'border-yellow-400 ring-yellow-200';
    case 'high': return 'border-red-400 ring-red-200';
    default: return 'border-gray-400 ring-gray-200';
  }
};

export const MapScreen: React.FC<MapScreenProps> = ({ onSelectStation }) => {
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);

  const filteredStations = filter === 'all' 
    ? gasStations 
    : gasStations.filter(s => s.loadLevel === filter);

  return (
    <div className="flex flex-col h-full">
      {/* Map Area */}
      <div className="relative flex-1 bg-gradient-to-b from-blue-50 to-green-50 min-h-[300px] overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Roads simulation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 opacity-50 transform -rotate-12"></div>
          <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-gray-300 opacity-50"></div>
          <div className="absolute top-1/4 left-0 right-0 h-1.5 bg-gray-300 opacity-40 transform rotate-6"></div>
          <div className="absolute top-0 bottom-0 right-1/4 w-1.5 bg-gray-300 opacity-40"></div>
        </div>

        {/* Station Markers */}
        {filteredStations.map((station, index) => {
          const positions = [
            { top: '20%', left: '25%' },
            { top: '35%', left: '65%' },
            { top: '55%', left: '40%' },
            { top: '70%', left: '20%' },
            { top: '45%', left: '75%' },
          ];
          const pos = positions[index % positions.length];
          
          return (
            <button
              key={station.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all ${
                selectedStation?.id === station.id ? 'scale-125 z-20' : 'hover:scale-110'
              }`}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => setSelectedStation(station)}
            >
              <div className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg ${getLoadBorderColor(station.loadLevel)} bg-white`}>
                <i className="fas fa-gas-pump text-sm text-gray-700"></i>
                {selectedStation?.id === station.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-medium bg-white px-1.5 py-0.5 rounded shadow-sm">
                  {station.queueCount} авто
                </span>
              </div>
            </button>
          );
        })}

        {/* User location */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-full absolute -top-4 -left-4 animate-ping"></div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-3">
          <div className="text-xs font-semibold text-gray-600 mb-2">Загруженность:</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Свободно</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Средняя</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Загружено</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'Все', icon: 'fa-th' },
            { key: 'low', label: 'Свободно', icon: 'fa-check-circle' },
            { key: 'medium', label: 'Средняя', icon: 'fa-hourglass-half' },
            { key: 'high', label: 'Загружено', icon: 'fa-exclamation-circle' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <i className={`fas ${f.icon} text-xs`}></i>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Station Details Panel */}
      {selectedStation && (
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{selectedStation.name}</h3>
              <p className="text-gray-500 text-sm">{selectedStation.address}</p>
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${getLoadColor(selectedStation.loadLevel)}`}></div>
              <span className="text-sm font-medium text-gray-700">
                {selectedStation.queueCount} авто в очереди
              </span>
            </div>
            <span className="text-sm text-gray-500">
              <i className="fas fa-clock mr-1"></i>~{selectedStation.avgWaitMinutes} мин
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSelectStation(selectedStation)}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
            >
              <i className="fas fa-gas-pump mr-2"></i>Заправить
            </button>
            <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <i className="fas fa-route text-gray-600"></i>
            </button>
          </div>
        </div>
      )}

      {/* Bottom List */}
      {!selectedStation && (
        <div className="bg-white border-t border-gray-200 p-4 max-h-[200px] overflow-y-auto">
          <h3 className="font-bold text-gray-800 mb-2">Выберите АЗС на карте</h3>
          <div className="space-y-2">
            {filteredStations.map((station) => (
              <button
                key={station.id}
                onClick={() => setSelectedStation(station)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
              >
                <div>
                  <span className="font-medium text-gray-800 text-sm">{station.name}</span>
                  <p className="text-xs text-gray-500">{station.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{station.queueCount} авто</span>
                  <div className={`w-3 h-3 rounded-full ${getLoadColor(station.loadLevel)}`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
