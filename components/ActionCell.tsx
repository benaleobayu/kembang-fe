"use client";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";
import Link from "next/link";
import __DeleteDialog from "@/components/DeleteDialog";
import {OrderFormRouteDialog} from "@/app/cms/v1/order/order-form-route-dialog";
import OrderFormRoute from "@/app/cms/v1/order/order-form-route";
import * as React from "react";

interface ActionCellProps {
    id: string;
    handleDelete?: (e: any) => void;
    isDeleted?: boolean;
    isEditRoute?: boolean;
    children?: React.ReactNode;
}

const ActionCell: React.FC<ActionCellProps> = ({id, isDeleted, handleDelete, children, isEditRoute}:ActionCellProps) => {
    const [viewDetailsUrl, setViewDetailsUrl] = useState<string | null>(null);
    const [editDetailsUrl, setEditDetailsUrl] = useState<string | null>(null);

    useEffect(() => {
        // Construct URL manually without asPath
        const currentPath = window.location.pathname.split("/").join("/");
        setViewDetailsUrl(`${currentPath}/${id}`);
        setEditDetailsUrl(`${currentPath}/${id}?edit=true`);
    }, [id]);
    if (!viewDetailsUrl) return null; // Only render if URL is ready

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id)}>
                    Copy payment ID
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <Link href={viewDetailsUrl}>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                </Link>
                <Link href={editDetailsUrl}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                </Link>
                {children}
                {isEditRoute && (
                    <DropdownMenuItem>
                        <OrderFormRouteDialog text={"Edit Route"} title={"Edit Route"}>
                            <OrderFormRoute id={id}/>
                        </OrderFormRouteDialog>
                    </DropdownMenuItem>
                )}
                {isDeleted && (
                    <DropdownMenuItem>
                        <__DeleteDialog handleDelete={handleDelete ? handleDelete : () => {
                        }}/>
                    </DropdownMenuItem>
                )}

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ActionCell;