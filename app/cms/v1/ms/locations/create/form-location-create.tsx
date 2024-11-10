"use client"

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

// Form component
export default function CustomerForm() {
    const router = useRouter();
    const provinces = provinceOptions;
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            province: "Tangerang Selatan",
            orders: 1,
            isActive: true,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("Submitting Data:", data);
        axios.post('/api/ms/locations/create', data)
            .then((response) => {
                if (response.data.success) {
                    toast.success("Location created successfully!");
                    router.push('/cms/v1/ms/locations');
                } else {
                    toast.error("Failed to create locations.");
                }
            })
            .catch((error) => {
                console.error("Error Response:", error.response);
                toast.error("Failed to create locations.");
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                {/* Name Field */}
                <_ZodInput control={form.control} name={"name"} labelName={"Name"} placeholder={"input name"}/>

                {/* Province Field */}
                <_ZodSelect control={form.control} name={"province"} labelName={"Province"} datas={provinces} form={form}/>

                {/* Orders Field */}
                <_ZodInput control={form.control} name={"orders"} labelName={"Orders"} placeholder={"input your order"} type={"number"}/>

                {/* Active Status Field */}
                <_ZodBooleanSelectActive control={form.control} name={"isActive"} labelName={"Active Status"}/>

                {/* Submit Button */}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
