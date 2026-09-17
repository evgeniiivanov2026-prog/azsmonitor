import { userBalance, userBonusPoints, userName } from '../data';

export const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Профиль</h1>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
            {userName.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{userName}</h2>
            <p className="text-amber-100">+7 (999) 123-45-67</p>
          </div>
        </div>

        <div className="bg-white/15 backdrop-blur rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥇</span>
              <span className="font-semibold">Gold</span>
            </div>
            <span className="text-sm text-white/80">{userBonusPoints} баллов</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-white/70 mt-2">До Platinum: 3 750 баллов</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">67</div>
            <div className="text-xs text-white/80">Заправок</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">2 840</div>
            <div className="text-xs text-white/80">Литров</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold">{userBonusPoints}</div>
            <div className="text-xs text-white/80">Баллов</div>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            <i className="fas fa-wallet text-blue-500 mr-2"></i>
            Баланс
          </h3>
          <button className="text-orange-500 text-sm font-semibold">Пополнить</button>
        </div>
        <div className="text-4xl font-bold text-gray-800 mb-2">
          {userBalance.toLocaleString('ru-RU')} ₽
        </div>
        <p className="text-sm text-gray-500">Доступно для оплаты топлива</p>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <h3 className="text-xl font-bold text-gray-800 px-6 pt-6 pb-3">Настройки</h3>
        {[
          { icon: 'fa-car', color: 'text-blue-500', bg: 'bg-blue-50', label: 'Мои автомобили', value: 'BMW X5' },
          { icon: 'fa-credit-card', color: 'text-purple-500', bg: 'bg-purple-50', label: 'Способы оплаты', value: '2 карты' },
          { icon: 'fa-bell', color: 'text-orange-500', bg: 'bg-orange-50', label: 'Уведомления', value: 'Вкл.' },
          { icon: 'fa-map-marker-alt', color: 'text-green-500', bg: 'bg-green-50', label: 'Избранные АЗС', value: '3 станции' },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
            <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center`}>
              <i className={`fas ${item.icon} ${item.color}`}></i>
            </div>
            <span className="flex-1 text-left text-gray-800 font-medium">{item.label}</span>
            <span className="text-sm text-gray-500">{item.value}</span>
            <i className="fas fa-chevron-right text-gray-300"></i>
          </button>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          <i className="fas fa-trophy text-yellow-500 mr-2"></i>
          Достижения
        </h3>
        <div className="grid grid-cols-4 gap-4">
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
            <div key={i} className={`text-center p-3 rounded-xl ${achievement.unlocked ? '' : 'opacity-30'}`}>
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-xs text-gray-600">{achievement.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-user-plus text-2xl"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold">Пригласи друга!</h4>
            <p className="text-sm text-white/80">Получи 500 бонусных баллов</p>
          </div>
          <button className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
            Пригласить
          </button>
        </div>
      </div>
    </div>
  );
};
