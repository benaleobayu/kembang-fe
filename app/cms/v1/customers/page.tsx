// @flow
import * as React from 'react';
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";
import {_LocationDataTable} from "@/app/cms/v1/ms/locations/location-data-table";
import {routesUrl} from "@/components/apps/globals/options/routes";
import {_ReactDataTable} from "@/components/apps/globals/elements/data-table/react-data-table";
import {CustomerColumnTable} from "@/app/cms/v1/customers/customer-column-table";

type Props = {};
export default function Page(props: Props) {
    const apiRoute = routesUrl.find(data => data.key === "customerApi")?.url;
    const urlRoute = routesUrl.find(data => data.key === "customer")?.url;

    return (
        <div>
            Page Customers
            <_HeaderTable isCreate createLink={`${urlRoute}/create`}/>
            <_ReactDataTable apiRoute={apiRoute} columnTable={CustomerColumnTable}/>
        </div>
    );
};