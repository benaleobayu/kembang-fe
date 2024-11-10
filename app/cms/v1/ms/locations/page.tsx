// @flow
import * as React from 'react';
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";
import {_LocationDataTable} from "@/app/cms/v1/ms/locations/location-data-table";

type Props = {};
export default function Page(props: Props) {
    const createLink = "/cms/v1/ms/locations/create"

    return (
        <div>
            Page Locations
            <_HeaderTable isCreate createLink={createLink}/>
            <_LocationDataTable/>
        </div>
    );
};