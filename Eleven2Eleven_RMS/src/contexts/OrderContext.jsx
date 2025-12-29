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

  // 3. Đồng bộ hóa giữa các tab trình duyệt
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setSavedOrders(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- CÁC HÀM XỬ LÝ LOGIC ---

  const saveOrder = (tableNumber, items) => {
    const existingOrderIndex = savedOrders.findIndex(
      order => order.tableNumber === tableNumber
    );
    
    // Đảm bảo item có trạng thái completed (mặc định false nếu mới)
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
    
    setSavedOrders(newOrders);
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

  // --- [MỚI] HÀM XÓA ĐƠN HÀNG (Dùng khi thanh toán xong) ---
  const removeOrder = (tableNumber) => {
    setSavedOrders(prevOrders => prevOrders.filter(order => order.tableNumber !== tableNumber));
  };

  // --- [MỚI] HÀM XUẤT HÓA ĐƠN RA FILE .TXT ---
  const downloadInvoice = (invoiceData) => {
    /* invoiceData cần có cấu trúc:
       {
         tableNumber: "Bàn 1",
         items: [...],
         totalAmount: 500000,
         date: "12:30 28/12/2025"
       }
    */
    
    // 1. Tạo nội dung hóa đơn
    let content = `================================\n`;
    content += `       HÓA ĐƠN THANH TOÁN       \n`;
    content += `================================\n\n`;
    content += `Bàn: ${invoiceData.tableNumber}\n`;
    content += `Thời gian: ${invoiceData.date || new Date().toLocaleString('vi-VN')}\n`;
    content += `--------------------------------\n`;
    content += `MÓN ĂN              SL    THÀNH TIỀN\n`;
    content += `--------------------------------\n`;

    invoiceData.items.forEach(item => {
        // Giả sử item có truyền thêm price vào lúc gọi hàm này
        const itemTotal = (item.price * item.quantity).toLocaleString('vi-VN');
        // Format đơn giản
        content += `${item.dishName.padEnd(20)} x${item.quantity.toString().padEnd(4)} ${itemTotal}đ\n`;
    });

    content += `--------------------------------\n`;
    content += `TỔNG CỘNG:          ${invoiceData.totalAmount.toLocaleString('vi-VN')} VNĐ\n`;
    content += `================================\n`;
    content += `    Cảm ơn và hẹn gặp lại!      \n`;

    // 2. Tạo Blob và tải xuống
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Tên file: HoaDon_Ban1_TIMESTAMP.txt
    link.download = `HoaDon_${invoiceData.tableNumber.replace(/\s/g, '')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <OrderContext.Provider value={{ 
        savedOrders, 
        saveOrder, 
        getOrderByTable, 
        markPendingItemsAsCompleted,
        removeOrder,      // <--- Đã thêm
        downloadInvoice   // <--- Đã thêm
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}