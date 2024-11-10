// @flow
import * as React from 'react';
import {_CustomerDataTable} from "@/app/cms/v1/customers/customer-data-table";
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";

type Props = {};
export default function Page(props: Props) {
    const createLink = "/cms/v1/customers/form"
    const exportLink = "/cms/v1/customers/export"
    return (
        <div>
            Page customer
            <_HeaderTable isCreate createLink={createLink}/>
            <_CustomerDataTable />
        </div>
    );
};