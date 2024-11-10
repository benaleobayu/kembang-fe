import { NextResponse } from 'next/server';
import {getAuthToken} from "@/utils/intercept-token";

export async function GET(request: Request, {params}: { params: { id: string } }) {
    const token = getAuthToken(request);
    const {id} = params
    try {
        // Construct the API URL with dynamic query parameters
        const apiUrl = `${process.env.API_URL}/ms/location/${id}`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
