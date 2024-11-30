// @flow
import * as React from 'react';
import LocationForm from "@/app/cms/v1/ms/locations/location-form";
import ProductCategoryForm from "@/app/cms/v1/ms/product_category/product-category-form";
import ProductForm from "@/app/cms/v1/ms/products/product-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Detail Product
            <ProductForm formType="read"/>
        </div>
    );
};