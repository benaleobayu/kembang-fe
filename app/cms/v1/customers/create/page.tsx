// @flow
import * as React from 'react';
import LocationForm from "@/app/cms/v1/ms/locations/location-form";
import CustomerForm from "@/app/cms/v1/customers/customer-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Create Customer
            <CustomerForm formType="create"/>
        </div>
    );
};