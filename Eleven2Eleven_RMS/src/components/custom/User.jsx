import { useState, useEffect } from "react";
import { getRoles } from "@/data_access/api";
import { hashPassword } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import RoleCombobox from "./RoleCombobox";
import {
    ShieldUser,
    UserRound,
    UserRoundPen,
} from "lucide-react";

export default function UserLayout({ user, onUpdate, onDelete }) {
    let icon = <></>
    if (!user) {
        return (
            <Card className="w-full p-6"/>
        )
    }

    
    const [editing, setEditing] = useState(false);
    const [fullName, setFullName] = useState(user.full_name || user.name || "");
    const [username, setUsername] = useState(user.username || user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [password, setPassword] = useState("")
    const [role, setRole] = useState(user.role ?? "")
    const [roles, setRoles] = useState([])

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const list = await getRoles()
                if (!mounted) return
                if (Array.isArray(list)) setRoles(list.map(r => ({ id: String(r.id), name: r.name || String(r.id) })))
            } catch (err) {
                console.error('Failed to load roles', err)
            }
        })()
        return () => { mounted = false }
    }, [])

    // determine displayed role name and icon based on role id or name
    const displayedRoleName = (() => {
        const val = user.role ?? user.role_id ?? role
        if (!val) return ''
        const valStr = String(val)
        const found = roles.find(r => r.id === valStr || String(r.name) === valStr)
        return found ? found.name : valStr
    })()

    // choose icon according to displayed role name
    switch (displayedRoleName) {
        case 'Admin':
            icon = <ShieldUser className="!w-8 !h-8 text-gray-600 self-center" />;
            break;
        case 'Manager':
            icon = <UserRoundPen className="!w-8 !h-8 text-gray-600 self-center" />;
            break;
        default:
            icon = <UserRound className="!w-8 !h-8 text-gray-600 self-center" />;
            break;
    }

    async function handleSave() {
        const updated = { name: username.trim(), full_name: fullName.trim(), email: email.trim(), role: String(role).trim() };
        if (!updated.name || !updated.email || !updated.full_name) {
            alert("Please provide username, full name and email.");
            return;
        }
        if (password) {
            try {
                const hashed = await hashPassword(password)
                updated.hashed_password = hashed
            } catch (err) {
                console.error('Failed to hash password', err)
                alert('Failed to process password.')
                return
            }
        }
        if (typeof onUpdate === "function") {
            await onUpdate(user.id, updated);
        }
        setPassword("")
        setEditing(false);
    }

    function handleCancel() {
        setFullName(user.full_name || user.name || "");
        setUsername(user.username || user.name || "");
        setEmail(user.email || "");
        setRole(user.role ?? "");
        setPassword("");
        setEditing(false);
    }

    function handleDelete() {
        if (!confirm(`Delete user "${user.name}"? This cannot be undone.`)) return;
        if (typeof onDelete === "function") {
            onDelete(user.id);
        }
    }

    return (
        <Card className="w-full p-6">
            <div className="flex flex-row gap-4">
                {icon}
                <Separator orientation="vertical" className="mx-4 border border-black"/>
                <div className="flex flex-row self-start justify-between flex-1">
                    <div className="flex flex-col items-start">
                        {editing ? (
                            <>
                                <Input className="w-100 text-sm text-gray-600 mb-1" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                <Input className="w-100 text-xl font-medium text-gray-800 mb-1" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                                <Input className="w-100 text-sm text-gray-600 mb-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input className="w-100 text-sm text-gray-600 mb-1" placeholder="New password (leave blank to keep)" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <RoleCombobox className={"w-100"} value={role} onChange={(v) => setRole(v || "")} />
                            </>
                        ) : (
                            <>
                                <div className="text-xl font-medium text-gray-800">{user.full_name || user.name}</div>
                                <div className="text-sm text-gray-500">@{user.username || user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-md font-normal text-gray-800">Role: {(() => {
                                    const val = user.role ?? user.role_id ?? role
                                    if (!val) return ''
                                    const valStr = String(val)
                                    const found = roles.find(r => r.id === valStr || String(r.name) === valStr)
                                    return found ? found.name : val
                                })()}</div>
                            </>
                        )}
                    </div>
                    {editing ? (
                        <div className="flex items-center gap-2">
                            <Button className="bg-red-100" variant="destructive" onClick={handleDelete}>Delete</Button>
                            <Button className="bg-emerald-100" variant="primary" onClick={handleSave}>Save</Button>
                            <Button className="bg-gray-100" variant="ghost" onClick={handleCancel}>Cancel</Button>
                        </div>
                    ) : (
                        <Button 
                            className="w-30 bg-gray-200 hover:bg-gray-300 self-center" 
                            variant="secondary"
                            onClick={() => setEditing(true)}
                        >
                            Edit
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    )
}