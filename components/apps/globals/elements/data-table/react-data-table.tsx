"use client";
import * as React from "react";
import {useState} from "react";
import {ColumnDef, ColumnFiltersState, VisibilityState} from "@tanstack/react-table";
import _BodyTable from "@/components/apps/globals/elements/data-table/body-table";
import {useInitiateDataTable} from "@/hooks/use-initiate-data-table";
import {useInitiateReactTable} from "@/hooks/use-initiate-react-table";

type Props = {
    apiRoute: string,
    columnTable: ColumnDef<any>[],
    data?: any,
}

export function _ReactDataTable({apiRoute, columnTable, filterElement}: Props) {
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
                const updatedData = data.filter((item: any) => item.id !== rowId);
                setData(updatedData);
                setOriginalData(updatedData);
                setPagination((prev) => ({
                    ...prev,
                    totalItems: prev.totalItems - 1,
                }));
            },
        },
        columnTable
    });

    return (
        <_BodyTable
            table={table}
            keyword={keyword}
            setKeyword={setKeyword}
            pagination={pagination}
            setPagination={setPagination}
            columnTable={columnTable}
        >
        </_BodyTable>
    );
}
