// @flow
import * as React from 'react';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

type Props = {
    children: React.ReactNode
    message: string
    className?: string
}
export default function __Mytooltips({children, message, className}: Props) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className={className}>{children}</TooltipTrigger>
                <TooltipContent>
                    <p>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    );
};