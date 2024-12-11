"use client";
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
    resetForm: () => void; // Function to trigger reset
    isCreate?: boolean;
    createLink?: string;
    exportLink?: string;
    isExport?: boolean;
};

export default function _HeaderTable({ resetForm, createLink, exportLink, isCreate, isExport }: Props) {
    const router = useRouter();

    const handlerCreate = (link: string) => {
        router.push(link || '');
    };

    const handlerExport = (link: string) => {
        router.push(link || '');
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex"></div>
            <div className="flex gap-2">
                <Button onClick={resetForm}>Refresh</Button> {/* Button to reset the form */}
                <Button onClick={() => handlerExport(exportLink || "")} className={`${isExport ? '' : 'hidden'}`}>Export</Button>
                <Button onClick={() => handlerCreate(createLink || "")} className={`${isCreate ? '' : 'hidden'}`}>Create</Button>
            </div>
        </div>
    );
}
