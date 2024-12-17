"use client";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "sonner";
import qs from "qs";

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
    filterParams: { [key: string]: string };
}

export function useInitiateDataTable(
    url: string,
    initialSortBy: string = "updatedAt",
    initialDirection: string = "desc",
    filterParams: { [key: string]: string } = {}
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

    const fetchData = async ({ sortBy, direction, keyword, pagination, filterParams }: FetchDataParams) => {
        const cleanedParams = Object.fromEntries(
            Object.entries(filterParams).filter(([_, value]) => value) // Hanya masukkan nilai valid
        );

        const finalParams = {
            pages: pagination.currentPage,
            limit: pagination.perPage,
            sortBy,
            direction,
            keyword: keyword || '', // Buang jika kosong
            ...cleanedParams,
        };

        try {
            const response = await axios.get(url, {
                params: finalParams,
                paramsSerializer: (params) => {
                    const searchParams = new URLSearchParams(params);
                    // Hapus parameter duplikat
                    return Array.from(searchParams.entries())
                        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                        .join("&");
                },
            });

            const data = response.data.data;

            if (url.includes("/order")) {
                const transformedData = data.result.map((item: any) => ({
                    ...item,
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

    // Debounce untuk keyword search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPagination((prev) => ({...prev, currentPage: 0}));
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    // Fetch data saat pagination, sorting, atau direction berubah
    useEffect(() => {
        fetchData({sortBy, direction, keyword, pagination, filterParams});
    }, [pagination.currentPage, pagination.perPage, sortBy, direction, keyword, JSON.stringify(filterParams)]);

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
