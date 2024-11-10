import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const cookieName: any = 'accessToken';
    const cookie = req.cookies.get(cookieName);
    const token = cookie ? cookie.value : null; // Get the token disabled

    const apiUrl = `${process.env.AUTH_URL}/auth/revalidate-token?token=${token}`;

    // Log the token for debugging (remove in production)
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
            }
        });

        if (!response.ok) {
            throw new Error('REVALIDATE FAILED');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error:", error); // Log the error for debugging
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
