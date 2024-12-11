"use client";
import * as React from 'react';
import {useState} from 'react';
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import _ZodDatePicker from "@/components/apps/globals/elements/form/zod-date-picker";
import _ZodSelect from "@/components/apps/globals/elements/form/zod-select";
import {locationOptions} from "@/services/options/locationOptionsService";
import {toast} from "sonner";
import {SelectOptions} from "@/types/SelectOptions";
import {format} from "date-fns";
import {routeOptionsHardCode} from "@/components/apps/globals/options/routeHardcode";

// Zod validation schema
const FormSchema = z.object({
    date: z.string().nullable(),
    location: z.string().nullable(),
    route: z.number().int().nullable()
});

interface Props<T> {
    setFilterParams: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>; // To update filterParams
    defaultValues: T,
    resetForm: () => void
}

export default function OrderFormFilter<T>({setFilterParams, defaultValues}: Props<T>) {
    const [locations, setLocations] = useState<SelectOptions>([]);
    const routes = routeOptionsHardCode;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultValues as any,
    });

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchData = await locationOptions();
                setLocations(fetchData);
            } catch (e) {
                toast.error("Failed to fetch locations.");
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        // Update filterParams dynamically
        const formattedDate = format(new Date(formData.date), 'yyyy-MM-dd');
        console.log("val date : " + formData.date)
        const params: { [key: string]: string } = {};
        if (formData.date) params.date = formData.date !== "" ? formattedDate : "";
        if (formData.location) params.location = formData.location;
        if (formData.route) params.route = formData.route;

        setFilterParams(params); // Update filterParams in parent component
    };

    React.useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues); // Reset form with default values when they change
        }
    }, [defaultValues]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-[0.9fr_0.1fr] gap-2 space-y-4">
                <div className="group grid md:grid-cols-3 md:gap-2">
                    <_ZodDatePicker control={form.control} name={"date"} labelName={"Delivery Date"}/>
                    <_ZodSelect control={form.control} name={"location"} labelName={"Location"} placeholder={"Select Location"} datas={locations || []} form={form} disabled={false}/>
                    <_ZodSelect control={form.control} name={"route"} labelName={"Route"} placeholder={"Select Route"} datas={routes || []} form={form} disabled={false}/>
                </div>

                <div className="flex justify-between items-end">
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
}
