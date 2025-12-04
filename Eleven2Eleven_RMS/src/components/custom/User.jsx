import { useState } from "react";
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

    switch (user.role) {
        case "Admin":
            icon = <ShieldUser className="!w-8 !h-8 text-gray-600 self-center" />;
            break;
        case "Manager":
            icon = <UserRoundPen className="!w-8 !h-8 text-gray-600 self-center" />;
            break;
        default:
            icon = <UserRound className="!w-8 !h-8 text-gray-600 self-center" />;
            break;
    }
    
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [role, setRole] = useState(user.role || "User");

    function handleSave() {
        const updated = { name: name.trim(), email: email.trim(), role: role.trim() };
        if (!updated.name || !updated.email) {
            alert("Please provide name and email.");
            return;
        }
        if (typeof onUpdate === "function") {
            onUpdate(user.id, updated);
        }
        setEditing(false);
    }

    function handleCancel() {
        setName(user.name || "");
        setEmail(user.email || "");
        setRole(user.role || "User");
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
                                <Input className="text-xl font-medium text-gray-800 mb-1" value={name} onChange={(e) => setName(e.target.value)} />
                                <Input className="text-sm text-gray-600 mb-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <RoleCombobox value={role} onChange={(v) => setRole(v || "User")} />
                            </>
                        ) : (
                            <>
                                <div className="text-xl font-medium text-gray-800">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-md font-normal text-gray-800">{user.role}</div>
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