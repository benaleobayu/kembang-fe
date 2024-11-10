"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface ActionCellProps {
    id: string;
}

const ActionCell: React.FC<ActionCellProps> = ({ id }) => {
    const [viewDetailsUrl, setViewDetailsUrl] = useState<string | null>(null);

    useEffect(() => {
        // Construct URL manually without asPath
        const currentPath = window.location.pathname.split("/").join("/");
        setViewDetailsUrl(`${currentPath}/${id}`);
    }, [id]);
    if (!viewDetailsUrl) return null; // Only render if URL is ready

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
                    Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href={viewDetailsUrl}>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                </Link>
                <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionCell;