import { Link } from 'react-router-dom';
import { stations } from '../data';

export const StationsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">АЗС рядом</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
            🟢 Свободно
          </button>
          <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
            🟡 Средняя
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
            🔴 Загружено
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {stations.map((station) => {
          const loadColor = station.loadLevel === 'low' ? 'green' : station.loadLevel === 'medium' ? 'yellow' : 'red';
          const loadText = station.loadLevel === 'low' ? 'Свободно' : station.loadLevel === 'medium' ? 'Средняя загрузка' : 'Большая очередь';

          return (
            <div key={station.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <div className={`h-2 bg-${loadColor}-500`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{station.name}</h2>
                    <p className="text-gray-600 text-sm">{station.address}</p>
                  </div>
                  <span className={`bg-${loadColor}-100 text-${loadColor}-700 text-xs font-semibold px-3 py-1 rounded-full`}>
                    {loadText}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fas fa-car text-gray-400"></i>
                      <span className="text-xs text-gray-500">В очереди</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{station.queueCount}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <i className="fas fa-clock text-gray-400"></i>
                      <span className="text-xs text-gray-500">Ожидание</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">~{station.avgWaitMinutes} мин</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-semibold">{station.yandexRating}</span>
                    <span className="text-gray-500">({station.yandexReviewsCount})</span>
                  </div>
                  <div className="text-gray-500">
                    <i className="fas fa-route mr-1"></i>{station.distance}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Топливо:</h3>
                  <div className="flex flex-wrap gap-2">
                    {station.fuelTypes.map((fuel) => (
                      <span
                        key={fuel.type}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          fuel.available
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {fuel.type} {fuel.price}₽
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/order?station=${station.id}`}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl font-semibold text-center hover:shadow-lg transition-shadow"
                  >
                    Забронировать
                  </Link>
                  <Link
                    to={`/chat?station=${station.id}`}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-comments"></i>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
