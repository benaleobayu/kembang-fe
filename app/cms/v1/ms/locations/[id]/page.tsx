// @flow
import * as React from 'react';
import _LocationDetailId from "@/app/cms/v1/ms/locations/[id]/form-location-read";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Detail location
            <_LocationDetailId/>
        </div>
    );
};