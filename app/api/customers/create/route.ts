import {NextRequest, NextResponse} from "next/server";
import {getAuthToken} from "@/utils/intercept-token";

export async function POST(req: NextRequest) {
    const token = getAuthToken(req);

    try {
        const mainName = "customers";
        const {name, phone, address, location, daySubscribed, isSubscribed, isActive} = await req.json();
        const response = await fetch(`${process.env.API_URL}/${mainName}`, {
            method: 'POST',
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