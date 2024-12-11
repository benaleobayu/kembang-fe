"use client"
import * as React from 'react';
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";
import { routesUrl } from "@/components/apps/globals/options/routes";
import { _ReactDataTable } from "@/components/apps/globals/elements/data-table/react-data-table";
import { OrderColumnTable } from "@/app/cms/v1/order/order-column-table";
import OrderFormFilter from "@/app/cms/v1/order/order-form-filter";
import { useEffect, useState } from "react";
import {format} from "date-fns";

type Props = {};

export default function Page(props: Props) {
    const apiRoute = routesUrl.find(data => data.key === "orderApi")?.url;
    const urlRoute = routesUrl.find(data => data.key === "order")?.url;
    const [newRoute, setNewRoute] = useState(apiRoute);
    const [filterParams, setFilterParams] = useState<{ [key: string]: string }>({});
    const [defaultValues, setDefaultValues] = useState({
        date: "",
        location: "",
        route: 0
    });

    // Update URL dynamically based on filterParams
    useEffect(() => {
        if (apiRoute) {
            const queryParams = new URLSearchParams(filterParams).toString();
            setNewRoute(queryParams ? `${apiRoute}?${queryParams}` : apiRoute);
        }
    }, [filterParams, apiRoute]);

    // Function to reset form values when refresh is clicked
    const resetForm = () => {
        setDefaultValues({
            date: "",
            location: "",
            route: 0
        });
        setFilterParams({});
    };

    return (
        <div>
            Page Order
            <_HeaderTable resetForm={resetForm} isCreate createLink={`${urlRoute}/create`} />
            <OrderFormFilter
                setFilterParams={setFilterParams}
                defaultValues={defaultValues} // Pass default values to form
                resetForm={resetForm} // Pass reset function to form
            />
            <_ReactDataTable
                apiRoute={newRoute}
                columnTable={OrderColumnTable}
                filterParams={filterParams}
            />
        </div>
    );
}
