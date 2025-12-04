import React from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link, NavLink } from "react-router-dom";
import e2eLogo from "@/assets/e2e.svg";
import { 
    LayoutGrid, 
    FlaskConical,
    Users,
    NotebookPen,
    Coffee,
} from "lucide-react";

export default function Side_Navbar() {
	const iconStyle = "!w-6 !h-6 group-hover:text-emerald-500";
    const items = [
        { name: "Demo", icon: <FlaskConical className={iconStyle} />, path: "/demo" },
        { name: "User Management", icon: <Users className={iconStyle} />, path: "/users" },
        { name: "Order Management", icon: <NotebookPen className={iconStyle} />, path: "/orders"},
        { name: "Menu Management", icon: <Coffee className={iconStyle} />, path: "/menu"},
    ]
    const active_user = {name: "Hai Le", role: "Manager"};

	return (
        <aside className="flex flex-col w-70 min-h-screen bg-gray-200 border-r">
            <div className="flex-1 flex flex-col">
                <div className="p-6 w-full h-50 border-b items-center justify-center flex flex-col gap-2">
                    <Link to="/" className="no-underline flex flex-col items-center gap-2">
                        <img src={e2eLogo} alt="logo" className="h-20 w-20" />
                        <h1 className="text-2xl font-bold text-gray-800">Eleven2Eleven</h1>
                    </Link>
                </div>

                <div className="px-12 mb-6">
                    <Separator className="my-2 bg-black" />
                </div>
    
                <nav className="flex-1 overflow-auto">
                    <ul className="flex flex-col">
                        {items.map((item) => (
                            <li key={item.name} className="items-center">
                                <Link to={item.path} className="no-underline">
                                    <Button variant="ghost" className="group justify-start p-7 text-xl w-full font-bold gap-5 rounded-none hover:bg-white">
                                        {item.icon}
                                        <p className="text-center">{item.name}</p>
                                    </Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="px-6 pb-6">
                <div className="mt-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border-2 border-gray-400" />
                    <div className="flex-1">
                        <div className="text-lg font-medium text-gray-800">{active_user.role}: {active_user.name}</div>
                    </div>
                </div>
            </div>
		</aside>
	)
}