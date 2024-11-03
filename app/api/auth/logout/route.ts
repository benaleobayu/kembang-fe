import {NextResponse, NextRequest} from "next/server";

export async function GET(req: NextRequest){
    const cookieName: any = 'accessToken';
    const cookie = req.cookies.get(cookieName);
    const token = cookie ? cookie.value : null;

    const deviceId = req.headers.get('deviceId') as string | "undefined";
    const version = '1.0.0'
    console.log(deviceId , version)

    try {
        const response = await fetch(`${process.env.AUTH_URL}/auth/logout?deviceId=${deviceId}&version=${version}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('LOGOUT FAILED');
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