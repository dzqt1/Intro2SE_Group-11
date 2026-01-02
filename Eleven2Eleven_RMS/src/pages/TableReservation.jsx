import React, { useState, useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Đã xóa import TableContext ở đây

import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field, FieldLabel, FieldContent, FieldSet } from "@/components/ui/field";

export default function TableReservation() {
  const navigate = useNavigate();
  // Đã xóa const { addReservation } ...

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    tableNumber: "",
    guestCount: "",
    date: "",
    time: ""
  });

  const [error, setError] = useState("");
  const [minDate, setMinDate] = useState("");
  const [availableTables, setAvailableTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Lấy ngày hiện tại
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  // 2. GỌI API FIREBASE LẤY DANH SÁCH BÀN
  useEffect(() => {
    const fetchTablesFromFirebase = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://eleven2eleven-rms-db-default-rtdb.asia-southeast1.firebasedatabase.app/Table.json");
        if (!response.ok) throw new Error('Could not fetch tables.');
        
        const data = await response.json();
        const loadedTables = Object.values(data).filter(Boolean);
        const freeTables = loadedTables.filter(table => table.status === "Available");
        setAvailableTables(freeTables);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setIsLoading(false);
    };
    fetchTablesFromFirebase();
  }, []); 

  // 3. XỬ LÝ KHI NHẬP LIỆU
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "tableNumber") {
        const selectedTable = availableTables.find(t => t.name === value);
        if (selectedTable) {
            setFormData(prev => ({ ...prev, [name]: value, guestCount: selectedTable.seats }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError("");
  };

  // --- HÀM FORMAT GIỜ AM/PM ---
  const formatTimeAMPM = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; 
    return `${String(h).padStart(2, '0')}:${minutes} ${ampm}`;
  };

const handleSubmit = async () => {
    // 1. Validate cơ bản
    if (!formData.customerName || !formData.phoneNumber || !formData.tableNumber || !formData.guestCount || !formData.date || !formData.time) {
      setError("Please fill in all fields!");
      return; 
    }

    const inputDate = new Date(formData.date);
    const now = new Date();
    const [hours, minutes] = formData.time.split(':');
    const selectedDateTime = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), hours, minutes);

    if (selectedDateTime < now) {
      setError("Cannot select a past date or time!");
      return;
    }

    setIsSubmitting(true);
    
    try {
        // Lấy thông tin bàn đang chọn
        const selectedTableObj = availableTables.find(t => t.name === formData.tableNumber);
        const tableId = selectedTableObj ? selectedTableObj.id : "";
        
        // Format giờ hiện tại sang AM/PM để so sánh với Database
        const formattedTime = formatTimeAMPM(formData.time);

        // --- BƯỚC MỚI: KIỂM TRA TRÙNG LỊCH (CONFLICT CHECK) ---
        
        // A. Tải dữ liệu đặt bàn hiện có về
        const checkRes = await fetch("https://eleven2eleven-rms-db-default-rtdb.asia-southeast1.firebasedatabase.app/Reservation.json");
        const checkData = await checkRes.json();
        
        let isConflict = false;

        // B. Duyệt qua danh sách để tìm trùng
        if (checkData) {
            for (const key in checkData) {
                const res = checkData[key];
                // Bỏ qua các dữ liệu rác
                if (!res || key === "res_sample") continue;

                // Điều kiện trùng: Cùng ID Bàn + Cùng Ngày + Cùng Giờ
                // Lưu ý: res.table_id có thể là số hoặc chuỗi, nên dùng so sánh lỏng (==) hoặc ép kiểu
                if (String(res.table_id) === String(tableId) && 
                    res.date === formData.date && 
                    res.time === formattedTime) { // So sánh chuỗi thời gian AM/PM
                    
                    isConflict = true;
                    break; // Tìm thấy 1 cái trùng là dừng ngay
                }
            }
        }

        // C. Nếu trùng thì báo lỗi và THOÁT luôn (return)
        if (isConflict) {
            setError(`Bàn này đã được đặt vào thời gian này. Vui lòng chọn giờ hoặc bàn khác!`);
            setIsSubmitting(false); // Tắt loading
            return; // Dừng hàm, không chạy đoạn POST bên dưới nữa
        }
        
        // --------------------------------------------------------

        // Nếu không trùng thì mới tạo object và lưu
        const newReservationData = {
            customer_name: formData.customerName,
            phone: formData.phoneNumber,
            table_name: formData.tableNumber,
            table_id: tableId,
            guest_count: formData.guestCount,
            date: formData.date,
            time: formattedTime,
            status: "Confirmed",
            created_at: new Date().toISOString()
        };

        const response = await fetch("https://eleven2eleven-rms-db-default-rtdb.asia-southeast1.firebasedatabase.app/Reservation.json", {
            method: 'POST',
            body: JSON.stringify(newReservationData),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error("Failed to save reservation.");

        navigate("/table-info");

    } catch (err) {
        console.error("Error saving reservation:", err);
        setError("Failed to create reservation. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
      setFormData({ customerName: "", phoneNumber: "", tableNumber: "", guestCount: "", date: "", time: "" });
      setError("");
  }

  return (
    <div className="w-full h-full min-h-screen bg-gray-50 flex items-center justify-center p-10">
      <Card className="w-full max-w-3xl bg-white shadow-xl border border-gray-200">
        <CardHeader className="flex flex-col items-center justify-center pb-2 pt-8 relative">
          <CardTitle className="text-4xl font-serif text-gray-800 tracking-wide uppercase">
            Create Reservation
          </CardTitle>
        </CardHeader>

        <CardContent className="px-8 py-6">
          <FieldSet>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Customer Name</FieldLabel>
                <FieldContent>
                  <Input name="customerName" className="h-12 text-lg bg-gray-100/50" value={formData.customerName} onChange={handleChange} disabled={isSubmitting} />
                </FieldContent>
              </Field>
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Phone Number</FieldLabel>
                <FieldContent>
                  <Input name="phoneNumber" className="h-12 text-lg bg-gray-100/50" value={formData.phoneNumber} onChange={handleChange} disabled={isSubmitting} />
                </FieldContent>
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Table Number</FieldLabel>
                <FieldContent>
                  <Select name="tableNumber" value={formData.tableNumber} onChange={handleChange} className="h-12 text-lg bg-gray-100/50 border-gray-300 focus-visible:ring-gray-400" disabled={isLoading || isSubmitting}>
                    <option value="" disabled>{isLoading ? "Loading tables..." : "Select a table..."}</option>
                    {availableTables.length > 0 ? (
                        availableTables.map((table) => (
                            <option key={table.id} value={table.name}>{table.name} (ID: {table.id}) - {table.area}</option>
                        ))
                    ) : (
                        <option value="" disabled>No available tables</option>
                    )}
                  </Select>
                </FieldContent>
              </Field>
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Number of Guests</FieldLabel>
                <FieldContent>
                  <Input name="guestCount" type="number" min="1" className="h-12 text-lg bg-gray-100/50" value={formData.guestCount} onChange={handleChange} disabled={isSubmitting} />
                </FieldContent>
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Date</FieldLabel>
                <FieldContent>
                  <Input name="date" type="date" min={minDate} className="h-12 text-lg bg-gray-100/50 block w-full" value={formData.date} onChange={handleChange} disabled={isSubmitting} />
                </FieldContent>
              </Field>
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Time</FieldLabel>
                <FieldContent>
                  <Input name="time" type="time" className="h-12 text-lg bg-gray-100/50 block w-full" value={formData.time} onChange={handleChange} disabled={isSubmitting} />
                </FieldContent>
              </Field>
            </div>
          </FieldSet>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 pb-8 pt-0">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-md border border-red-200 w-full justify-center">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium text-sm">{error}</span>
            </div>
          )}
          <Button className="w-40 h-12 text-lg uppercase tracking-wider font-semibold bg-[#6d4c41] hover:bg-[#5d4037] text-white transition-all mt-2 flex gap-2 items-center justify-center" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Confirm
          </Button>
          <Button variant="link" className="text-gray-500 hover:text-black" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}