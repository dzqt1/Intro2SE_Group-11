// Lưu trữ dữ liệu mã bàn và danh sách món tương ứng
// Khi thanh toán xóa hết dữ liệu về mã bàn đó trong mảng và xuất ra file hóa đơn
import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();
const STORAGE_KEY = 'restaurant_orders';

export function OrderProvider({ children }) {
  // 1. Load dữ liệu ban đầu
  const [savedOrders, setSavedOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  });

  // 2. Tự động lưu vào localStorage khi state thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedOrders));
  }, [savedOrders]);

  // 3. Chỉ lắng nghe sự kiện 'storage' (để đồng bộ khi mở 2 tab trình duyệt)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSavedOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- CÁC HÀM XỬ LÝ LOGIC (Giữ nguyên như cũ) ---
  
  const saveOrder = (tableNumber, items) => {
    const existingOrderIndex = savedOrders.findIndex(
      order => order.tableNumber === tableNumber
    );
    
    // Đảm bảo item có trạng thái completed
    const itemsWithStatus = items.map(item => ({
      ...item,
      completed: item.completed || false
    }));

    let newOrders;
    let status;

    if (existingOrderIndex !== -1) {
      newOrders = [...savedOrders];
      newOrders[existingOrderIndex] = {
        tableNumber,
        items: itemsWithStatus
      };
      status = 'updated';
    } else {
      newOrders = [...savedOrders, { tableNumber, items: itemsWithStatus }];
      status = 'added';
    }
    
    setSavedOrders(newOrders); // React sẽ tự động cập nhật UI ở OrderPage và KitchenPage
    return status;
  };

  const getOrderByTable = (tableNumber) => {
    return savedOrders.find(order => order.tableNumber === tableNumber);
  };

  const markPendingItemsAsCompleted = (tableNumber) => {
    setSavedOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.tableNumber === tableNumber) {
          return {
            ...order,
            items: order.items.map(item => ({ ...item, completed: true }))
          };
        }
        return order;
      });
    });
  };

  return (
    <OrderContext.Provider value={{ savedOrders, saveOrder, getOrderByTable, markPendingItemsAsCompleted }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}