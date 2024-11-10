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
import _ZodStringCheckbox from "@/components/apps/globals/elements/form/zod-string-checkbox";
import _ZodBoolean from "@/components/apps/globals/elements/form/zod-boolean";
import * as React from "react";
import _ZodBooleanSelectActive from "@/components/apps/globals/elements/form/zod-boolean-select-active";
import {daysOptions} from "@/components/apps/globals/options/days";
import {locationOptions} from "@/components/apps/globals/options/location";

interface locationOptions {
    label: string,
    value: number
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
    location: z.number().min(1, {
        message: "Location is required.",
    }),
    daySubscribed: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
    isSubscribed: z.boolean(),
    isActive: z.boolean(),
});

// Form component
export default function CustomerForm() {
    const router = useRouter();
    const locations = locationOptions<locationOptions>;
    const days = daysOptions;
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            phone: "",
            address: "",
            location: 1, // Assuming a default locations is set
            daySubscribed: ["nothing"],
            isSubscribed: false,
            isActive: true,
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("Submitting Data:", data);
        axios.post('/api/customers/create', data)
            .then((response) => {
                if (response.data.success) {
                    localStorage.setItem('accessToken', response.data.data.accessToken);
                    sessionStorage.setItem('accessToken', response.data.data.accessToken);
                    toast.success("Customer created successfully!");
                    router.push('/cms/v1/customers');
                } else {
                    toast.error("Failed to create customer.");
                }
            })
            .catch((error) => {
                console.error("Error Response:", error.response);
                toast.error("Failed to create customer.");
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                {/* Name Field */}
                <_ZodInput control={form.control} name={"name"} labelName={"Name"} placeholder={"input your name"}/>

                {/* Phone Field */}
                <_ZodInput control={form.control} name={"phone"} labelName={"Phone"} placeholder={"input your phone"}/>

                {/* Address Field */}
                <_ZodInput control={form.control} name={"address"} labelName={"Address"}
                           placeholder={"input your address"}/>

                {/* Location Field (Could be a select dropdown) */}
                <_ZodSelect control={form.control} name={"location"} labelName={"Locations"} datas={locationObject}
                            form={form}/>

                {/* Days Subscribed (Checkboxes for selecting multiple days) */}
                <_ZodStringCheckbox control={form.control} name={"daySubscribed"} labelName={"Days Subscribed"}
                                    datas={days}/>

                {/* Subscription and Active Status Fields */}
                <_ZodBoolean control={form.control} name={"isSubscribed"} labelName={"Subscription"}/>

                {/* Active Status Field */}
                <_ZodBooleanSelectActive control={form.control} name={"isActive"} labelName={"Active Status"}/>

                {/* Submit Button */}
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
