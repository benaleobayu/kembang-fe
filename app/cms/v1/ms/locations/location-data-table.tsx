"use client";
import * as React from "react";
import { ColumnFiltersState, VisibilityState } from "@tanstack/react-table";
import _BodyTable from "@/components/apps/globals/elements/data-table/body-table";
import { useInitiateDataTable } from "@/hooks/use-initiate-data-table";
import { useInitiateReactTable } from "@/hooks/use-initiate-react-table";
import { LocationColumnTable } from "@/app/cms/v1/ms/locations/location-column-table";
import {LocationIndex} from "@/types/locationIndex";
import {routesUrl} from "@/components/apps/globals/options/routes";


const urlRoute = routesUrl.find(data => data.key === "locationApi")?.url;

export function _LocationDataTable() {
    const {
        data,
        setData, // Pastikan `setData` tersedia untuk memodifikasi data secara lokal
        pagination,
        setPagination,
        sorting,
        setSorting,
        keyword,
        setKeyword,
        fetchData,
    } = useInitiateDataTable(urlRoute);

    const revalidateData = (idToRemove: string) => {
        setData((prevData: LocationIndex[]) =>
            prevData.filter((item) => item.id !== idToRemove)
        );
    };

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
        meta: { revalidateData }, // Kirim fungsi revalidateData ke meta
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