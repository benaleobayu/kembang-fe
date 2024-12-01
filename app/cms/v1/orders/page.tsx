// @flow
import * as React from 'react';
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";
import {routesUrl} from "@/components/apps/globals/options/routes";
import {_ReactDataTable} from "@/components/apps/globals/elements/data-table/react-data-table";
import {ProductCategoryColumnTable} from "@/app/cms/v1/ms/product_category/product-category-column-table";
import {ProductColumnTable} from "@/app/cms/v1/ms/products/product-column-table";
import {OrderColumnTable} from "@/app/cms/v1/orders/order-column-table";

type Props = {};
export default function Page(props: Props) {
    const apiRoute = routesUrl.find(data => data.key === "orderApi")?.url;
    const urlRoute = routesUrl.find(data => data.key === "order")?.url;

    return (
        <div>
            Page Order
            <_HeaderTable isCreate createLink={`${urlRoute}/create`}/>
            <_ReactDataTable apiRoute={apiRoute} columnTable={OrderColumnTable}/>
        </div>
    );
};