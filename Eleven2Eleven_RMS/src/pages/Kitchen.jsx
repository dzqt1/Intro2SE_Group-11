import React, { useState } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from '../components/ui/button';
import { ChefHat, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function KitchenPage() {
  const { savedOrders, markPendingItemsAsCompleted } = useOrders();
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableClick = (tableNumber) => {
    setSelectedTable(selectedTable === tableNumber ? null : tableNumber);
  };

  const handleCompleteOrder = (tableNumber) => {
    markPendingItemsAsCompleted(tableNumber);
    setSelectedTable(null);
  };

  // Lọc các bàn có món chưa hoàn thành
  const getPendingItems = (items) => {
    return items.filter(item => !item.completed);
  };

  const allItemsCompleted = (items) => {
    return items.every(item => item.completed);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-4 sticky top-0 z-10 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-blue-600" />
            <h1 className="text-blue-600 text-lg">Bếp - Danh Sách Đơn Hàng</h1>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {savedOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200 text-center">
            <Clock className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Hiện không có đơn đặt món</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedOrders.map((order) => {
              const pendingItems = getPendingItems(order.items);
              const isAllCompleted = allItemsCompleted(order.items);
              const isSelected = selectedTable === order.tableNumber;

              return (
                <div
                  key={order.tableNumber}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
                >
                  {/* Table Header - Clickable */}
                  <button
                    onClick={() => handleTableClick(order.tableNumber)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                        isAllCompleted ? 'bg-green-500' : 'bg-blue-600'
                      }`}>
                        {isAllCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-sm">{order.tableNumber}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <h3 className="text-slate-800 text-sm">{order.tableNumber}</h3>
                        <p className="text-xs text-slate-500">
                          {isAllCompleted 
                            ? 'Đã hoàn tất' 
                            : `${pendingItems.length} món chờ làm`
                          }
                        </p>
                      </div>
                    </div>
                    <div className={`transform transition-transform ${isSelected ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Order Details - Expandable */}
                  {isSelected && (
                    <div className="border-t border-slate-200 bg-slate-50">
                      {isAllCompleted ? (
                        <div className="p-4 text-center">
                          <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                          <p className="text-slate-600 text-sm">Đã hoàn tất giao món</p>
                        </div>
                      ) : (
                        <>
                          <div className="p-4 space-y-2">
                            <h4 className="text-xs text-slate-500 mb-3">Danh sách món cần làm:</h4>
                            {pendingItems.map((item, index) => (
                              <div
                                key={index}
                                className="bg-white rounded-lg p-3 border border-slate-200 flex items-center justify-between"
                              >
                                <div className="flex-1">
                                  <p className="text-slate-800 text-sm">{item.dishName}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs">
                                    x{item.quantity}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Complete Button */}
                          <div className="p-4 pt-0">
                            <Button
                              onClick={() => handleCompleteOrder(order.tableNumber)}
                              className="w-full h-10 bg-green-600 hover:bg-green-700 text-sm"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Đã Hoàn Thành
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
