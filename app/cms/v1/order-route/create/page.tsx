// @flow
import * as React from 'react';
import ProductForm from "@/app/cms/v1/ms/products/product-form";
import OrderForm from "@/app/cms/v1/order/order-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Create Order
            <OrderForm formType="create"/>
        </div>
    );
};