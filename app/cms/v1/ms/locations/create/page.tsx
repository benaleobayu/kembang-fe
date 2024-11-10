// @flow
import * as React from 'react';
import FromLocationCreate from "@/app/cms/v1/ms/locations/create/form-location-create";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Create Location
            <FromLocationCreate/>
        </div>
    );
};