import {NextRequest, NextResponse} from "next/server";
import {getAuthToken} from "@/utils/intercept-token";
import {routesUrl} from "@/components/apps/globals/options/routes";

const apiServer = routesUrl.find(data => data.key === "customerServer")?.url;

export async function POST(req: NextRequest) {
    const token = getAuthToken(req);

    try {
        const {name, phone, address, location, distance, daySubscribed, isSubscribed, isActive} = await req.json();
        const response = await fetch(`${process.env.API_URL}/${apiServer}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name, phone, address, location, distance, daySubscribed, isSubscribed, isActive}),
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