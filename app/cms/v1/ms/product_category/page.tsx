// @flow
import * as React from 'react';
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";
import {routesUrl} from "@/components/apps/globals/options/routes";
import {_ReactDataTable} from "@/components/apps/globals/elements/data-table/react-data-table";
import {ProductCategoryColumnTable} from "@/app/cms/v1/ms/product_category/product-category-column-table";

type Props = {};
export default function Page(props: Props) {
    const apiRoute = routesUrl.find(data => data.key === "productCategoryApi")?.url;
    const urlRoute = routesUrl.find(data => data.key === "productCategory")?.url;

    return (
        <div>
            Page Product Category
            <_HeaderTable isCreate createLink={`${urlRoute}/create`}/>
            <_ReactDataTable apiRoute={apiRoute} columnTable={ProductCategoryColumnTable}/>
        </div>
    );
};