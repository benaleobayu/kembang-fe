// @flow
import * as React from 'react';

type Props = {
    children: React.ReactNode
};
export default function Layout({children}: Props) {
    return (
        <div className="grid grid-cols-[0.5fr_1.5fr] gap-2 max-h-[80vh]">
            <div className="outline outline-2 outline-red-400 rounded-md">
                abc
            </div>
            <div className="outline outline-2 outline-red-400 rounded-md">
                {children}
            </div>
        </div>
    );
};