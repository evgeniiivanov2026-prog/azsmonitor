import React from 'react';
import { userProfile } from '../data';

export const ProfileScreen: React.FC = () => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return 'from-amber-600 to-amber-800';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-amber-500';
      case 'platinum': return 'from-purple-400 to-indigo-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'bronze': return '🥉';
      case 'silver': return '🥈';
      case 'gold': return '🥇';
      case 'platinum': return '💎';
      default: return '🥉';
    }
  };

  const getLevelProgress = (level: string) => {
    switch (level) {
      case 'bronze': return 25;
      case 'silver': return 50;
      case 'gold': return 75;
      case 'platinum': return 100;
      default: return 0;
    }
  };

  return (
    <div className="px-4 py-4 pb-20 overflow-y-auto">
      {/* Profile Card */}
      <div className={`bg-gradient-to-br ${getLevelColor(userProfile.level)} rounded-3xl p-6 text-white shadow-lg mb-6`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
            {userProfile.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold">{userProfile.name}</h2>
            <p className="text-white/80 text-sm">{userProfile.phone}</p>
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="bg-white/15 backdrop-blur rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getLevelIcon(userProfile.level)}</span>
              <span className="font-semibold capitalize">{userProfile.level}</span>
            </div>
            <span className="text-sm text-white/80">{userProfile.bonusPoints} баллов</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${getLevelProgress(userProfile.level)}%` }}
            ></div>
          </div>
          <p className="text-xs text-white/70 mt-1">
            До следующего уровня: {userProfile.level === 'platinum' ? 'Максимум!' : `${5000 - userProfile.bonusPoints} баллов`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="text-xl font-bold">{userProfile.visitsCount}</div>
            <div className="text-xs text-white/80">Заправок</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="text-xl font-bold">{userProfile.totalFuelLiters}</div>
            <div className="text-xs text-white/80">Литров</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="text-xl font-bold">{userProfile.bonusPoints}</div>
            <div className="text-xs text-white/80">Баллов</div>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-gray-800">
            <i className="fas fa-wallet text-blue-500 mr-2"></i>
            Баланс
          </h3>
          <button className="text-orange-500 text-sm font-medium">Пополнить</button>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">
          {userProfile.balance.toLocaleString('ru-RU')} ₽
        </div>
        <p className="text-xs text-gray-500">Доступно для оплаты топлива</p>
      </div>

      {/* Menu Items */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-4">
        <h3 className="font-bold text-gray-800 px-4 pt-4 pb-2">Настройки</h3>
        {[
          { icon: 'fa-car', color: 'text-blue-500', bg: 'bg-blue-50', label: 'Мои автомобили', value: 'BMW X5' },
          { icon: 'fa-credit-card', color: 'text-purple-500', bg: 'bg-purple-50', label: 'Способы оплаты', value: '2 карты' },
          { icon: 'fa-bell', color: 'text-orange-500', bg: 'bg-orange-50', label: 'Уведомления', value: 'Вкл.' },
          { icon: 'fa-map-marker-alt', color: 'text-green-500', bg: 'bg-green-50', label: 'Избранные АЗС', value: '3 станции' },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100">
            <div className={`w-9 h-9 ${item.bg} rounded-full flex items-center justify-center`}>
              <i className={`fas ${item.icon} ${item.color} text-sm`}></i>
            </div>
            <span className="flex-1 text-left text-sm font-medium text-gray-700">{item.label}</span>
            <span className="text-xs text-gray-500">{item.value}</span>
            <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
          </button>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-4">
        <h3 className="font-bold text-gray-800 mb-3">
          <i className="fas fa-trophy text-yellow-500 mr-2"></i>
          Достижения
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🏆', label: 'Первая заправка', unlocked: true },
            { icon: '⚡', label: '10 заправок', unlocked: true },
            { icon: '🌙', label: 'Ночной водитель', unlocked: true },
            { icon: '🔥', label: '50 заправок', unlocked: true },
            { icon: '💎', label: '100 заправок', unlocked: false },
            { icon: '🚀', label: '1000 литров', unlocked: false },
            { icon: '👑', label: 'Платина', unlocked: false },
            { icon: '🌟', label: 'Легенда', unlocked: false },
          ].map((achievement, i) => (
            <div key={i} className={`text-center p-2 rounded-xl ${achievement.unlocked ? '' : 'opacity-30'}`}>
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <div className="text-[10px] text-gray-600 leading-tight">{achievement.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-user-plus text-xl"></i>
          </div>
          <div className="flex-1">
            <h4 className="font-bold">Пригласи друга!</h4>
            <p className="text-sm text-white/80">Получи 500 бонусных баллов за каждого друга</p>
          </div>
          <button className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold text-sm">
            Пригласить
          </button>
        </div>
      </div>
    </div>
  );
};
