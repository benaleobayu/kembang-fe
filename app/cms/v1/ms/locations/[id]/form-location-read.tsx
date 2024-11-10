"use client";

import {toast} from "sonner";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Form} from "@/components/ui/form";
import axios from "axios";
import {useParams} from "next/navigation"; // Use useParams and useRouter
import _ZodSelect from "@/components/apps/globals/elements/form/zod-select";
import _ZodInput from "@/components/apps/globals/elements/form/zod-input";
import * as React from "react";
import {useEffect, useState} from "react";
import _ZodBooleanSelectActive from "@/components/apps/globals/elements/form/zod-boolean-select-active";
import {provinceOptions} from "@/components/apps/globals/options/province";

// Zod validation schema
const FormSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    province: z.string(),
    orders: z.number(),
    isActive: z.boolean(),
});

export default function _LocationDetailId() {
    const {id} = useParams(); // Get id from URL
    const provinces = provinceOptions;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            province: "Tangerang Selatan",
            orders: 0,
            isActive: true,
        },
    });

    const {reset} = form; // Destructure reset from useForm

    function onSubmit(formData: z.infer<typeof FormSchema>) {
        console.log("Submitting Data:", formData);
    }

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/ms/locations/${id}`);
                setData(response.data.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
                toast.error("Failed to load location.");
            }
        };
        fetchData();
    }, [id]);

    // UseEffect to reset form values when data is fetched
    useEffect(() => {
        if (data) {
            reset({
                name: data.name,
                province: data.province || "Tangerang Selatan",
                orders: data.orders,
                isActive: data.status,
            });
        }
    }, [data, reset]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <_ZodInput control={form.control} name="name" labelName="Name" placeholder="input name" disabled/>
                <_ZodSelect control={form.control} name="province" labelName="Province" datas={provinces} form={form}
                            disabled/>
                <_ZodInput control={form.control} name="orders" labelName="Orders" placeholder="input your order"
                           type="number" disabled/>
                <_ZodBooleanSelectActive control={form.control} name="isActive" labelName="Active Status" disabled/>
            </form>
        </Form>
    );
}