import UserLayout from "@/components/custom/User";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Search } from "lucide-react";
 
export default function UserManagement() {
    const mockUsers = [
        { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Manager" },
        { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "Waiter" },
        { id: 4, name: "Alice Williams", email: "alice.williams@example.com", role: "Kitchen Staff" }
    ]
    return (
        <main className="p-8 flex-1 bg-gray-100 min-h-screen w-full h-full">
            <h1 className="text-3xl font-bold mb-4">User Management</h1>
            <div className="flex flex-row mb-6 justify-between items-center">
                <InputGroup className="w-full border-gray-400">
                    <InputGroupInput placeholder="Search users..." />
                    <InputGroupAddon><Search /></InputGroupAddon>
                </InputGroup>
                <Button 
                    className="w-30 ml-4 bg-green-100 hover:bg-emerald-200 border border-green-500 self-end" 
                    variant="primary"
                >
                    Add user
                </Button>
            </div>
            {mockUsers.map(user =>
                <UserLayout user={user} />
            )}
        </main>
    )
}