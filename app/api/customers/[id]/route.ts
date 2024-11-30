import { NextResponse } from 'next/server';
import {getAuthToken} from "@/utils/intercept-token";
import axios from "axios";

const mainName = "customers"
const apiRoute = `${process.env.API_URL}/${mainName}`
export async function GET(request: Request, {params}: { params: { id: string } }) {
    const token = getAuthToken(request);
    const {id} = params
    try {
        // Construct the API URL with dynamic query parameters
        const apiUrl = `${apiRoute}/${id}`;

        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            status: error.status.code(),
            message: error.message,
        }).status(error.status.code());
    }
}



export async function PUT(req: Request, {params}: { params: { id: string } }) {
    const token = getAuthToken(req);
    const {id} = params
    try {
        const {name, phone, address, location, daySubscribed, isSubscribed, isActive} = await req.json();
        const response = await fetch(`${apiRoute}/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name, phone, address, location, daySubscribed, isSubscribed, isActive}),
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}

export async function DELETE(req: Request, {params}: { params: { id: string } }) {
    const token = getAuthToken(req);
    const {id} = params
    try {
        const response = await fetch(`${apiRoute}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}

