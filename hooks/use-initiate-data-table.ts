"use client";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "sonner";

interface PaginationState {
    currentPage: number;
    perPage: number;
    totalItems: number;
}

interface FetchDataParams {
    sortBy: string;
    direction: string;
    keyword: string;
    pagination: PaginationState;
}

export function useInitiateDataTable(
    url: string,
    initialSortBy: string = "updatedAt",
    initialDirection: string = "desc"
) {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 0,
        perPage: 10,
        totalItems: 0,
    });
    const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
    const [keyword, setKeyword] = useState("");

    const sortBy = sorting.length > 0 ? sorting[0].id : initialSortBy;
    const direction = sorting.length > 0 && sorting[0].desc ? "desc" : initialDirection;

    const fetchData = async ({sortBy, direction, keyword, pagination}: FetchDataParams) => {
        try {
            const response = await axios.get(url, {
                params: {
                    pages: pagination.currentPage,
                    limit: pagination.perPage,
                    sortBy: sortBy,
                    direction: direction,
                    keyword: keyword,
                },
            });

            const data = response.data.data;

            if (url.includes("/order")) {
                // Transform data here
                const transformedData = data.result.map((item: any) => ({
                    ...item, // Salin semua properti lainnya
                    dataPerson: {
                        name: item.customerName ?? "Unknown Name",
                        forwardName: item.forwardName ?? "Unknown Name",
                        address: item.customerAddress ?? "Unknown Address",
                        forwardAddress: item.forwardAddress ?? "Unknown Address",
                        phone: item.customerPhone ?? "Unknown Phone",
                    },
                }));
                setData(transformedData);
            } else {
                setData(data.result);
            }

            setPagination((prev) => ({
                ...prev,
                currentPage: data.currentPage,
                perPage: data.perPage,
                totalItems: data.totalItems,
            }));
        } catch (error: any) {
            toast.error("Failed to fetch data");
        }
    };
    // Callback untuk menghapus data secara lokal
    const revalidateData = (idToRemove: string) => {
        setData((prevData) => prevData.filter((item: any) => item.id !== idToRemove));
        setPagination((prev) => ({
            ...prev,
            totalItems: prev.totalItems - 1, // Update total items
        }));
    };

    // Debounce keyword search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPagination((prev) => ({...prev, currentPage: 0}));
            fetchData({sortBy, direction, keyword, pagination});
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword, pagination.perPage, sortBy, direction]);

    // Fetch data when pagination, sorting, or direction changes
    useEffect(() => {
        fetchData({sortBy, direction, keyword, pagination});
    }, [pagination.currentPage, pagination.perPage, sortBy, direction]);

    return {
        data,
        setData,
        pagination,
        setPagination,
        sorting,
        setSorting,
        keyword,
        setKeyword,
        fetchData,
        revalidateData, // Return this function for use in components
        removeRow: revalidateData, // Tambahkan removeRow ke dalam meta
    };
}
