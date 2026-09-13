import { Link, useLocation } from 'react-router-dom';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная', icon: 'fa-home' },
    { path: '/stations', label: 'АЗС', icon: 'fa-gas-pump' },
    { path: '/order', label: 'Заказать', icon: 'fa-plus-circle' },
    { path: '/orders', label: 'Заказы', icon: 'fa-list' },
    { path: '/reviews', label: 'Отзывы', icon: 'fa-star' },
    { path: '/chat', label: 'Чат', icon: 'fa-comments' },
    { path: '/profile', label: 'Профиль', icon: 'fa-user' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-gas-pump text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold">АЗСМонитор</h1>
                <p className="text-xs text-orange-100">Умная заправка без очередей</p>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold">Александр</div>
                <div className="text-xs text-orange-100">Gold 🥇</div>
              </div>
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="fas fa-user"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  location.pathname === item.path
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <i className={`fas ${item.icon}`}></i>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold mb-3">АЗСМонитор</h3>
              <p className="text-sm">Инновационная система Smart Slots для быстрой заправки без очередей</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Возможности</h4>
              <ul className="text-sm space-y-2">
                <li>• Smart Slots — бронирование времени</li>
                <li>• Мониторинг очередей в реальном времени</li>
                <li>• Отзывы из Яндекс Карт</li>
                <li>• Чат водителей</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Контакты</h4>
              <ul className="text-sm space-y-2">
                <li><i className="fas fa-phone mr-2"></i>8-800-555-35-35</li>
                <li><i className="fas fa-envelope mr-2"></i>info@azsmonitor.ru</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm">
            © 2024 АЗСМонитор. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};
