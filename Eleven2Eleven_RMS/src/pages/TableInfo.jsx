import React from "react";
import { useTableContext } from "@/contexts/TableContext";
import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Users, Trash2, User, Phone } from "lucide-react";

export default function TableInfo() {
  const { reservations, removeReservation } = useTableContext();

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 text-gray-500">
        <p className="text-xl font-medium">No reservations found.</p>
        <p className="text-sm mt-2">Please go to "New Reservation" to create a new one.</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 uppercase tracking-wide">
        Reservation List ({reservations.length})
      </h1>
      
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
              {/* Customer Info Section */}
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

              {/* Reservation Details */}
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
                onClick={() => removeReservation(item.id)}
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