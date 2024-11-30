// @flow
import * as React from 'react';
import LocationForm from "@/app/cms/v1/ms/locations/location-form";
import ProductCategoryForm from "@/app/cms/v1/ms/product_category/product-category-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Detail Procut Category
            <ProductCategoryForm formType="read"/>
        </div>
    );
};