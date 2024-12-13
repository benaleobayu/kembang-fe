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
    deliveryDate: z.date(),
    orderProducts: z.array(
        z.object({
            orderId: z.string().nullable().optional(),
            productId: z.string(),
            quantity: z.number().int(),
            orderNote: z.string().nullable(),
        }),
    ).min(1, {
        message: "At least one order product is required.",
    }),
    route: z.string().nullable(),
    orders: z.number().int(),
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
    const [addMore, setAddMore] = useState(false);

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
            orderDate: new Date(),
            deliveryDate: new Date(),
            orderProducts: [
                {
                    orderId: "",
                    productId: "",
                    quantity: 0,
                    orderNote: "",
                },
            ],
            driverName: "",
            route: "",
            orders: 0,
            isPaid: false,
            isActive: true,
        },
    });

    const {reset} = form;

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "orderProducts",
    });


    // Fetch data
    useEffect(() => {
        if (isReadOrUpdate) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const idFromPath = window.location.pathname.split("/").at(-1);
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

    const direct = useWatch({
        control: form.control,
        name: "direct",
        defaultValue: !!(data?.forwardName || data?.forwardAddress)
    })

    useEffect(() => { // fet customer options
        const fetchData = async () => {
            try {
                const fetchData = await customerOptions();
                setCustomers(fetchData);
            } catch (e) {
                toast.error(`Failed to fetch customers data.`);
            }
        };
        fetchData();
    }, []);

    useEffect(() => { // fetch product options
        const fetchData = async () => {
            try {
                const fetchData = await productOptions();
                setProducts(fetchData);
            } catch (e) {
                toast.error(`Failed to fetch products data.`);
            }
        };
        fetchData();
    }, []);

    // Update form default values when `data` changes
    useEffect(() => {
        if (data && isReadOrUpdate) {
            reset({
                direct: !!(data.forwardName || data.forwardAddress) || false,
                customerId: data.customerId || "",
                forwardName: data.forwardName || "",
                forwardAddress: data.forwardAddress || "",
                description: data.description || "",
                orderDate: new Date(data.orderDate) || new Date().toISOString().split('T')[0],
                deliveryDate: new Date(data.deliveryDate) || new Date().toISOString().split('T')[0],
                orderProducts: (data.listOrders || []).map((d: any) => ({
                    orderId: d.orderId || "",
                    productId: d.productId || "",
                    quantity: d.quantity || 0,
                    orderNote: d.orderNote || "", // Sesuaikan dengan data yang ada
                })),
                driverName: data.driverName || "",
                route: data.route || "",
                orders: data.orders || 0,
                isPaid: data.isPaid || false,
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
            const formattedDeliveryDate = format(new Date(formData.deliveryDate), 'yyyy-MM-dd');
            let combineRoute = "";
            console.log(formData.route)
            if (formData.route && formData.route !== "undefined" && formData.route !== "null" && formData.route !== "") {
                combineRoute = (formData.route + "_" + formattedDeliveryDate).toString();
            }

            // Salin formData dan update orderDate dan deliveryDate
            const dataToSend = {
                ...formData,
                deliveryDate: formattedDeliveryDate,
                route: combineRoute
            };

            if (formType === "create") {
                const response = await axios.post(`${apiRoute}/create`, dataToSend);
                console.log(dataToSend)
                if (response.data.success) {
                    toast.success(`${mainName} created successfully!`);
                    reset();
                    if (addMore) {
                        router.push(urlRoute + "/create");
                    } {
                        router.push(urlRoute);
                    }
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
                    <_ZodSelect control={form.control} name={"customerId"} labelName={"Customer"} placeholder={"Select Customer"} isCustomer datas={customers} form={form} disabled={disabled}/>
                    {/* Description Field */}
                    <_ZodInputArea control={form.control} name="customerAddress" labelName="Customer Address" placeholder="Address of customers" disabled={true}/>
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
                    {/*<_ZodDatePicker control={form.control} name="orderDate" labelName="Order Date" disabled={disabled}/>*/}
                    {/* Delivery Date Field */}
                    <_ZodDatePicker control={form.control} name="deliveryDate" labelName="Delivery Date" disabled={disabled}/>
                </div>

                {/* Order Data List Field */}
                <__MyCard title="Products" className="relative">
                    {!disabled && (
                        <Button type="button" className="absolute top-6 right-6" onClick={() => append({orderId: "",productId: "", quantity: 0, orderNote: ""})}>
                            Add +
                        </Button>
                    )}
                    {fields.map((item, index) => {
                        const classDisabled = disabled ? "grid md:grid-cols-[0.5fr_0.25fr_1.25fr] md:gap-2 items-end" : "grid md:grid-cols-[0.5fr_0.25fr_1.1fr_0.15fr] md:gap-2 items-end"
                        return(
                            <div key={item.id} className={classDisabled}>
                                {/* OrderId Field */}
                                <div className="hidden">
                                    <_ZodInput control={form.control} name={`orderProducts[${index}].orderId`} labelName="OrderId" placeholder="Input orderId" disabled={disabled}/>
                                </div>
                                {/* Product Field */}
                                <_ZodSelect control={form.control} name={`orderProducts[${index}].productId`} labelName="Product" placeholder="Select Product" datas={products} form={form} disabled={disabled}/>
                                {/* Qty Field */}
                                <_ZodInput control={form.control} name={`orderProducts[${index}].quantity`} type="number" labelName="Quantity" placeholder="Input quantity" disabled={disabled}/>
                                {/* Note Field */}
                                <_ZodInput control={form.control} name={`orderProducts[${index}].orderNote`} labelName="Note" placeholder="Input note" disabled={disabled}/>
                                {/* Button Remove */}
                                {!disabled && (
                                    <Button type="button"  onClick={() => remove(index)} variant="outline" className="mt-2 mb-4 md:mb-0 outline outline-2 outline-red-600 hover:bg-red-600 hover:text-white">Remove</Button>
                                )}
                            </div>
                        )
                    })}
                </__MyCard>

                <div className="group grid md:grid-cols-4 md:gap-2">
                    {/* Route Field */}
                    <_ZodInput control={form.control} name="route" labelName="Route" placeholder="Input route" disabled={disabled}/>
                    {/*Delivery Order Field*/}
                    <_ZodInput control={form.control} name="orders" type="number" labelName="Delivery order" placeholder="Input orders" disabled={disabled}/>
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
                    <div className="grid grid-cols-2 gap-2">
                        {formType === "create" && <Button type="submit">Create</Button>}
                        {formType === "create" && <Button onClick={() => setAddMore(true)} variant="outline" type="submit">Add More</Button>}
                    </div>

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