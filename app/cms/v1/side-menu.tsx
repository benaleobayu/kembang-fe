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
    LuIndentIncrease,
    LuLayoutDashboard, LuLock,
    LuMap,
    LuMapPin,
    LuUserCog,
    LuUsers
} from "react-icons/lu";
import __Mytooltips from "@/components/apps/globals/elements/mytooltips";
import {routesUrl} from "@/components/apps/globals/options/routes";

const iconMap = {
    LuBoxes: LuBoxes,
    LuFlagTriangleRight: LuFlagTriangleRight,
    LuIndentIncrease: LuIndentIncrease,
    LuLayoutDashboard: LuLayoutDashboard,
    LuLock: LuLock,
    LuMap: LuMap,
    LuMapPin: LuMapPin,
    LuUserCog: LuUserCog,
    LuUsers: LuUsers
}

const menuApi = routesUrl.find(data => data.key === "menuApi")?.url;

export function SideMenu() {
    const [menus, setMenus] = useState([]); // Initialize state with useState
    const [mdResolution, setMdResolution] = useState(false);

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get(menuApi); // Make sure to include the leading slash
                setMenus(response.data.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch menus');
            }
        };

        fetchMenus(); // Call the async function
    }, []); // Empty dependency array to run once on mount

    useEffect(() => {
        const handleResize = () => {
            const isMdResolution = window.innerWidth >= 768;
            setMdResolution(isMdResolution);
        };
        handleResize(); // Check initial width
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="relative md:w-[220px] w-20 pl-4 pr-2 py-6">
            {/* Remove the absolute positioning and use relative for the parent */}
            <div className="fixed md:w-[220px] w-20 top-[85px] left-2">
                {/* Apply sticky to the Command component */}
                <Command className="rounded-lg border shadow-md w-full max-h-[calc(100vh-200px)] overflow-y-auto">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandSeparator />
                        {menus.length > 0 && menus.map((group) => (
                            <CommandGroup key={group.id} className="md:block flex flex-col items-center" heading={group.name}>
                                {group.menus.length > 0 ? (
                                    group.menus.map((menu) => {
                                        const IconComponent = iconMap[menu.icon];
                                        return (
                                            mdResolution ? (
                                                <Link key={menu.id} href={menu.link} passHref>
                                                    <CommandItem className="flex items-center content-center">
                                                        {IconComponent && <IconComponent />} {/* Render the icon */}
                                                        <span className="hidden md:block">{menu.name}</span>
                                                    </CommandItem>
                                                </Link>
                                            ) : (
                                                <__Mytooltips key={menu.id} message={menu.name} className="block w-full">
                                                    <Link href={menu.link} passHref>
                                                        <CommandItem className="flex items-center content-center">
                                                            {IconComponent && <IconComponent />} {/* Render the icon */}
                                                            <span className="hidden md:block">{menu.name}</span>
                                                        </CommandItem>
                                                    </Link>
                                                </__Mytooltips>
                                            )
                                        );
                                    })
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
        </div>
    );

}
