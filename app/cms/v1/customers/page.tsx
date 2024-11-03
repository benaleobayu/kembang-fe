// @flow
import * as React from 'react';
import {CustomerDataTabke} from "@/app/cms/v1/customers/data-table";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Page customer
            <CustomerDataTabke/>
        </div>
    );
};