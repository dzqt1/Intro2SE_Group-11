import React, { useState, useEffect } from "react";
import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Users, Trash2, User, Phone, Loader2 } from "lucide-react";

export default function TableInfo() {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. THÊM HÀM NÀY VÀO ĐỂ KHẮC PHỤC LỖI ---
  const formatDisplayTime = (timeStr) => {
    // Nếu chuỗi rỗng hoặc đã có AM/PM thì trả về luôn
    if (!timeStr || timeStr.includes("AM") || timeStr.includes("PM")) return timeStr;
    
    // Nếu là dạng 24h (14:30), convert nó
    const [hours, minutes] = timeStr.split(':');
    if (!hours || !minutes) return timeStr; 

    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; 
    return `${String(h).padStart(2, '0')}:${minutes} ${ampm}`;
  };
  // ---------------------------------------------

  const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://eleven2eleven-rms-db-default-rtdb.asia-southeast1.firebasedatabase.app/Reservation.json");
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        const loadedReservations = [];
        for (const key in data) {
          // Lọc dữ liệu rác
          if (key === "res_sample") continue;
          if (!data[key].customer_name || data[key].customer_name.trim() === "") continue;

          if (data[key]) {
            loadedReservations.push({
              id: key, 
              customerName: data[key].customer_name || "Unknown",
              phoneNumber: data[key].phone || "N/A",
              tableNumber: data[key].table_name || "Unknown Table",
              
              // 2. Giờ đây hàm này đã tồn tại, code sẽ chạy mượt mà
              time: formatDisplayTime(data[key].time || "--:--"), 
              
              date: data[key].date || new Date().toISOString().split('T')[0],
              guestCount: data[key].guests || data[key].guest_count || "?",
              status: data[key].status || "Confirmed"
            });
          }
        }
        
        setReservations(loadedReservations.reverse());
      } catch (err) {
        console.error("Error fetching reservations:", err);
      }
      setIsLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleRemoveReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    try {
      await fetch(`https://eleven2eleven-rms-db-default-rtdb.asia-southeast1.firebasedatabase.app/Reservation/${id}.json`, {
        method: 'DELETE',
      });
      setReservations((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete reservation:", error);
      alert("Error deleting reservation. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="mt-2 text-gray-500">Loading reservations...</p>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 text-gray-500">
        <p className="text-xl font-medium">No reservations found.</p>
        <p className="text-sm mt-2">Please go to "Table Reservation" to create a new one.</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 uppercase tracking-wide">
          Reservation List ({reservations.length})
        </h1>
        <Button variant="outline" onClick={fetchReservations} size="sm">
            Refresh Data
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reservations.map((item) => (
          <Card key={item.id} className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500 flex flex-col">
            <CardHeader className="pb-3 border-b border-gray-100 bg-white rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold text-emerald-700">
                    {item.tableNumber}
                  </CardTitle>
                  <p className="text-xs text-gray-400 mt-1">ID: #{item.id}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                  {item.status}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="py-4 space-y-3 flex-1 bg-white">
              <div className="bg-gray-50 p-3 rounded-md space-y-2 mb-2">
                <div className="flex items-center text-gray-800 font-semibold">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  <span className="truncate">{item.customerName}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  <span>{item.phoneNumber}</span>
                </div>
              </div>

              <div className="space-y-2 pl-1">
                <div className="flex items-center text-gray-700 text-sm">
                  <Users className="w-4 h-4 mr-3 text-gray-400" />
                  <span>Guests: <strong>{item.guestCount}</strong></span>
                </div>
                <div className="flex items-center text-gray-700 text-sm">
                  <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                  <span>Date: {item.date}</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm">
                  <Clock className="w-4 h-4 mr-3 text-gray-400" />
                  <span>Time: <span className="text-emerald-600 font-bold">{item.time}</span></span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-3 pb-4 border-t bg-gray-50 flex justify-end rounded-b-xl">
               <Button 
                variant="destructive" 
                size="sm" 
                className="gap-2 shadow-sm"
                onClick={() => handleRemoveReservation(item.id)}
              >
                <Trash2 className="w-4 h-4" /> Cancel
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}