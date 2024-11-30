"use client";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
    LuBoxes,
    LuFlagTriangleRight,
    LuIndent,
    LuLayoutDashboard, LuLock,
    LuMap,
    LuMapPin,
    LuUserCog,
    LuUsers
} from "react-icons/lu";

const iconMap = {
    LuBoxes: LuBoxes,
    LuFlagTriangleRight: LuFlagTriangleRight,
    LuIndent: LuIndent,
    LuLayoutDashboard: LuLayoutDashboard,
    LuLock: LuLock,
    LuMap: LuMap,
    LuMapPin: LuMapPin,
    LuUserCog: LuUserCog,
    LuUsers: LuUsers
}

export function SideMenu() {
    const [menus, setMenus] = useState([]); // Initialize state with useState

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get('/api/util/menu'); // Make sure to include the leading slash
                setMenus(response.data.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch menus');
            }
        };

        fetchMenus(); // Call the async function
    }, []); // Empty dependency array to run once on mount

    return (
        <div className="fixed">
            <Command className="rounded-lg border shadow-md w-full max-h-[calc(100vh-200px)]">
                <CommandInput placeholder="Type a command or search..." />
                <CommandList className="">
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandSeparator />
                    {menus.length > 0 && menus.map((group) => (
                        <CommandGroup key={group.id} heading={group.name}>
                            {group.menus.length > 0 ? (
                                group.menus.map((menu) => {
                                    const IconComponent = iconMap[menu.icon];
                                    return (
                                        <Link key={menu.id} href={menu.link} passHref>
                                            <CommandItem>
                                                {IconComponent && <IconComponent/>} {/* Render the icon */}
                                                <span>{menu.name}</span>
                                            </CommandItem>
                                        </Link>
                                    )})
                            ) : (
                                <CommandItem>
                                    <span>No Menus Available</span>
                                </CommandItem>
                            )}
                        </CommandGroup>
                    ))}
                </CommandList>
            </Command>
        </div>
    );
}
