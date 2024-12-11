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
import {routesUrl} from "@/components/apps/globals/options/routes";
import _ZodInputArea from "@/components/apps/globals/elements/form/zod-input-area";
import _ZodInputImage from "@/components/apps/globals/elements/form/zod-input-image";
import {SelectOptions} from "@/types/SelectOptions";

// Zod validation schema
const FormSchema = z.object({
    file: z.instanceof(File).nullable().optional(),
    code: z.string().min(1, {
        message: "Code is required.",
    }),
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    description: z.string().nullable(),
    categoryId: z.string().min(1, {
        message: "Category is required.",
    }),
    price: z.number().nullable(),
    isActive: z.boolean(),
});

type FormType = {
    formType?: "create" | "update" | "read";
    edit?: boolean;
};

const apiRoute = routesUrl.find(data => data.key === "productApi")?.url;
const urlRoute = routesUrl.find(data => data.key === "product")?.url;
const mainName = "Product";

export default function ProductForm({formType = "create", id}: FormType) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isEditable, setIsEditable] = useState(formType === "create");
    const [categories, setCategories] = useState<SelectOptions>([]);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [addMore, setAddMore] = useState(false);

    const router = useRouter();
    const url = new URL(window.location.href);
    const editParam = url.searchParams.get("edit") === "true";

    const isReadOrUpdate = formType === "read" || formType === "update" || editParam;
    const isCreateOrUpdate = formType === "create" || formType === "update" || editParam;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            file: null,
            code: "",
            name: "",
            description: "",
            categoryId: "",
            price: 0,
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

    useEffect(() => {
        const fetchCategories = async () => {
            const apiRouteCategory = routesUrl.find(data => data.key === "productCategoryApi")?.url;
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${apiRouteCategory}?limit=1000`);
                const mapResponse = response.data.data.result;

                // Map to LocationOptions interface
                const dataOptions: SelectOptions[] = mapResponse.map((data: any) => ({
                    label: data.name,
                    value: data.id,
                }));

                setCategories(dataOptions);

            } catch (e) {
                console.error("Error Response:", e.response);
                toast.error(`Failed to fetch category data.`);
                setError(e.response?.data?.message || "An error occurred");
            } finally {
                setLoading(false);
            }

        };

        fetchCategories();
    }, []);

    // Update form default values when `data` changes
    useEffect(() => {
        if (data && isReadOrUpdate) {
            reset({
                file: null,
                name: data.name || "",
                code: data.code || "",
                description: data.description || "",
                categoryId: data.category || "",
                price: data.price || "",
                isActive: data.isActive || true,
            });
            setCurrentImage(data.image)
        }
    }, [data, isReadOrUpdate, reset]);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    // Submit handler
    async function onSubmit(formData: z.infer<typeof FormSchema>) {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("code", formData.code);
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("categoryId", formData.categoryId);
            formDataToSend.append("price", formData.price?.toString());
            formDataToSend.append("isActive", formData.isActive.toString());

            // Pastikan hanya menambahkan file jika ada
            if (formData.file && formData.file instanceof File) {
                formDataToSend.append("file", formData.file);
            }

            if (formType === "create") {
                const response = await fetch(`${apiRoute}/create`, {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (response.status === 200) {
                    toast.success(`${mainName} created successfully!`);
                    reset();
                    if (addMore) {
                        router.push(urlRoute + "/create");
                    } else {
                        router.push(urlRoute);
                    }
                } else {
                    toast.error(`Failed to create ${mainName.toLowerCase()}.`);
                }
            } else if (isReadOrUpdate) {
                const idFromPath = window.location.pathname.split("/").at(-1);
                const response = await axios.put(`${apiRoute}/${id || idFromPath}`, formDataToSend);
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
                <div className="group grid md:grid-cols-2 grid-cols-1 gap-2">
                    {/* Code Field */}
                    <_ZodInput control={form.control} name="code" labelName="Code" placeholder="Input code" disabled={disabled}/>
                    {/* Name Field */}
                    <_ZodInput control={form.control} name="name" labelName="Name" placeholder="Input name" disabled={disabled}/>
                    {/* Price Field */}
                    <_ZodInput control={form.control} name="price" type="number" labelName="Price" placeholder="Input price" disabled={disabled}/>
                    {/* Category Field */}
                    <_ZodSelect control={form.control} name={"categoryId"} labelName={"Category"} placeholder={"Select Category"} datas={categories} form={form} disabled={disabled}/>
                </div>

                {/* Image Field */}
                <_ZodInputImage control={form.control} name="file" currentImage={currentImage} labelName="Image" placeholder="Input file" disabled={disabled}/>

                {/* Description Field */}
                <_ZodInputArea control={form.control} name="description" labelName="Description" placeholder="Input description here" disabled={disabled}/>

                {/* Active Status Field */}
                <_ZodBooleanSelectActive control={form.control} name="isActive" labelName="Active Status" disabled={disabled}/>

                {/* Submit Button */}
                <div className="flex justify-between items-center">
                    <Button onClick={() => handleBack()} type="button" variant="outline">
                        Back
                    </Button>
                    <div>
                        {formType === "create" && <Button type="submit">Create</Button>}
                        {formType === "create" && <Button onClick={() => setAddMore(true)} variant={"outline"} type="submit">Add more</Button>}
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