import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Plus, Minus, X } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Link } from 'react-router-dom';

export default function OrderPage() {
  const [tableNumber, setTableNumber] = useState('');
  const [isTableConfirmed, setIsTableConfirmed] = useState(false);
  const [orderItems, setOrderItems] = useState([
    { id: '1', dishName: '', quantity: 1 }
  ]);
  const { saveOrder, getOrderByTable } = useOrders();

  const addOrderItem = () => {
    const newItem = {
      id: Date.now().toString(),
      dishName: '',
      quantity: 1
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const updateDishName = (id, name) => {
    setOrderItems(orderItems.map(item =>
      item.id === id ? { ...item, dishName: name } : item
    ));
  };

  const updateQuantity = (id, delta) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleConfirmOrder = () => {
    if (!tableNumber.trim()) {
      alert('Vui lòng nhập số bàn!');
      return;
    }
    const validItems = orderItems.filter(item => item.dishName.trim());
    if (validItems.length > 0) {
      const result = saveOrder(tableNumber, validItems);
      
      if (result === 'updated') {
        alert(`Đã cập nhật đơn hàng cho Bàn ${tableNumber}!`);
      } else {
        alert(`Đã lưu đơn hàng mới cho Bàn ${tableNumber}!`);
      }
      
      // Reset form
      handleReset();
    } else {
      alert('Vui lòng thêm ít nhất một món!');
    }
  };

  const handleReset = () => {
    setTableNumber('');
    setIsTableConfirmed(false);
    setOrderItems([{ id: Date.now().toString(), dishName: '', quantity: 1 }]);
  };

  const handleTableConfirm = () => {
    if (!tableNumber.trim()) {
      alert('Vui lòng nhập số bàn!');
      return;
    }
    
    // Tìm đơn hàng đã lưu cho bàn này
    const existingOrder = getOrderByTable(tableNumber);
    
    if (existingOrder) {
      // Nếu tìm thấy, load danh sách món đã lưu
      setOrderItems(existingOrder.items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random() // Tạo ID mới cho mỗi item
      })));
      alert(`Đã tải đơn hàng có sẵn cho Bàn ${tableNumber}`);
    } else {
      // Nếu không tìm thấy, giữ danh sách món trống
      setOrderItems([{ id: Date.now().toString(), dishName: '', quantity: 1 }]);
    }
    
    setIsTableConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm py-3 px-4 sticky top-0 z-10 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="text-blue-600 text-lg">Order Management</h1>
          <Link to="/kitchen">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Xem Bếp
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 max-w-2xl mx-auto">
        {/* Table Number Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 mb-4">
          <label className="text-slate-700 text-sm block mb-2">
            Số Bàn
          </label>
          <Input
            type="text"
            placeholder="e.g., 'Bàn 12'"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="h-10 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
            disabled={isTableConfirmed}
          />
          {!isTableConfirmed ? (
            <Button
              onClick={handleTableConfirm}
              className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-sm mt-3"
            >
              Xác Nhận Bàn
            </Button>
          ) : (
            <div className="mt-3 flex items-center justify-between">
              <span className="text-blue-600 text-sm">✓ Đã xác nhận bàn: {tableNumber}</span>
              <Button
                onClick={() => setIsTableConfirmed(false)}
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700 text-xs h-7"
              >
                Đổi bàn
              </Button>
            </div>
          )}
        </div>

        {/* Order Items Section - Only show when table is confirmed */}
        {isTableConfirmed && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-700 text-sm">Danh Sách Món</h2>
              <Button
                onClick={addOrderItem}
                variant="outline"
                size="sm"
                className="border-blue-300 text-blue-600 hover:bg-blue-50 h-8 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Thêm Món
              </Button>
            </div>

            {orderItems.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="text"
                        placeholder="Tên món ăn"
                        value={item.dishName}
                        onChange={(e) => updateDishName(item.id, e.target.value)}
                        className="h-9 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    {orderItems.length > 1 && (
                      <Button
                        onClick={() => removeOrderItem(item.id)}
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-xs flex-shrink-0 w-16">Số lượng:</span>
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        onClick={() => updateQuantity(item.id, -1)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 flex-shrink-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <div className="flex-1 text-center bg-slate-50 rounded-lg py-1.5 px-3 border border-slate-200 min-w-0">
                        <span className="text-slate-800 text-sm">{item.quantity}</span>
                      </div>
                      
                      <Button
                        onClick={() => updateQuantity(item.id, 1)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 flex-shrink-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                onClick={handleConfirmOrder}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-sm"
              >
                Xác Nhận Đơn Hàng
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full h-10 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
              >
                Làm Mới
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
