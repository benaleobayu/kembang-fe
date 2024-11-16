import {ColumnDef} from "@tanstack/react-table";
import {LocationIndex} from "@/types/locationIndex";
import {Checkbox} from "@/components/ui/checkbox";
import _ColumnInput from "@/components/apps/globals/elements/data-table/column-input";
import ActionCell from "@/components/ActionCell";
import {toast} from "sonner";
import axios from "axios";
import {routesUrl} from "@/components/apps/globals/options/routes";

// Define URL for API calls
const urlRoute = routesUrl.find(data => data.key === "location")?.url;
const apiRoute = routesUrl.find(data => data.key === "locationApi")?.url;

const handleDelete = async (id: string) => {

    try {
        const response = await axios.delete(`${apiRoute}/${id}`);
        if (response.status === 200) {
            toast.success("Data berhasil dihapus");
        }
    } catch (error) {
        toast.error("Gagal menghapus data");
    }
};

export const LocationColumnTable: ColumnDef<LocationIndex>[] = [
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
    _ColumnInput({key: "name", name: "Name"}),
    _ColumnInput({key: "province", name: "Province"}),
    _ColumnInput({key: "orders", name: "Orders"}),
    _ColumnInput({key: "createdAt", name: "Created At"}),
    {
        id: "actions",
        enableHiding: false,
        cell: ({row, table}) => {
            const data = row.original;
            return (
                <ActionCell
                    id={data.id}
                    isDeleted={true}  // Change to true if you want to show deleted state
                    handleDelete={() => {
                        // Call the delete handler
                        handleDelete(data.id);
                    }}
                />
            );
        },
    },
];
