"use client";

import {toast} from "sonner";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFieldArray, useForm, useFormContext, useWatch} from "react-hook-form";
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
import _ZodInputArea from "@/components/apps/globals/elements/form/zod-input-area";
import {SelectOptions} from "@/types/SelectOptions";
import _ZodBooleanSelect from "@/components/apps/globals/elements/form/zod-boolean-select";
import {__MyCard} from "@/components/apps/globals/elements/mycard";
import _ZodBoolean from "@/components/apps/globals/elements/form/zod-boolean";
import _ZodDatePicker from "@/components/apps/globals/elements/form/zod-date-picker";
import {customerOptions} from "@/services/options/customerOptionsService";
import {productOptions} from "@/services/options/productOptionsService";
import {format} from "date-fns";

// Zod validation schema
const FormSchema = z.object({
    customerId: z.string(),
    forwardName: z.string(),
    forwardAddress: z.string(),
    description: z.string(),
    orderDate: z.date(),
    deliveryDate: z.date(),
    orderProducts: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().int(),
            orderNote: z.string(),
        }),
    ).min(1, {
        message: "At least one order product is required.",
    }),
    driverName: z.string(),
    route: z.number().int(),
    isPaid: z.boolean(),
    isActive: z.boolean(),
});

type FormType = {
    formType?: "create" | "update" | "read";
    edit?: boolean;
};

const apiRoute = routesUrl.find(data => data.key === "orderApi")?.url;
const urlRoute = routesUrl.find(data => data.key === "order")?.url;
const mainName = "Order";

export default function OrderForm({formType = "create", id}: FormType) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(formType === "create");
    const [customers, setCustomers] = useState<SelectOptions>([]);
    const [products, setProducts] = useState<SelectOptions>([]);

    const router = useRouter();
    const url = new URL(window.location.href);
    const editParam = url.searchParams.get("edit") === "true";

    const isReadOrUpdate = formType === "read" || formType === "update" || editParam;
    const isCreateOrUpdate = formType === "create" || formType === "update" || editParam;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            customerId: "",
            forwardName: "",
            forwardAddress: "",
            description: "",
            orderDate: new Date("2024-12-01"),
            deliveryDate: new Date("2024-12-01"),
            orderProducts: [
                {
                    productId: "",
                    quantity: 0,
                    orderNote: "",
                },
            ],
            driverName: "",
            route: 0,
            isPaid: true,
            isActive: true,
        },
    });

    const {reset} = form;
    const { control, setValue } = useFormContext();

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "orderProducts",
    });

    const direct = useWatch({
        control: control,
        name: "direct",
        defaultValue: false
    })

    // Update the "direct" value based on data.forwardName or data.forwardAddress
    useEffect(() => {
        const isDirect = Boolean(data.forwardName?.trim() || data.forwardAddress?.trim());
        setValue("direct", isDirect); // Update the form value
    }, [data.forwardName, data.forwardAddress, setValue]); // Re-run effect when data changes

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
        }
    }, [formType, id, isReadOrUpdate]);

    useEffect(() => { // fet customer options
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchCustomerOptions = await customerOptions();
                setCustomers(fetchCustomerOptions);
            } catch (e) {
                console.error("Error Response:", e.response);
                toast.error(`Failed to fetch customers data.`);
                setError(e.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => { // fetch product options
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchCustomerOptions = await productOptions();
                setProducts(fetchCustomerOptions);
            } catch (e) {
                console.error("Error Response:", e.response);
                toast.error(`Failed to fetch customers data.`);
                setError(e.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Update form default values when `data` changes
    useEffect(() => {
        if (data && isReadOrUpdate) {
            reset({
                customerId: data.customerId || "",
                forwardName: data.forwardName || "",
                forwardAddress: data.forwardAddress || "",
                description: data.description || "",
                orderDate: data.orderDate || "2024-12-01",
                deliveryDate: data.deliveryDate || "2024-12-01",
                orderProducts: (data.listOrders || []).map((d: any) => ({
                    productId: d.productId || "",
                    quantity: d.quantity || 0,
                    orderNote: d.orderNote || "", // Sesuaikan dengan data yang ada
                })),
                driverName: data.driverName || "",
                route: data.route || 0,
                isPaid: data.isPaid || true,
                isActive: data.isActive || true,
            });
        }
    }, [data, isReadOrUpdate, reset]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Submit handler
    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        try {
            // Format orderDate dan deliveryDate ke format 'yyyy-MM-dd'
            const formattedOrderDate = format(new Date(formData.orderDate), 'yyyy-MM-dd');
            const formattedDeliveryDate = format(new Date(formData.deliveryDate), 'yyyy-MM-dd');

            // Salin formData dan update orderDate dan deliveryDate
            const dataToSend = {
                ...formData,
                orderDate: formattedOrderDate,
                deliveryDate: formattedDeliveryDate,
            };

            // Cek data yang akan dikirim
            console.log("Data yang akan dikirim:", dataToSend);

            if (formType === "create") {
                const response = await axios.post(`${apiRoute}/create`, dataToSend);
                console.log(dataToSend)
                if (response.data.success) {
                    toast.success(`${mainName} created successfully!`);
                    router.push(urlRoute);
                } else {
                    toast.error(`Failed to create ${mainName.toLowerCase()}.`);
                }
            } else if (isReadOrUpdate) {
                const idFromPath = window.location.pathname.split("/").at(-1);
                const response = await axios.put(`${apiRoute}/${id || idFromPath}`, dataToSend);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 pb-[30vh]">
                <div className="group grid md:grid-cols-[0.5fr] gap-2">
                    {/* CustomerId Field -> select customers */}
                    <_ZodSelect control={form.control} name={"customerId"} labelName={"Customer"} placeholder={"Select Customer"} datas={customers} form={form} disabled={disabled}/>
                </div>

                <div className="group">
                    {/* Send to Other Person ? Field */}
                    <_ZodBoolean control={form.control} name={"direct"} labelName={"Send To Other Person?"} disabled={disabled}/>
                    {direct && (
                        <>
                            <div className="group grid md:grid-cols-[0.5fr_1.5fr] md:gap-2">
                                {/* Forward Name Field */}
                                <_ZodInput control={form.control} name="forwardName" labelName="Alternative Name" placeholder="Input name" disabled={disabled}/>
                                {/* Forward Address Field */}
                                <_ZodInput control={form.control} name="forwardAddress" labelName="Alternative Address" placeholder="Input address" disabled={disabled}/>
                            </div>
                        </>
                    )}
                </div>

                {/* Description Field */}
                <_ZodInputArea control={form.control} name="description" labelName="Description" placeholder="Input description here" disabled={disabled}/>

                <div className="group grid md:grid-cols-2 grid-cols-1 gap-2">
                    {/* Order Date Field */}
                    <_ZodDatePicker control={form.control} name="orderDate" labelName="Order Date" disabled={disabled}/>
                    {/* Delivery Date Field */}
                    <_ZodDatePicker control={form.control} name="deliveryDate" labelName="Delivery Date" disabled={disabled}/>
                </div>

                {/* Order Data List Field */}
                <__MyCard title="Products" className="relative">
                    <Button type="button" className="absolute top-6 right-6" onClick={() => append({productId: "", quantity: 0, orderNote: ""})}>
                        Add +
                    </Button>
                    {fields.map((item, index) => (
                        <div key={item.id} className="grid md:grid-cols-[0.5fr_0.25fr_1fr_0.25fr] md:gap-2 items-end">
                            {/* Product Field */}
                            <_ZodSelect control={form.control} name={`orderProducts[${index}].productId`} labelName="Product" placeholder="Select Product" datas={products} form={form} disabled={disabled}/>
                            {/* Qty Field */}
                            <_ZodInput control={form.control} name={`orderProducts[${index}].quantity`} type="number" labelName="Quantity" placeholder="Input quantity" disabled={disabled}/>
                            {/* Note Field */}
                            <_ZodInput control={form.control} name={`orderProducts[${index}].orderNote`} labelName="Note" placeholder="Input note" disabled={disabled}/>
                            {/* Button Remove */}
                            <Button type="button" onClick={() => remove(index)} className="">Remove</Button>
                        </div>
                    ))}
                </__MyCard>

                <div className="group grid md:grid-cols-2 md:gap-2">
                    {/* Driver Name Field */}
                    <_ZodInput control={form.control} name="driverName" labelName="Name" placeholder="Input driver name" disabled={disabled}/>
                    {/* Route Field */}
                    <_ZodInput control={form.control} name="route" type="number" labelName="Route" placeholder="Input route" disabled={disabled}/>
                    {/* Paid Field */}
                    <_ZodBooleanSelect control={form.control} name="isPaid" labelName="Paid Status" disabled={disabled} ifFalse={"No"} ifTrue={"Yes"}/>
                    {/* Active Status Field */}
                    <_ZodBooleanSelectActive control={form.control} name="isActive" labelName="Active Status" disabled={disabled}/>
                </div>


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