"use client"

import {toast} from "sonner"
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import axios from "axios";
import {redirect, useRouter} from "next/navigation";

const FormSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).email(),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    })
})

// noinspection TypeScriptUnresolvedReference
export default function FormLogin(props: Props) {

    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("Submitting Data: ", data); // Log the data
        axios.post('/api/auth/login', data)
            .then((response) => {
                console.log("Response Data:", response.data);
                if (response.data.success) { // Adjust according to your API response structure
                    // localStorage.setItem('accessToken', response.data.data.accessToken);
                    // sessionStorage.setItem('accessToken', response.data.data.accessToken);
                    toast.success("Login Success");
                    router.push('/cms/v1/dashboard')
                } else {
                    toast.error("Login Failed"); // Handle failure based on API response
                }
            })
            .catch((error) => {
                console.error("Error Response:", error.response); // Log the error response
                toast.error("Login Failed");
            });
    }


    // noinspection TypeScriptValidateTypes
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-3">
                <FormField
                    control={form.control}
                    name="email"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="********" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
