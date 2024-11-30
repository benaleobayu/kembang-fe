import { NextResponse } from 'next/server';
import {getAuthToken} from "@/utils/intercept-token";

export async function GET(request) {
    const token = getAuthToken(request);
    try {

        const url = new URL(request.url);
        const pages = url.searchParams.get('pages') || 0;  // Default to 0 if no page param
        const limit = url.searchParams.get('limit') || 10;  // Default to 10 if no limit param
        const sortBy = url.searchParams.get('sortBy') || 'name';  // Default to 'updatedAt'
        const direction = url.searchParams.get('direction') || 'asc';  // Default to 'asc'
        const keyword = url.searchParams.get('keyword') || '';

        // Construct the API URL with dynamic query parameters
        const apiUrl = `${process.env.API_URL}/ms/product_category?pages=${pages}&limit=${limit}&sortBy=${sortBy}&direction=${direction}&keyword=${keyword}`;

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
