import React, { useState } from 'react';
import { Screen, GasStation, Order } from './types';
import { HomeScreen } from './components/HomeScreen';
import { MapScreen } from './components/MapScreen';
import { OrderScreen } from './components/OrderScreen';
import { QueueScreen } from './components/QueueScreen';
import { ProfileScreen } from './components/ProfileScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedStation, setSelectedStation] = useState<GasStation | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleSelectStation = (station: GasStation) => {
    setSelectedStation(station);
    setCurrentScreen('order');
  };

  const handleCreateOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setTimeout(() => {
      setCurrentScreen('queue');
    }, 3500);
  };

  const handleNavigate = (screen: Screen) => {
    if (screen === 'order') {
      setSelectedStation(null);
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen
            onSelectStation={handleSelectStation}
            onNavigate={(screen) => handleNavigate(screen)}
          />
        );
      case 'map':
        return <MapScreen onSelectStation={handleSelectStation} />;
      case 'order':
        return (
          <OrderScreen
            station={selectedStation}
            onCreateOrder={handleCreateOrder}
          />
        );
      case 'queue':
        return <QueueScreen orders={orders} />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  const navItems = [
    { screen: 'home' as Screen, icon: 'fa-home', label: 'Главная' },
    { screen: 'map' as Screen, icon: 'fa-map', label: 'Карта' },
    { screen: 'order' as Screen, icon: 'fa-plus-circle', label: 'Заказ' },
    { screen: 'queue' as Screen, icon: 'fa-list', label: 'Очередь' },
    { screen: 'profile' as Screen, icon: 'fa-user', label: 'Профиль' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col shadow-2xl relative">
        {/* Status Bar */}
        <div className="bg-white px-4 py-2 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100">
          <span className="font-semibold">9:41</span>
          <div className="flex items-center gap-2">
            <i className="fas fa-signal"></i>
            <i className="fas fa-wifi"></i>
            <i className="fas fa-battery-full"></i>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {renderScreen()}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-200 px-2 py-2 pb-3">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <button
                key={item.screen}
                onClick={() => handleNavigate(item.screen)}
                className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
                  currentScreen === item.screen
                    ? 'text-orange-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {item.screen === 'order' ? (
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center -mt-4 shadow-lg ${
                    currentScreen === item.screen
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-500'
                  }`}>
                    <i className={`fas ${item.icon} text-lg`}></i>
                  </div>
                ) : (
                  <i className={`fas ${item.icon} text-lg`}></i>
                )}
                <span className={`text-[10px] font-medium ${
                  currentScreen === item.screen ? 'text-orange-500' : ''
                }`}>
                  {item.label}
                </span>
                {item.screen === 'queue' && orders.filter(o => o.status !== 'completed').length > 0 && (
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    {orders.filter(o => o.status !== 'completed').length}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
