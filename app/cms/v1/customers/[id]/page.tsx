// @flow
import * as React from 'react';
import FormLocation from "@/app/cms/v1/ms/locations/form-location";
import CustomerForm from "@/app/cms/v1/customers/customer-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Detail customer
            <CustomerForm formType="read"/>
        </div>
    );
};