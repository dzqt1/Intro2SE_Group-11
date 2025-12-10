import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTableContext } from "@/contexts/TableContext";

import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldContent, FieldSet } from "@/components/ui/field";

export default function TableReservation() {
  const navigate = useNavigate();
  const { addReservation } = useTableContext();

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

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = () => {
    // 1. Validation
    if (!formData.customerName || !formData.phoneNumber || !formData.tableNumber || !formData.guestCount || !formData.date || !formData.time) {
      setError("Please fill in all fields!");
      return; 
    }

    // 2. Date Validation
    const inputDate = new Date(formData.date);
    const now = new Date();
    const [hours, minutes] = formData.time.split(':');
    const selectedDateTime = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), hours, minutes);

    if (selectedDateTime < now) {
      setError("Cannot select a past date or time!");
      return;
    }

    // 3. Save & Redirect
    addReservation(formData);
    navigate("/table-info");
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
          <p className="text-sm text-gray-500 mt-2">Staff Entry Form</p>
        </CardHeader>

        <CardContent className="px-8 py-6">
          <FieldSet>
            {/* Row 1: Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-2">
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Customer Name</FieldLabel>
                <FieldContent>
                  <Input 
                    name="customerName" placeholder="Ex: John Doe" 
                    className="h-12 text-lg bg-gray-100/50"
                    value={formData.customerName} onChange={handleChange}
                  />
                </FieldContent>
              </Field>

              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Phone Number</FieldLabel>
                <FieldContent>
                  <Input 
                    name="phoneNumber" placeholder="Ex: 0912..." 
                    className="h-12 text-lg bg-gray-100/50"
                    value={formData.phoneNumber} onChange={handleChange}
                  />
                </FieldContent>
              </Field>
            </div>

            {/* Row 2: Table Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Table Number</FieldLabel>
                <FieldContent>
                  <Input 
                    name="tableNumber" placeholder="Ex: Table 05" 
                    className="h-12 text-lg bg-gray-100/50"
                    value={formData.tableNumber} onChange={handleChange}
                  />
                </FieldContent>
              </Field>

              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Number of Guests</FieldLabel>
                <FieldContent>
                  <Input 
                    name="guestCount" type="number" min="1" placeholder="Ex: 4" 
                    className="h-12 text-lg bg-gray-100/50"
                    value={formData.guestCount} onChange={handleChange}
                  />
                </FieldContent>
              </Field>
            </div>

            {/* Row 3: Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Date</FieldLabel>
                <FieldContent>
                  <Input 
                    name="date" type="date" min={minDate}
                    className="h-12 text-lg bg-gray-100/50 block w-full"
                    value={formData.date} onChange={handleChange}
                  />
                </FieldContent>
              </Field>

              <Field orientation="vertical">
                <FieldLabel className="text-lg font-serif text-gray-700 font-medium">Time</FieldLabel>
                <FieldContent>
                  <Input 
                    name="time" type="time" 
                    className="h-12 text-lg bg-gray-100/50 block w-full"
                    value={formData.time} onChange={handleChange}
                  />
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
          <Button 
            className="w-40 h-12 text-lg uppercase tracking-wider font-semibold bg-[#6d4c41] hover:bg-[#5d4037] text-white transition-all mt-2"
            onClick={handleSubmit}
          >
            Confirm
          </Button>
          <Button variant="link" className="text-gray-500 hover:text-black" onClick={handleCancel}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}