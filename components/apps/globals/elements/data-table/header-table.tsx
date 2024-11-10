"use client"
import * as React from 'react';
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

type Props = {
    createLink?: string;
    exportLink?: string;
    isCreate?: boolean;
    isExport?: boolean;
};
export default function _HeaderTable(props: Props) {
    const router = useRouter();
    const {createLink, exportLink, isCreate, isExport} = props;

    const handlerCreate = (link: string) => {
        router.push(link || '')
    }
    const handlerExport = (link: string) => {
        router.push(link || '')
    }

    return (
        <div className="flex justify-between items-center">
            <div className="flex"></div>
            <div className="flex gap-2">
                <Button onClick={() => handlerExport(exportLink || "")} className={`${isExport ? '' : 'hidden'}`}>Export</Button>
                <Button onClick={() => handlerCreate(createLink || "")} className={`${isCreate ? '' : 'hidden'}`}>Create</Button>
            </div>
        </div>
    );
};