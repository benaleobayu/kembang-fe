// @flow
import * as React from 'react';
import LocationForm from "@/app/cms/v1/ms/locations/location-form";
import ProductCategoryForm from "@/app/cms/v1/ms/product_category/product-category-form";
import ProductForm from "@/app/cms/v1/ms/products/product-form";
import OrderForm from "@/app/cms/v1/order/order-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Detail Order
            <OrderForm formType="read"/>
        </div>
    );
};