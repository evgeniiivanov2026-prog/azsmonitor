import { useState } from 'react';
import { stations, yandexReviews, stationReviews } from '../data';

export const ReviewsPage = () => {
  const [selectedStation, setSelectedStation] = useState(stations[0].id);
  const station = stations.find(s => s.id === selectedStation);

  const yaReviews = yandexReviews.filter(r => r.stationId === selectedStation);
  const internalReviews = stationReviews.filter(r => r.stationId === selectedStation);
  const allReviews = [...yaReviews, ...internalReviews];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Отзывы и рейтинги</h1>

      {/* Station Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Выберите АЗС</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stations.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStation(s.id)}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                selectedStation === s.id
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-800 text-sm">{s.name}</div>
              <div className="text-xs text-gray-500 mt-1">⭐ {s.yandexRating}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Station Info */}
      {station && (
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{station.name}</h2>
              <p className="text-gray-600">{station.address}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-500">⭐ {station.yandexRating}</div>
              <div className="text-sm text-gray-500">{station.yandexReviewsCount} отзывов</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 text-xl">🟡</span>
                <span className="font-semibold text-gray-800">Яндекс Карты</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{station.yandexRating}/5</div>
              <div className="text-sm text-gray-600">{station.yandexReviewsCount} отзывов</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-500 text-xl">🔵</span>
                <span className="font-semibold text-gray-800">АЗСМонитор</span>
              </div>
              <div className="text-2xl font-bold text-gray-800">{station.rating}/5</div>
              <div className="text-sm text-gray-600">{station.reviewsCount} отзывов</div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Отзывы</h2>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-shadow">
            <i className="fas fa-plus mr-1"></i>Написать отзыв
          </button>
        </div>

        <div className="space-y-4">
          {allReviews.map((review) => {
            const source = 'source' in review && review.source === 'yandex' ? '🟡 Яндекс' : '🔵 АЗСМонитор';
            return (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg">{review.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{review.author}</div>
                      <div className="text-xs text-gray-500">{source}</div>
                    </div>
                  </div>
                  <div className="text-yellow-500">
                    {'⭐'.repeat(review.rating)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{review.text}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{review.timestamp.toLocaleDateString('ru-RU')}</span>
                  <button className="hover:text-orange-500">
                    <i className="fas fa-thumbs-up mr-1"></i>Полезно ({review.helpful})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
