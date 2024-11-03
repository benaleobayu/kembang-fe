import { NextRequest, NextResponse } from 'next/server';
import { GET as revalidateToken } from './app/api/auth/revalidate/route';

export async function middleware(request: NextRequest) {
    const cookieName:any = 'accessToken';
    const cookie = request.cookies.get(cookieName);
    const token = cookie ? cookie.value : null;

    const loginUrl = new URL('/cms/auth/login', request.url);
    const dashboardUrl = new URL('/cms/v1/dashboard', request.url); // Adjust this to your main page

    // If there's no token, redirect to login
    if (!token) {
        if (request.nextUrl.pathname === loginUrl.pathname) {
            return NextResponse.next(); // Allow access to the login page
        }
        return NextResponse.redirect(loginUrl);
    }

    // If there's a token and user tries to access the login page, redirect to dashboard
    if (token && request.nextUrl.pathname === loginUrl.pathname) {
        return NextResponse.redirect(dashboardUrl); // Redirect to dashboard or main page
    }

    // Create a new request for revalidation
    const revalidateRequest = new NextRequest(request.url, {
        method: 'GET',
        headers: {
            'Cookie': request.headers.get('cookie'), // Forward the cookies
        },
    });

    try {
        // Call the revalidate-token function directly
        const response = await revalidateToken(revalidateRequest);

        // Check if the revalidation was successful
        if (!response.ok) {
            return NextResponse.redirect(loginUrl);
        }

    } catch (error) {
        console.error("Error during token revalidation:", error);
        return NextResponse.redirect(loginUrl);
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: ['/cms/:path*'],
};
