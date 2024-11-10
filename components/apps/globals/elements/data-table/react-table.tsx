import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import {LocationColumnTable} from "@/app/cms/v1/ms/locations/location-column-table";

export const __reactTable = useReactTable({
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
        setPagination(prev => ({
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