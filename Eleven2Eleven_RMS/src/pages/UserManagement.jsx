import { useMemo, useState, useEffect } from "react";
import UserLayout from "@/components/custom/User";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import RoleCombobox from "@/components/custom/RoleCombobox";
import { Search } from "lucide-react";
import { getUsers, addUser, updateUser as apiUpdateUser, deleteUser as apiDeleteUser, getRoles } from "../data_access/api";
import { hashPassword } from "@/lib/utils";

export default function UserManagement() {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newRole, setNewRole] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const list = await getRoles()
                if (Array.isArray(list)) {
                    const map = {}
                    list.forEach(r => { map[String(r.id)] = r.name || String(r.id) })
                    setRolesMap(map)
                }
            } catch (err) {
                console.error('Failed to load roles', err)
            }
        })()
    }, [])

    const [rolesMap, setRolesMap] = useState({})

    async function loadUsers() {
        try {
            setLoading(true);
            const list = await getUsers();
            const normalized = (list || []).map(u => ({
                id: u.id,
                username: u.name || "",
                name: u.full_name || u.name || "",
                email: u.email || "",
                role: u.role || (u.role_name || (u.role_id ? String(u.role_id) : "User"))
            }));
            setUsers(normalized);
        } catch (err) {
            console.error("Failed to load users", err);
            alert("Failed to load users from server.");
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = useMemo(() => {
        const q = query.trim().toLowerCase();
        const filtered = users.filter(u => {
            if (!q) return true
            return (
                (u.name || "").toLowerCase().includes(q) ||
                (u.email || "").toLowerCase().includes(q) ||
                ((rolesMap[String(u.role)] || u.role || "").toLowerCase().includes(q))
            );
        });
        // sort by role name (mapped), then by full name
        const sorted = filtered.slice().sort((a, b) => {
            const ra = (rolesMap[String(a.role)] || a.role || "").toLowerCase();
            const rb = (rolesMap[String(b.role)] || b.role || "").toLowerCase();
            if (ra < rb) return -1;
            if (ra > rb) return 1;
            return (a.name || "").localeCompare(b.name || "");
        });
        return sorted;
    }, [query, users, rolesMap]);

    async function handleSaveNew() {
        const fullName = newName.trim();
        const username = newUsername.trim();
        const email = newEmail.trim();
        const role = newRole.trim() || "";
        if (!username || !fullName || !email) {
            alert("Please enter username, full name and email.");
            return;
        }
        try {
            const hashed = newPassword ? await hashPassword(newPassword) : undefined;
            const payload = { name: username, full_name: fullName, email };
            if (role) payload.role = role;
            if (hashed) payload.hashed_password = hashed;
            const created = await addUser(payload);
            const usr = {
                id: created.id,
                username: created.name || username,
                name: created.full_name || created.name || fullName,
                email: created.email || email,
                role: created.role || role
            };
            setUsers(prev => [usr, ...prev]);
            setNewName("");
            setNewUsername("");
            setNewEmail("");
            setNewRole("");
            setNewPassword("");
            setShowAdd(false);
        } catch (err) {
            console.error(err);
            alert("Failed to create user.");
        }
    }

    function handleCancelNew() {
        setNewName("");
        setNewUsername("");
        setNewEmail("");
        setNewRole("");
        setShowAdd(false);
    }

    async function handleUpdateUser(id, updated) {
        try {
            await apiUpdateUser(id, updated);
            setUsers(prev => prev.map(u => {
                if (u.id !== id) return u;
                return {
                    ...u,
                    username: updated.name ?? u.username,
                    name: updated.full_name ?? (updated.name ?? u.name),
                    email: updated.email ?? u.email,
                    role: updated.role ?? u.role
                };
            }));
        } catch (err) {
            console.error(err);
            alert("Failed to update user.");
        }
    }

    async function handleDeleteUser(id) {
        if (!confirm("Delete this user?")) return;
        try {
            await apiDeleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete user.");
        }
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
                    <div className="grid grid-rows-4 gap-3 ">
                        <Input
                            className="col-span-1"
                            placeholder="Username"
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                        />
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
                        <Input
                            className="col-span-1"
                            placeholder="Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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

            {loading ? (
                <div className="text-sm text-gray-500">Loading users...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-sm text-gray-500">No users found.</div>
            ) : (
                filteredUsers.map(user => (
                    <UserLayout key={user.id} user={user} onUpdate={handleUpdateUser} onDelete={handleDeleteUser} />
                ))
            )}
        </main>
    )
}