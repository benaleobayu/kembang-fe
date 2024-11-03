// @flow
import * as React from 'react';
import {NavMenu} from "@/components/apps/globals/navbar/nav-menu";
import {NavProfile} from "@/components/apps/globals/navbar/nav-profile";

export default function __Navbar() {
    const logo = process.env.PATH_LOGO;
    return (
        <div className="w-full fixed z-20 top-0 left-0 h-[60px] bg-red-400 flex justify-center items-center">
            <div className="grid grid-cols-[0.5fr_2fr_0.5fr] gap-3 w-full items-center justify-center">
                <div className="flex items-center justify-center">
                    <img src={logo} alt="nav logo" className="max-h-[50px]"/>
                </div>
                <div className="flex items-center justify-center">
                    <NavMenu/>
                </div>
                <div className="flex items-center justify-center">
                    <NavProfile/>
                </div>
            </div>
        </div>
    );
};