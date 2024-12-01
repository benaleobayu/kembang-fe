"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import _ColumnInput from "@/components/apps/globals/elements/data-table/column-input";
import ActionCell from "@/components/ActionCell";
import {routesUrl} from "@/components/apps/globals/options/routes";
import axios from "axios";
import {toast} from "sonner";
import {ProductIndex} from "@/types/ProductIndex";

// Define URL for API calls
const urlRoute = routesUrl.find(data => data.key === "product")?.url;
const apiRoute = routesUrl.find(data => data.key === "productApi")?.url;
const mainName = "Product";

const removeRow = async (meta: any, index: number) => {
    const route = `${apiRoute}/${index}`
    const response = await axios.delete(route)
    if (response.data.success) {
        if (meta && typeof meta.removeRow === "function") {
            toast.success(`${mainName} deleted successfully!`);
            meta.removeRow(index); // Menghapus berdasarkan ID
        } else {
            toast.error("Failed to remove row table.");
            console.error("removeRow function is not available or meta is undefined");
        }
    } else {
        toast.error(`Failed to delete ${mainName.toLowerCase()}.`);
    }
}

export const OrderColumnTable: ColumnDef<ProductIndex>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    _ColumnInput({key: "index", name: "ID"}),
    _ColumnInput({key: "image", name: "Image"}),
    _ColumnInput({key: "name", name: "Name"}),
    _ColumnInput({key: "price", name: "Price"}),
    _ColumnInput({key: "category", name: "Category"}),
    _ColumnInput({key: "createdAt", name: "Created At"}),
    _ColumnInput({key: "updatedAt", name: "Updated At"}),
    {
        id: "actions",
        enableHiding: false,
        cell: ({row, table}) => {
            const data = row.original;
            const meta = table.options.meta;

            return (
                <ActionCell
                    id={data.id}
                    isDeleted={true}  // Ubah jika ingin menampilkan status deleted
                    handleDelete={() => {
                        removeRow(meta, data.id)
                    }}
                />
            );
        },
    }
];

