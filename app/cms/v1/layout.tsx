import * as React from 'react';
import __Navbar from "@/components/apps/globals/navbar/navbar";
import {SideMenu} from "@/app/cms/v1/side-menu";

export default function __Layout({children}: any) {
    return (
        <>
            <__Navbar/>
            <div className="flex min-h-screen">
                <div className="px-2 border-r-2 pt-[60px]">
                    <SideMenu/>
                </div>
                <div className="w-full py-6 px-4 pt-[60px]">
                    {children} {/* Konten halaman yang sedang aktif */}
                </div>
            </div>
        </>
    );
}
