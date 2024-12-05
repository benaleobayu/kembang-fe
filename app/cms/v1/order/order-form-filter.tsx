"use client"
import * as React from 'react';
import {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import _ZodDatePicker from "@/components/apps/globals/elements/form/zod-date-picker";
import _ZodSelect from "@/components/apps/globals/elements/form/zod-select";
import {locationOptions} from "@/services/options/locationOptionsService";
import {toast} from "sonner";

// Zod validation schema
const FormSchema = z.object({
    date: z.date(),
    location: z.string(),
});

interface Props {
    urlApi: string;
    setNewRoute: (route: string) => void; // Add the setter function for newRoute
}

export default function OrderFormFilter({urlApi, setNewRoute}: Props) {
    const router = useRouter();
    const [locations, setLocations] = useState(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            date: new Date(),
            location: "",
        },
    });

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

    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        const newPath = `${urlApi}?date=${formData.date.toISOString()}&location=${formData.location}`;

        // Update the newRoute by calling the setter function passed from parent
        setNewRoute(newPath);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
                <div className="group grid md:grid-cols-2 md:gap-2">
                    {/* Date Field */}
                    <_ZodDatePicker control={form.control} name={"date"} labelName={"Delivery date"} />
                    {/* Location Field */}
                    <_ZodSelect control={form.control} name={"location"} labelName={"Location"} placeholder={"Select Location"} datas={locations} form={form} />
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center">
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
};
