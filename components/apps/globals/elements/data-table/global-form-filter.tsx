"use client";
import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import _ZodDatePicker from "@/components/apps/globals/elements/form/zod-date-picker";
import _ZodSelect from "@/components/apps/globals/elements/form/zod-select";
import { locationOptions } from "@/services/options/locationOptionsService";
import { toast } from "sonner";
import { SelectOptions } from "@/types/SelectOptions";
import { format } from "date-fns";
import { routeOptionsHardCode } from "@/components/apps/globals/options/routeHardcode";

const getDynamicFormSchema = (isDate: boolean, isLocation: boolean, isRoute: boolean) => {
    const schemaFields: any = {};

    if (isDate) schemaFields.date = z.string().nullable();
    if (isLocation) schemaFields.location = z.string().nullable();
    if (isRoute) schemaFields.route = z.number().int().nullable();

    return z.object(schemaFields);
};

interface Props<T> {
    setFilterParams: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    defaultValues: T;
    resetForm: () => void;
    isDate?: boolean;
    isLocation?: boolean;
    isRoute?: boolean;
}

export default function GlobalFormFilter<T>({
                                                setFilterParams,
                                                defaultValues,
                                                isDate = false,
                                                isLocation = false,
                                                isRoute = false,
                                            }: Props<T>) {
    const [locations, setLocations] = useState<SelectOptions>([]);
    const routes = routeOptionsHardCode;

    const FormSchema = getDynamicFormSchema(isDate, isLocation, isRoute);

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
        setFilterParams((prevParams) => {
            const newParams: { [key: string]: string } = { ...prevParams };

            // Tambahkan parameter valid saja
            if (formData.date) {
                const parsedDate = new Date(formData.date);
                newParams.date = isNaN(parsedDate.getTime()) ? "" : format(parsedDate, "yyyy-MM-dd");
            } else {
                delete newParams.date; // Hapus parameter jika kosong
            }

            if (formData.location) {
                newParams.location = formData.location;
            } else {
                delete newParams.location; // Hapus parameter jika kosong
            }

            if (formData.route) {
                newParams.route = formData.route.toString();
            } else {
                delete newParams.route; // Hapus parameter jika kosong
            }

            console.log("Updated Filter Params:", newParams); // Debugging
            return newParams; // Tidak mempertahankan parameter lama yang tidak valid
        });
    };

    React.useEffect(() => {
        if (defaultValues) {
            form.reset(defaultValues);
        }
    }, [defaultValues]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full grid grid-cols-[0.9fr_0.1fr] gap-2 space-y-4">
                <div className="group grid md:grid-cols-4 md:gap-2">
                    {isDate && (
                        <_ZodDatePicker
                            control={form.control}
                            name={"date"}
                            labelName={"Delivery Date"}
                        />
                    )}
                    {isLocation && (
                        <_ZodSelect
                            control={form.control}
                            name={"location"}
                            labelName={"Location"}
                            placeholder={"Select Location"}
                            datas={locations || []}
                            form={form}
                            disabled={false}
                        />
                    )}
                    {isRoute && (
                        <_ZodSelect
                            control={form.control}
                            name={"route"}
                            labelName={"Route"}
                            placeholder={"Select Route"}
                            datas={routes || []}
                            form={form}
                            disabled={false}
                        />
                    )}
                </div>
                <div className="flex w-full justify-end items-end">
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Form>
    );
}