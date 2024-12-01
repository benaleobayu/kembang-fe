import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const cookieName = 'accessToken';
    const cookie = req.cookies.get(cookieName);
    const token = cookie ? cookie.value : null;

    const apiUrl = `${process.env.AUTH_URL}/auth/revalidate-token?token=${token}`;

    console.log("Token:", token);
    console.log("url:", apiUrl);

    try {
        if (!token) {
            return NextResponse.json({
                status: 401,
                message: 'Unauthorized: No token provided',
            });
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Response Status:', response.status);

        if (!response.ok || response.status === 302) {
            // Tangani secara eksplisit untuk status 302
            const errorBody = response.body ? await response.json() : { message: 'Unknown error' };
            console.error("Error body:", errorBody);
            throw new Error(`Failed to revalidate token: ${errorBody.message || 'Unknown error'}`);
        }

        const data = await response.json();
        console.log(data);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Catch block Error:", error.message || error);
        return NextResponse.json({
            status: 500,
            message: error.message || 'Internal Server Error',
        });
    }
}
