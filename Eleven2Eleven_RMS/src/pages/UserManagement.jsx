import { useMemo, useState } from "react";
import UserLayout from "@/components/custom/User";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import RoleCombobox from "@/components/custom/RoleCombobox";
import { Search } from "lucide-react";

export default function UserManagement() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([
        { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Manager" },
        { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "Waiter" },
        { id: 4, name: "Alice Williams", email: "alice.williams@example.com", role: "Kitchen Staff" }
    ]);

    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState("");

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return users;
        return users.filter(u => {
            return (
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.role || "").toLowerCase().includes(q)
            );
        });
    }, [query, users]);

    function handleSaveNew() {
        const name = newName.trim();
        const email = newEmail.trim();
        const role = newRole.trim() || "User";
        if (!name || !email) {
            // basic validation: require name and email
            alert("Please enter both name and email.");
            return;
        }
        const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
        const user = { id, name, email, role };
        setUsers(prev => [user, ...prev]);
        // reset form
        setNewName("");
        setNewEmail("");
        setNewRole("");
        setShowAdd(false);
    }

    function handleCancelNew() {
        setNewName("");
        setNewEmail("");
        setNewRole("");
        setShowAdd(false);
    }

    function handleUpdateUser(id, updated) {
        setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));
    }

    function handleDeleteUser(id) {
        if (!confirm("Delete this user?")) return;
        setUsers(prev => prev.filter(u => u.id !== id));
    }

    return (
        <main className="p-8 flex-1 bg-gray-100 min-h-screen w-full h-full">
            <h1 className="text-3xl font-bold mb-4">User Management</h1>
            <div className="flex flex-row mb-4 justify-between items-center">
                <InputGroup className="w-full h-12 border-gray-400">
                    <InputGroupInput
                        className="text-lg"
                        placeholder="Search users by name, email, role..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
                <Button 
                    className="w-30 h-12 text-lg ml-4 bg-green-100 hover:bg-emerald-200 border border-green-500 self-end" 
                    variant="primary"
                    onClick={() => setShowAdd(s => !s)}
                >
                    {showAdd ? "Close" : "Add user"}
                </Button>
            </div>

            {showAdd && (
                <div className="mb-6 rounded-md border bg-white p-4 shadow-sm">
                    <div className="grid grid-rows-3 gap-3 ">
                        <Input
                            className="col-span-1"
                            placeholder="Full name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <Input
                            className="col-span-1"
                            placeholder="Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                        />
                        <div className="col-span-1">
                            <RoleCombobox className="w-full" value={newRole} onChange={(v) => setNewRole(v)} />
                        </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <Button variant="primary" className="px-4" onClick={handleSaveNew}>Save</Button>
                        <Button variant="ghost" className="px-4" onClick={handleCancelNew}>Cancel</Button>
                    </div>
                </div>
            )}

            {filteredUsers.length === 0 ? (
                <div className="text-sm text-gray-500">No users found.</div>
            ) : (
                filteredUsers.map(user => (
                    <UserLayout key={user.id} user={user} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
                ))
            )}
        </main>
    )
}