"use client"
import * as React from 'react';
import {useEffect, useState} from 'react';
import _HeaderTable from "@/components/apps/globals/elements/data-table/header-table";
import {routesUrl} from "@/components/apps/globals/options/routes";
import {_ReactDataTable} from "@/components/apps/globals/elements/data-table/react-data-table";
import {OrderRouteColumnTable} from "@/app/cms/v1/order-route/order-route-column-table";
import OrderRouteFormFilter from "@/app/cms/v1/order-route/order-route-form-filter";
import GlobalFormFilter from "@/components/apps/globals/elements/data-table/global-form-filter";

type Props = {};

export default function Page(props: Props) {
    const mainName = "order-route";
    const apiRoute = routesUrl.find(data => data.key === `${mainName}Api`)?.url;
    const urlRoute = routesUrl.find(data => data.key === mainName)?.url;
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
            Page Route Delivery
            <_HeaderTable resetForm={resetForm} isCreate createLink={`${urlRoute}/create`}/>
            <GlobalFormFilter
                setFilterParams={setFilterParams}
                defaultValues={defaultValues} // Pass default values to form
                resetForm={resetForm} // Pass reset function to form
                isDate
            />
            <_ReactDataTable
                apiRoute={newRoute}
                columnTable={OrderRouteColumnTable}
                filterParams={filterParams}
            />
        </div>
    );
}
