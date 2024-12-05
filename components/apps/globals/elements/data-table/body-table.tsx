import * as React from 'react';
import {Input} from "@/components/ui/input";
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDown} from "lucide-react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ColumnDef, flexRender} from "@tanstack/react-table";

type Props = {
    columnTable: ColumnDef<any>[],
    table: any,
    keyword: string,
    setKeyword: (value: string) => void,
    pagination: {
        currentPage: number,
        perPage: number,
        totalItems: number
    },
    setPagination: (value: any) => void,
};

export default function _BodyTable(props: Props) {
    const {columnTable, table, keyword, setKeyword, pagination, setPagination} = props;

    const canNextPage = pagination.currentPage < Math.ceil(pagination.totalItems / pagination.perPage) - 1;
    // Function to check if a string is a URL
    const isUrl = (value: string): boolean => {
        const pattern = /^(https?:\/\/[^\s]+)$/;
        return pattern.test(value);
    };

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by keyword..."
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)} // Update keyword on every keyup
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.columnDef.header}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {/* Check if the cell value is a URL */}
                                            {isUrl(cell.getValue<string>()) ? (
                                                <img
                                                    src={cell.getValue<string>()}
                                                    alt="Image"
                                                    className="max-w-[100px] max-h-[100px] object-cover"
                                                />
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnTable.length} className="h-24 text-center" inert>
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.{" "}
                    {pagination.totalItems} entries.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage - 1}))}
                        disabled={pagination.currentPage === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({...prev, currentPage: prev.currentPage + 1}))}
                        disabled={!canNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
