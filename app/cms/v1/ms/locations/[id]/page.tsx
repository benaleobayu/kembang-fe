// @flow
import * as React from 'react';
import LocationForm from "@/app/cms/v1/ms/locations/location-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Detail location
            <LocationForm formType="read"/>
        </div>
    );
};