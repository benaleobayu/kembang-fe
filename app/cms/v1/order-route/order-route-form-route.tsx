"use client"
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {routesUrl} from "@/components/apps/globals/options/routes";
import axios from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import _ZodInput from "@/components/apps/globals/elements/form/zod-input";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";

// Zod validation schema
const FormSchema = z.object({
    driverName: z.string(),
    route: z.number().int(),
});

const apiRoute = routesUrl.find(data => data.key === "orderApi")?.url;
const urlRoute = routesUrl.find(data => data.key === "order")?.url;
const mainName = "Order";

export default function OrderRouteFormRoute({id}: { id?: string }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const router = useRouter();
    const disabled = false;
    const isEditing = true;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            driverName: "",
            route: 0,
        },
    });

    const {reset} = form;

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const idFromPath = window.location.pathname.split("/").at(-1);
                const response = await axios.get(`${apiRoute}/${id || idFromPath}`);
                setData(response.data.data);
                console.log(`${apiRoute}/${id || idFromPath}`)
            } catch (e) {
                console.error("Error Response:", e.response);
                toast.error(`Failed to fetch ${mainName.toLowerCase()} data.`);
                setError(e.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (data) {
            reset({
                driverName: data.driverName || "",
                route: data.route || 0,
            });
        }
    }, [data, reset]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        try {
            const idFromPath = window.location.pathname.split("/").at(-1);
            const response = await axios.put(`${apiRoute}/${id || idFromPath}?isRoute=true`, formData);
            if (response.data.success) {
                toast.success(`${mainName} route updated successfully!`);
                router.push(urlRoute);
            } else {
                toast.error(`Failed to update ${mainName.toLowerCase()}.`);
            }
        } catch (error) {
            console.error("Error Response:", error.response);
            toast.error(error.response?.data?.message || "Failed to save location.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">

                <div className="group grid md:grid-cols-2 md:gap-2">
                    {/* Driver Name Field */}
                    <_ZodInput control={form.control} name="driverName" labelName="Name" placeholder="Input driver name" disabled={disabled}/>
                    {/* Route Field */}
                    <_ZodInput control={form.control} name="route" type="number" labelName="Route" placeholder="Input route" disabled={disabled}/>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center">
                    {isEditing && <Button type="submit">Save</Button>}
                </div>
            </form>
        </Form>
    );
};