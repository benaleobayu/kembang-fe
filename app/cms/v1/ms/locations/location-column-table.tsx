import {ColumnDef} from "@tanstack/react-table";
import {LocationIndex} from "@/types/locationIndex";
import {Checkbox} from "@/components/ui/checkbox";
import _ColumnInput from "@/components/apps/globals/elements/data-table/column-input";
import ActionCell from "@/components/ActionCell";

export const LocationColumnTable: ColumnDef<LocationIndex>[] = [
    {
        id: "select", // Unique ID for the select column
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
        id: "actions", // Unique ID for the actions column
        enableHiding: false,
        cell: ({row}) => {
            const data = row.original; // Get the row data, which contains the 'id' property

            return <ActionCell id={data.id} />;
        },
    },
];
