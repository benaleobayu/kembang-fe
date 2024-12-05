"use client";

import {toast} from "sonner";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import axios from "axios";
import {useRouter} from "next/navigation";
import _ZodSelect from "@/components/apps/globals/elements/form/zod-select";
import _ZodInput from "@/components/apps/globals/elements/form/zod-input";
import * as React from "react";
import {useEffect, useState} from "react";
import _ZodBooleanSelectActive from "@/components/apps/globals/elements/form/zod-boolean-select-active";
import {routesUrl} from "@/components/apps/globals/options/routes";
import _ZodBoolean from "@/components/apps/globals/elements/form/zod-boolean";
import {daysOptions} from "@/components/apps/globals/options/days";
import {locationOptionsHardCode} from "@/components/apps/globals/options/location";
import _ZodStringCheckbox from "@/components/apps/globals/elements/form/zod-string-checkbox";
import {productOptions} from "@/services/options/productOptionsService";
import {locationOptions} from "@/services/options/locationOptionsService";

interface LocationOptions {
    label: string,
    value: string
}

// Zod validation schema
const FormSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    phone: z.string().min(8, {
        message: "Phone number must be at least 8 characters.",
    }).regex(/^\d+$/, {
        message: "Phone number must contain only digits.",
    }),
    address: z.string().min(1, {
        message: "Address is required.",
    }),
    location: z.string().min(1, {
        message: "Location is required.",
    }),
    daySubscribed: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    isSubscribed: z.boolean(),
    isActive: z.boolean(),
});

type FormType = {
    formType?: "create" | "update" | "read";
    edit?: boolean;
};

const apiRoute = routesUrl.find(data => data.key === "customerApi")?.url;
const urlRoute = routesUrl.find(data => data.key === "customer")?.url;
const mainName = "Customer";


export default function CustomerForm({formType = "create", id}: FormType) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(formType === "create");
    const [locations, setLocations] = useState<LocationOptions>([]);

    const router = useRouter();
    const days = daysOptions;

    const url = new URL(window.location.href);
    const editParam = url.searchParams.get("edit") === "true";

    const isReadOrUpdate = formType === "read" || formType === "update" || editParam;
    const isCreateOrUpdate = formType === "create" || formType === "update" || editParam;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            location: "", // Assuming a default locations is set
            daySubscribed: ["nothing"],
            isSubscribed: false,
            isActive: true,
        },
    });

    const {reset} = form;

    // Fetch data
    useEffect(() => {
        if (isReadOrUpdate) {
            const fetchData = async () => {
                const idFromPath = window.location.pathname.split("/").at(-1);
                try {
                    const response = await axios.get(`${apiRoute}/${id || idFromPath}`);
                    setData(response.data.data);
                } catch (e) {
                    toast.error(`Failed to fetch ${mainName.toLowerCase()} data.`);
                }
            };
            fetchData();
        }
    }, [formType, id, isReadOrUpdate]);

    useEffect(() => { // fetch product options
        const fetchData = async () => {
            try {
                const fetchData = await locationOptions();
                setLocations(fetchData);
            } catch (e) {
                toast.error(`Failed to fetch products data.`);
            }
        };
        fetchData();
    }, []);



    // Update form default values when `data` changes
    useEffect(() => {
        if (data && isReadOrUpdate) {
            const isSubscribed = data.isSubscribed === "true" || data.isSubscribed === true;
            const isActive = data.isActive === "true" || data.isActive === true;
            reset({
                name: data.name || "",
                phone: data.phone || "",
                address: data.address || "",
                daySubscribed: data.daySubscribed || [],
                location: data.locationName || "",
                isSubscribed: isSubscribed,
                isActive: isActive,
            });
        }
    }, [data, isReadOrUpdate, reset]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Submit handler
    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        try {
            if (formType === "create") {
                const response = await axios.post(`${apiRoute}/create`, formData);
                console.log(response)
                if (response.data.success) {
                    toast.success(`${mainName} created successfully!`);
                    router.push(urlRoute);
                } else {
                    toast.error(`Failed to create ${mainName.toLowerCase()}.`);
                }
            } else if (isReadOrUpdate) {
                const idFromPath = window.location.pathname.split("/").at(-1);
                const response = await axios.put(`${apiRoute}/${id || idFromPath}`, formData);
                if (response.data.success) {
                    toast.success(`${mainName} updated successfully!`);
                    router.push(urlRoute);
                } else {
                    toast.error(`Failed to update ${mainName.toLowerCase()}.`);
                }
            }
        } catch (error) {
            console.error("Error Response:", error.response);
            toast.error(error.response?.data?.message || `Failed to save ${mainName.toLowerCase()}.`);
        }
    }

    const handleBack = () => {

        if (urlRoute) {
            router.push(urlRoute);
        } else {
            console.error('Route not found!');
        }
    };

    const isEditing = isEditable || formType === "update" || url.searchParams.get("edit") === "true";
    const disabled = !isEditing && formType === "read";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                {/* Name Field */}
                <_ZodInput control={form.control} name={"name"} labelName={"Name"} placeholder={"input your name"} disabled={disabled}/>

                {/* Phone Field */}
                <_ZodInput control={form.control} name={"phone"} labelName={"Phone"} placeholder={"input your phone"} disabled={disabled}/>

                {/* Address Field */}
                <_ZodInput control={form.control} name={"address"} labelName={"Address"} placeholder={"input your address"} disabled={disabled}/>

                {/* Location Field (Could be a select dropdown) */}
                <_ZodSelect control={form.control} name={"location"} labelName={"Location"} placeholder={"Select Location"} datas={locations} form={form} disabled={disabled}/>

                {/* Days Subscribed (Checkboxes for selecting multiple days) */}
                <_ZodStringCheckbox control={form.control} name={"daySubscribed"} labelName={"Days Subscribed"} datas={days} disabled={disabled}/>

                {/* Subscription and Active Status Fields */}
                <_ZodBoolean control={form.control} name={"isSubscribed"} labelName={"Subscription"} disabled={disabled}/>

                {/* Active Status Field */}
                <_ZodBooleanSelectActive control={form.control} name="isActive" labelName="Active Status" disabled={disabled}/>

                {/* Submit Button */}
                <div className="flex justify-between items-center">
                    <Button onClick={() => handleBack()} type="button" variant="outline">
                        Back
                    </Button>
                    {formType === "create" && <Button type="submit">Create</Button>}
                    {!isEditing && formType === "read" && (
                        <Button
                            type="button"
                            onClick={() => {
                                setIsEditable(true);
                                url.searchParams.set("edit", "true");
                                window.history.pushState({}, "", url.toString());
                            }}
                        >
                            Edit
                        </Button>
                    )}
                    {isEditing && url.searchParams.get("edit") === "true" && <Button type="submit">Save</Button>}
                </div>
            </form>
        </Form>
    );
}