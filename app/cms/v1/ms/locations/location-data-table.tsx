"use client";
import * as React from "react";
import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import _BodyTable from "@/components/apps/globals/elements/data-table/body-table";
import { useInitiateDataTable } from "@/hooks/use-initiate-data-table";
import { useInitiateReactTable } from "@/hooks/use-initiate-react-table";
import { LocationColumnTable } from "@/app/cms/v1/ms/locations/location-column-table";
import {LocationIndex} from "@/types/locationIndex";
import {routesUrl} from "@/components/apps/globals/options/routes";
import {useState} from "react";


const apiRoute = routesUrl.find(data => data.key === "locationApi")?.url;

export function _LocationDataTable() {
    const {
        data,
        setData,
        pagination,
        setPagination,
        sorting,
        setSorting,
        keyword,
        setKeyword,
        revalidateData,
    } = useInitiateDataTable(apiRoute);

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [originalData, setOriginalData] = useState(() => [...data]);

    // Menambahkan meta yang berisi removeRow untuk diteruskan ke kolom
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
        meta: {
            revalidateData,
            removeRow: (rowId: string) => {
                const updatedData = data.filter((item: LocationIndex) => item.id !== rowId);
                setData(updatedData);
                setOriginalData(updatedData);
                setPagination((prev) => ({
                    ...prev,
                    totalItems: prev.totalItems - 1,
                }));
            },
        },
    });

    return (
        <_BodyTable
            table={table}
            keyword={keyword}
            setKeyword={setKeyword}
            pagination={pagination}
            setPagination={setPagination}
            columnTable={LocationColumnTable}
        />
    );
}
