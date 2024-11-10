import {NextRequest, NextResponse} from "next/server";
import {getAuthToken} from "@/utils/intercept-token";

export async function POST(req: NextRequest) {
    const token = getAuthToken(req);

    try {
        const {name, province, orders, status} = await req.json();
        const response = await fetch(`${process.env.API_URL}/ms/location`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name, province, orders, status}),
        });

        if (!response.ok) {
            throw new Error('Failed to create');
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