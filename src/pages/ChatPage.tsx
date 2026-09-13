import { useState } from 'react';
import { stations, stationChatMessages } from '../data';

export const ChatPage = () => {
  const [selectedStation, setSelectedStation] = useState(stations[0].id);
  const [newMessage, setNewMessage] = useState('');
  const station = stations.find(s => s.id === selectedStation);
  const chatMessages = stationChatMessages.filter(m => m.stationId === selectedStation);

  const handleSend = () => {
    if (newMessage.trim()) {
      setNewMessage('');
      // В реальном приложении здесь будет отправка сообщения
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Чат водителей</h1>

      {/* Station Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-md">
        <div className="flex gap-2 overflow-x-auto">
          {stations.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStation(s.id)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                selectedStation === s.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {station && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4">
            <h2 className="text-lg font-bold">{station.name}</h2>
            <p className="text-sm text-green-100">{station.address}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>🚗 {station.queueCount} авто</span>
              <span>⏱ ~{station.avgWaitMinutes} мин</span>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[500px] overflow-y-auto p-4 bg-gray-50 space-y-3">
            {chatMessages.map((msg) => {
              const time = msg.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
              
              if (msg.type === 'alert') {
                return (
                  <div key={msg.id} className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                      <i className="fas fa-exclamation-triangle"></i>
                      <span>{msg.author} • {time}</span>
                    </div>
                    <p className="text-red-600 text-sm mt-1">{msg.text}</p>
                  </div>
                );
              }

              if (msg.type === 'status_update') {
                return (
                  <div key={msg.id} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                      <i className="fas fa-info-circle"></i>
                      <span>{msg.author} • {time}</span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1">{msg.text}</p>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="bg-white rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{msg.avatar}</span>
                    <span className="font-semibold text-gray-800 text-sm">{msg.author}</span>
                    <span className="text-xs text-gray-500">{time}</span>
                  </div>
                  <p className="text-gray-700 text-sm">{msg.text}</p>
                </div>
              );
            })}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                👍 Очередь быстрая
              </button>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                ⚠️ Большая очередь
              </button>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200">
                ⛽ Свободно
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
