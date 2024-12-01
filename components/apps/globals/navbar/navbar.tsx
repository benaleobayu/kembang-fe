// @flow
import * as React from 'react';
import {NavMenu} from "@/components/apps/globals/navbar/nav-menu";
import {NavProfile} from "@/components/apps/globals/navbar/nav-profile";

export default function __Navbar() {
    const logo = "/assets/images/logo.png";
    return (
        <div className="w-full fixed z-20 top-0 left-0 h-[60px] bg-red-400 flex justify-center items-center">
            <div className="grid grid-cols-2 md:grid-cols-[0.5fr_2fr_0.5fr] gap-3 w-full items-center md:justify-center justify-between ">
                <div className="flex items-center md:justify-center justify-start md:pl-0 pl-4">
                    <img src={logo} alt="nav logo" className="max-h-[50px]"/>
                </div>
                <div className="md:flex items-center justify-center hidden">
                    <NavMenu/>
                </div>
                <div className="flex items-center md:justify-center justify-end md:pr-0 pr-4">
                    <NavProfile/>
                </div>
            </div>
        </div>
    );
};