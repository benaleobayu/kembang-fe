"use client";
import * as React from "react";
import {ColumnFiltersState, VisibilityState,} from "@tanstack/react-table";
import _BodyTable from "@/components/apps/globals/elements/data-table/body-table";
import {useInitiateDataTable} from "@/hooks/use-initiate-data-table";
import {useInitiateReactTable} from "@/hooks/use-initiate-react-table";

export function _LocationDataTable() {
    const apiUrl = "/api/ms/locations"; // Define the API endpoint
    const {
        data,
        pagination,
        setPagination,
        sorting,
        setSorting,
        keyword,
        setKeyword,
    } = useInitiateDataTable(apiUrl);

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useInitiateReactTable({
        data,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        columnVisibility,
        setColumnVisibility,
        rowSelection,
        setRowSelection,
    });

    return (
        <_BodyTable table={table} keyword={keyword} setKeyword={setKeyword} pagination={pagination}
                    setPagination={setPagination}/>
    );
}