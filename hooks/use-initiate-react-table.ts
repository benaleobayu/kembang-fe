import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { LocationColumnTable } from "@/app/cms/v1/ms/locations/location-column-table";
import { ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";

type UseLocationTableProps = {
    data: any[];
    pagination: { currentPage: number; perPage: number; totalItems: number };
    setPagination: Dispatch<SetStateAction<{ currentPage: number; perPage: number; totalItems: number }>>;
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>;
    columnVisibility: VisibilityState;
    setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>;
    rowSelection: any;
    setRowSelection: Dispatch<SetStateAction<any>>;
};

export function useInitiateReactTable({
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
                                 }: UseLocationTableProps) {
    return useReactTable({
        data,
        columns: LocationColumnTable,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination: {
                pageIndex: pagination.currentPage,
                pageSize: pagination.perPage,
            },
        },
        manualPagination: true,
        pageCount: Math.ceil(pagination.totalItems / pagination.perPage),
        onPaginationChange: ({ pageIndex, pageSize }) => {
            setPagination((prev) => ({
                ...prev,
                currentPage: pageIndex,
                perPage: pageSize,
            }));
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
    });
}