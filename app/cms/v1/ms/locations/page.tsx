// @flow
import * as React from 'react';
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";
import {routesUrl} from "@/components/apps/globals/options/routes";
import {_ReactDataTable} from "@/components/apps/globals/elements/data-table/react-data-table";
import {LocationColumnTable} from "@/app/cms/v1/ms/locations/location-column-table";

type Props = {};
export default function Page(props: Props) {
    const apiRoute = routesUrl.find(data => data.key === "locationApi")?.url;
    const urlRoute = routesUrl.find(data => data.key === "location")?.url;

    return (
        <div>
            Page Customers
            <_HeaderTable isCreate createLink={`${urlRoute}/create`}/>
            <_ReactDataTable apiRoute={apiRoute} columnTable={LocationColumnTable}/>
        </div>
    );
};