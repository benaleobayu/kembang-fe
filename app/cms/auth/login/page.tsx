"use client"
import * as React from 'react';
import FormLogin from "@/app/cms/auth/login/form_login";
import axiosInstance from "@/utils/axiosInstance";

type Props = {};
export default function Page(props: Props) {
    const [logo, setLogo] = React.useState("");

    React.useEffect(() => {
        axiosInstance.get('/api/element/logo').then((res) => {
            console.log(res.data.logo);
            setLogo(res.data.logo)
        });
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen bg-purple-300">
            <div className="md:w-[80vw] lg:w-[70vw] h-[80vh] grid grid-cols-2">

                <div className="px-12 py-16 bg-white flex justify-center items-center">
                    <div className=" w-full border">
                        <img src={logo || null} alt="my logo" className=""/>
                        <div className="flex flex-col">
                            <p className="text-4xl font-thin text-purple-500">Hello</p>
                            <p className="text-4xl font-bold text-purple-500">Welcome</p>
                        </div>
                        <FormLogin/>
                    </div>
                </div>
                <div className="bg-blue-200">
                    <img
                        src="/assets/images/login.png"
                        alt="Login"
                        className="object-cover w-full h-full"
                    />
                </div>
            </div>

        </div>
    );
};