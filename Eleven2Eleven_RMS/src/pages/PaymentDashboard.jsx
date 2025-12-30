import React, { useState, useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { getProducts, getTables, updateTable } from '../data_access/api';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Receipt, DollarSign, Package, History } from 'lucide-react';

export default function PaymentDashboard() {
  const { savedOrders, transactionHistory, checkoutTable, downloadInvoice } = useOrders();
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedHistoryId, setSelectedHistoryId] = useState('');
  const [billMode, setBillMode] = useState('pending'); // 'pending' | 'history'

  // Load danh sách sản phẩm để lấy giá tiền & danh sách bàn để cập nhật trạng thái
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prods, tabs] = await Promise.all([getProducts(), getTables()]);
        setProducts(prods || []);
        setTables(tabs || []);
      } catch (err) {
        console.error('Lỗi load dữ liệu PaymentDashboard:', err);
      }
    };
    fetchData();
  }, []);

  // Tính toán doanh thu tổng từ lịch sử
  const totalRevenue = transactionHistory?.reduce((sum, t) => sum + (t.totalAmount || 0), 0) || 0;
  const totalBills = transactionHistory?.length || 0;

  // --- Tính toán dữ liệu cho đồ thị ngày / tháng ---
  const dailyStats = React.useMemo(() => {
    const map = {};
    (transactionHistory || []).forEach((t) => {
      if (!t.timestamp) return;
      const d = new Date(t.timestamp);
      if (Number.isNaN(d.getTime())) return;
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!map[key]) map[key] = { date: key, revenue: 0, count: 0 };
      map[key].revenue += t.totalAmount || 0;
      map[key].count += 1;
    });
    return Object.values(map)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .slice(-7); // 7 ngày gần nhất
  }, [transactionHistory]);

  const monthlyStats = React.useMemo(() => {
    const map = {};
    (transactionHistory || []).forEach((t) => {
      if (!t.timestamp) return;
      const d = new Date(t.timestamp);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
      if (!map[key]) map[key] = { month: key, revenue: 0, count: 0 };
      map[key].revenue += t.totalAmount || 0;
      map[key].count += 1;
    });
    return Object.values(map)
      .sort((a, b) => (a.month < b.month ? -1 : 1))
      .slice(-6); // 6 tháng gần nhất
  }, [transactionHistory]);

  const currentOrder =
    billMode === 'pending'
      ? savedOrders.find((o) => o.tableNumber === selectedTable)
      : null;

  const currentHistory =
    billMode === 'history'
      ? transactionHistory.find((t) => String(t.id) === String(selectedHistoryId))
      : null;

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.name === item.dishName);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handlePayment = async () => {
    if (!currentOrder) return;
    const total = calculateTotal(currentOrder.items);

    try {
      // 1. Cập nhật trạng thái bàn trên Firebase -> Available
      const currentTable = tables.find(
        (t) => (t.name || `Bàn ${t.id}`) === currentOrder.tableNumber,
      );

      if (currentTable) {
        await updateTable(currentTable.id, {
          status: 'Available',
          reservation_time: '',
        });
        setTables((prev) =>
          prev.map((t) =>
            t.id === currentTable.id ? { ...t, status: 'Available' } : t,
          ),
        );
      }

      // 2. Tải hóa đơn về máy (.txt)
      const invoiceForPrint = {
        tableNumber: currentOrder.tableNumber,
        items: currentOrder.items.map((item) => {
          const product = products.find((p) => p.name === item.dishName);
          return {
            ...item,
            price: product ? product.price : 0,
          };
        }),
        totalAmount: total,
        date: new Date().toLocaleString('vi-VN'),
      };
      downloadInvoice(invoiceForPrint);

      // 3. Ghi nhận giao dịch & xóa đơn hàng khỏi hệ thống
      checkoutTable(selectedTable, total);

      alert(`Thanh toán thành công bàn ${selectedTable}. Số tiền: ${total.toLocaleString()}đ`);
      setSelectedTable('');
    } catch (error) {
      console.error('Lỗi thanh toán từ PaymentDashboard:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái bàn hoặc lưu hóa đơn.');
    }
  };

  return (
    <div className="p-10 w-full bg-slate-50 overflow-y-auto h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
          Thanh toán & Dashboard Doanh thu
        </h1>
        <p className="text-sm md:text-base text-slate-500 mt-2 max-w-2xl mx-auto">
          Theo dõi doanh thu, xuất hóa đơn cho bàn đang dùng và xem lại các hóa đơn đã thanh toán.
        </p>
      </div>

      {/* Stats Cards (Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-500 text-white shadow-lg rounded-2xl">
          <CardContent className="pt-6 pb-6 flex items-center justify-between">
            <div className="flex-1 text-center md:text-left">
              <p className="opacity-90 text-xs md:text-sm font-medium uppercase tracking-wider">
                Tổng doanh thu
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold mt-2">
                {totalRevenue.toLocaleString()}đ
              </h2>
              <p className="text-[11px] md:text-xs opacity-75 mt-1">
                Tổng cộng tất cả hóa đơn đã được thanh toán
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-16 w-16 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <DollarSign size={40} className="opacity-80" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md rounded-2xl border border-slate-100 bg-white">
          <CardContent className="pt-6 pb-6 flex items-center justify-between">
            <div className="flex-1 text-center md:text-left">
              <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">
                Hóa đơn đã thanh toán
              </p>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mt-2">
                {totalBills}
              </h2>
              <p className="text-[11px] md:text-xs text-slate-400 mt-1">Số lượt checkout thành công</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center border border-emerald-100">
                <Package size={36} className="text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section: doanh thu theo ngày / số lượng đơn theo tháng (biểu đồ cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Biểu đồ cột doanh thu theo ngày */}
        <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base font-semibold text-slate-800">
              Doanh thu 7 ngày gần nhất
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {dailyStats.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có dữ liệu để hiển thị.
              </p>
            ) : (
              <div className="h-52 flex gap-3 md:gap-4">
                {dailyStats.map((d) => {
                  const maxRevenue = Math.max(...dailyStats.map((x) => x.revenue || 0)) || 1;
                  const height = `${Math.max(
                    8,
                    Math.round((d.revenue / maxRevenue) * 100),
                  )}%`;
                  return (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center justify-end h-full text-[10px] md:text-xs"
                    >
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className="w-full mx-auto rounded-t-lg bg-gradient-to-t from-emerald-400 to-blue-500 shadow-sm"
                          style={{ height }}
                        />
                      </div>
                      <span className="mt-1 text-slate-500">
                        {new Date(d.date).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                        })}
                      </span>
                      <span className="text-[10px] text-slate-700 font-semibold">
                        {d.revenue.toLocaleString()}đ
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Biểu đồ cột số lượng hóa đơn theo tháng */}
        <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm md:text-base font-semibold text-slate-800">
              Số lượng hóa đơn theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            {monthlyStats.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                Chưa có dữ liệu để hiển thị.
              </p>
            ) : (
              <div className="h-52 flex gap-3 md:gap-4">
                {monthlyStats.map((m) => {
                  const maxCount = Math.max(...monthlyStats.map((x) => x.count || 0)) || 1;
                  const height = `${Math.max(
                    8,
                    Math.round((m.count / maxCount) * 100),
                  )}%`;
                  const [year, month] = m.month.split('-');
                  return (
                    <div
                      key={m.month}
                      className="flex-1 flex flex-col items-center justify-end h-full text-[10px] md:text-xs"
                    >
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className="w-full mx-auto rounded-t-lg bg-gradient-to-t from-indigo-400 to-purple-500 shadow-sm"
                          style={{ height }}
                        />
                      </div>
                      <span className="mt-1 text-slate-500">
                        {`T${Number(month)}-${year.slice(2)}`}
                      </span>
                      <span className="text-[10px] text-slate-700 font-semibold">
                        {m.count} đơn
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Billing Section (Thanh toán / Xem lại) */}
        <Card className="shadow-md border border-slate-100 rounded-2xl bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Receipt className="text-emerald-600 h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Xuất hóa đơn bàn</span>
                  <span className="text-[11px] text-slate-400">
                    Thanh toán bàn đang dùng hoặc xem lại hóa đơn cũ
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Tabs chế độ xem */}
            <div className="inline-flex mb-4 rounded-full bg-slate-100 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setBillMode('pending');
                  setSelectedHistoryId('');
                }}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  billMode === 'pending' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500'
                }`}
              >
                Đơn đang chờ
              </button>
              <button
                type="button"
                onClick={() => {
                  setBillMode('history');
                  setSelectedTable('');
                }}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  billMode === 'history' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'
                }`}
              >
                Hóa đơn đã thanh toán
              </button>
            </div>

            {/* Bộ chọn đối tượng */}
            {billMode === 'pending' ? (
              <select
                className="w-full p-2.5 border rounded-xl mb-4 bg-white shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                <option value="">-- Chọn bàn đang chờ thanh toán --</option>
                {savedOrders?.map((o) => (
                  <option key={o.tableNumber} value={o.tableNumber}>
                    Bàn số: {o.tableNumber}
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="w-full p-2.5 border rounded-xl mb-4 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                value={selectedHistoryId}
                onChange={(e) => setSelectedHistoryId(e.target.value)}
              >
                <option value="">-- Chọn hóa đơn đã thanh toán --</option>
                {transactionHistory &&
                  transactionHistory.length > 0 &&
                  transactionHistory
                    .slice()
                    .reverse()
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {`Bàn ${t.tableNumber} - ${new Date(t.timestamp).toLocaleString('vi-VN')}`}
                      </option>
                    ))}
              </select>
            )}

            {/* Hiển thị nội dung hóa đơn */}
            {billMode === 'pending' ? (
              currentOrder ? (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-dashed border-slate-300 p-6 rounded-2xl shadow-inner">
                  <div className="text-center mb-4">
                    <h3 className="font-black text-xl tracking-wide text-slate-900">RESTAURANT BILL</h3>
                    <p className="text-[11px] text-slate-500 uppercase mt-1">
                      Bàn: <span className="font-semibold text-slate-700">{selectedTable}</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date().toLocaleString('vi-VN')}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    {currentOrder?.items?.map((item, i) => {
                      const p = products.find((x) => x.name === item.dishName);
                      const lineTotal = p ? p.price * item.quantity : 0;
                      return (
                        <div key={i} className="flex justify-between items-center py-1">
                          <span className="text-slate-700">
                            {item.dishName}
                            <span className="text-xs text-slate-400"> x{item.quantity}</span>
                          </span>
                          <span className="font-semibold text-slate-800">
                            {lineTotal.toLocaleString()}đ
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-300 mt-4 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-sm text-slate-700">TỔNG CỘNG</span>
                    <span className="font-extrabold text-2xl text-blue-600">
                      {calculateTotal(currentOrder.items).toLocaleString()}đ
                    </span>
                  </div>

                  <Button
                    className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide"
                    onClick={handlePayment}
                  >
                    XÁC NHẬN THANH TOÁN
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-2xl bg-slate-50/60 text-sm">
                  Vui lòng chọn bàn đang chờ để hiển thị chi tiết hóa đơn
                </div>
              )
            ) : currentHistory ? (
              <div className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-indigo-500 tracking-wider">
                      HÓA ĐƠN ĐÃ THANH TOÁN
                    </p>
                    <h3 className="font-black text-xl text-slate-900 mt-1">
                      Bàn {currentHistory.tableNumber}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    ĐÃ THANH TOÁN
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-4">
                  {new Date(currentHistory.timestamp).toLocaleString('vi-VN')}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  {currentHistory.items?.map((item, i) => {
                    const p = products.find((x) => x.name === item.dishName);
                    const lineTotal = p ? p.price * item.quantity : 0;
                    return (
                      <div key={i} className="flex justify-between items-center py-1">
                        <span className="text-slate-700">
                          {item.dishName}
                          <span className="text-xs text-slate-400"> x{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          {lineTotal.toLocaleString()}đ
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-700">TỔNG CỘNG</span>
                  <span className="font-extrabold text-2xl text-indigo-600">
                    {currentHistory.totalAmount.toLocaleString()}đ
                  </span>
                </div>

                <div className="mt-4 flex flex-col items-center gap-2">
                  <p className="text-[11px] text-slate-400 text-center">
                    Đây là bản xem lại hóa đơn. Bạn có thể in lại hóa đơn bằng nút bên dưới.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="text-xs md:text-sm px-4 py-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => {
                      const total =
                        currentHistory.totalAmount ||
                        calculateTotal(currentHistory.items || []);
                      const invoiceForPrint = {
                        tableNumber: currentHistory.tableNumber,
                        items: (currentHistory.items || []).map((item) => {
                          const p = products.find((x) => x.name === item.dishName);
                          return {
                            ...item,
                            price: p ? p.price : 0,
                          };
                        }),
                        totalAmount: total,
                        date: new Date(currentHistory.timestamp).toLocaleString('vi-VN'),
                      };
                      downloadInvoice(invoiceForPrint);
                    }}
                  >
                    In lại hóa đơn
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-2xl bg-slate-50/60 text-sm">
                Chọn một hóa đơn trong lịch sử để xem lại chi tiết.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction History (Lịch sử) */}
        <Card className="shadow-md rounded-2xl border border-slate-100 bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <History className="text-blue-600 h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Lịch sử giao dịch gần đây</span>
                <span className="text-[11px] text-slate-400">Danh sách các hóa đơn mới nhất</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1.5">
              {transactionHistory && transactionHistory.length > 0 ? (
                transactionHistory
                  .slice()
                  .reverse()
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setBillMode('history');
                        setSelectedHistoryId(String(t.id));
                      }}
                      className="w-full text-left flex justify-between items-center p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">Bàn {t.tableNumber}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">
                          {new Date(t.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs">
                        +{t.totalAmount.toLocaleString()}đ
                      </span>
                    </button>
                  ))
              ) : (
                <p className="text-center text-slate-400 py-10 italic text-sm">
                  Chưa có giao dịch nào được thực hiện
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}