// @flow
import * as React from 'react';
import FormLocation from "@/app/cms/v1/ms/locations/form-location";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Detail location
            <FormLocation formType="read"/>
        </div>
    );
};