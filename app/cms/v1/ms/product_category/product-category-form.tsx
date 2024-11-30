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
import {provinceOptions} from "@/components/apps/globals/options/province";
import {routesUrl} from "@/components/apps/globals/options/routes";

// Zod validation schema
const FormSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    isActive: z.boolean(),
});

type FormType = {
    formType?: "create" | "update" | "read";
    edit?: boolean;
};

const apiRoute = routesUrl.find(data => data.key === "productCategoryApi")?.url;
const urlRoute = routesUrl.find(data => data.key === "productCategory")?.url;
const mainName = "Product Category";

export default function ProductCategoryForm({formType = "create", id}: FormType) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(formType === "create");

    const router = useRouter();
    const url = new URL(window.location.href);
    const editParam = url.searchParams.get("edit") === "true";

    const isReadOrUpdate = formType === "read" || formType === "update" || editParam;
    const provinces = provinceOptions;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            isActive: true,
        },
    });

    const {reset} = form;

    // Fetch data
    useEffect(() => {
        if (isReadOrUpdate) {
            const fetchData = async () => {
                const idFromPath = window.location.pathname.split("/").at(-1);
                setLoading(true);
                setError(null);
                try {
                    const response = await axios.get(`${apiRoute}/${id || idFromPath}`);
                    setData(response.data.data);
                } catch (e) {
                    console.error("Error Response:", e.response);
                    toast.error(`Failed to fetch ${mainName.toLowerCase()} data.`);
                    setError(e.response?.data?.message || "An error occurred");
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [formType, id, isReadOrUpdate]);

    // Update form default values when `data` changes
    useEffect(() => {
        if (data && isReadOrUpdate) {
            reset({
                name: data.name || "",
                isActive: data.isActive || true,
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
            toast.error(error.response?.data?.message || "Failed to save location.");
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
                <_ZodInput control={form.control} name="name" labelName="Name" placeholder="Input name" disabled={disabled}/>

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