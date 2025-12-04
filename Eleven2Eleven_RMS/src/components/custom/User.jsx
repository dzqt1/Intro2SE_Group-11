import { Separator } from "@radix-ui/react-separator";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
    ShieldUser,
    User,
    UserPen,
} from "lucide-react";
export default function UserLayout({ user }) {
    return (
        <Card className="w-full p-6">
            <div className="flex flex-row gap-4">
                <div className="text-2xl font-medium text-gray-800 self-center">{user.id}</div>
                <Separator orientation="vertical" className="mx-4 border border-black"/>
                <div className="flex flex-row self-start justify-between flex-1">
                    <div className="flex flex-col items-start">
                        <div className="text-xl font-medium text-gray-800">{user.name}</div>
                        <div className="text-md font-normal text-gray-800">{user.role}</div>
                    </div>
                    <Button className="hover:bg-gray-200 self-center" variant="secondary" >
                        Edit
                    </Button>
                </div>
                
            </div>
        </Card>
    )
}