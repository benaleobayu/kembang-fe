// @flow
import * as React from 'react';
import ProductForm from "@/app/cms/v1/ms/products/product-form";

type Props = {};
export default function Page(props: Props) {
    return (
        <div>
            Create Product
            <ProductForm formType="create"/>
        </div>
    );
};