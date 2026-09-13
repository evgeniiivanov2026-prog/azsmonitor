import { Link } from 'react-router-dom';
import { stations, getBestStation } from '../data';

export const HomePage = () => {
  const bestStation = getBestStation();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Заправляйтесь без очередей!</h1>
          <p className="text-lg text-orange-100 mb-6">
            Система Smart Slots распределит время прибытия на АЗС. Приезжайте точно ко времени — ожидание всего 2-3 минуты!
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/order"
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors shadow-lg"
            >
              <i className="fas fa-gas-pump mr-2"></i>Заправиться сейчас
            </Link>
            <Link
              to="/stations"
              className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              <i className="fas fa-map mr-2"></i>Выбрать АЗС
            </Link>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            <i className="fas fa-star mr-1"></i>Рекомендуем
          </span>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            ⭐ Яндекс: {bestStation.yandexRating}/5
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{bestStation.name}</h2>
        <p className="text-gray-600 mb-4">{bestStation.address}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{bestStation.queueCount}</div>
            <div className="text-xs text-gray-600">Авто в очереди</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">~{bestStation.avgWaitMinutes} мин</div>
            <div className="text-xs text-gray-600">Ожидание</div>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{bestStation.yandexReviewsCount}</div>
            <div className="text-xs text-gray-600">Отзывов</div>
          </div>
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">4</div>
            <div className="text-xs text-gray-600">Свободных слотов</div>
          </div>
        </div>
        <Link
          to={`/order?station=${bestStation.id}`}
          className="block w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold text-center hover:shadow-lg transition-shadow"
        >
          Забронировать слот
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-clock text-orange-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Slots</h3>
          <p className="text-gray-600 text-sm">
            Бронируйте точное время прибытия. Слоты каждые 3 минуты — никаких очередей!
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-chart-line text-blue-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Мониторинг</h3>
          <p className="text-gray-600 text-sm">
            Видите загруженность АЗС в реальном времени. Выбирайте свободные станции.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-star text-yellow-600 text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Отзывы Яндекс</h3>
          <p className="text-gray-600 text-sm">
            Реальные рейтинги из Яндекс Карт. Выбирайте лучшие АЗС по отзывам.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Результаты Smart Slots</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">-70%</div>
            <div className="text-sm text-gray-300">Очереди</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">3 мин</div>
            <div className="text-sm text-gray-300">Среднее ожидание</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">+40%</div>
            <div className="text-sm text-gray-300">Пропускная способность</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400 mb-2">10K+</div>
            <div className="text-sm text-gray-300">Довольных водителей</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to="/chat"
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-comments text-green-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Чат водителей</h3>
              <p className="text-sm text-gray-600">Актуальная информация от других водителей</p>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </Link>

        <Link
          to="/reviews"
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow block"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-star text-yellow-600 text-xl"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800">Отзывы и рейтинги</h3>
              <p className="text-sm text-gray-600">Реальные отзывы из Яндекс Карт</p>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </div>
        </Link>
      </div>
    </div>
  );
};
