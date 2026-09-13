import { Link } from 'react-router-dom';

export const OrdersPage = () => {
  // Симуляция заказов
  const orders = [
    {
      id: 'MF-A1B2C3',
      stationName: 'АЗСМонитор #4',
      fuelType: 'АИ-95',
      liters: 40,
      totalPrice: 2272,
      slotTime: '14:30',
      status: 'confirmed',
      queueNumber: 1,
    },
    {
      id: 'MF-D4E5F6',
      stationName: 'АЗСМонитор #1',
      fuelType: 'АИ-92',
      liters: 30,
      totalPrice: 1575,
      slotTime: '13:15',
      status: 'completed',
      queueNumber: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Мои заказы</h1>

      {/* Active Orders */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Активные заказы</h2>
        {orders.filter(o => o.status === 'confirmed').length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-inbox text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-600 mb-4">Нет активных заказов</p>
            <Link
              to="/order"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
            >
              Создать заказ
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.filter(o => o.status === 'confirmed').map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{order.stationName}</h3>
                    <p className="text-sm text-gray-500">Заказ #{order.id}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                    Подтверждён
                  </span>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 mb-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Ваш слот</div>
                  <div className="text-3xl font-bold text-orange-600">{order.slotTime}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Позиция в очереди: #{order.queueNumber}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Топливо</div>
                    <div className="font-bold text-gray-800">{order.fuelType}</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Объём</div>
                    <div className="font-bold text-gray-800">{order.liters} л</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500">Сумма</div>
                    <div className="font-bold text-gray-800">{order.totalPrice} ₽</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-50 text-orange-600 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-100 transition-colors">
                    <i className="fas fa-qrcode mr-1"></i>QR-код
                  </button>
                  <button className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
                    <i className="fas fa-route mr-1"></i>Маршрут
                  </button>
                  <button className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                    <i className="fas fa-times mr-1"></i>Отменить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">История заказов</h2>
        <div className="space-y-3">
          {orders.filter(o => o.status === 'completed').map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm opacity-70">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">{order.stationName}</h4>
                  <p className="text-sm text-gray-500">
                    {order.fuelType} • {order.liters}л • {order.totalPrice} ₽
                  </p>
                </div>
                <span className="text-xs text-gray-400">Завершён</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
