// @flow
import * as React from 'react';
import __Navbar from "@/components/apps/globals/navbar/navbar";
import {SideMenu} from "@/app/cms/v1/side-menu";

export default function __Layout({children}: any) {
    return (
        <>
            <__Navbar/>
            <div className="flex mt-[60px] min-h-screen">
                <div className="w-[300px] pl-4 pr-2 py-6 border-r-2">
                    <SideMenu/>
                </div>
                <div className="w-full py-6 px-4">
                    {children}
                </div>
            </div>
        </>
    );
};