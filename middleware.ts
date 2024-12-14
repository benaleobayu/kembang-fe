import { NextRequest, NextResponse } from 'next/server';
import { GET as revalidateToken } from './app/api/auth/revalidate/route';

export async function middleware(request: NextRequest) {
    const cookieName = 'accessToken';
    const cookie = request.cookies.get(cookieName);
    const token = cookie ? cookie.value : null;

    const loginUrl = new URL('/cms/auth/login', request.url);
    const dashboardUrl = new URL('/cms/v1/dashboard', request.url);

    if (!token) {
        if (request.nextUrl.pathname === loginUrl.pathname) {
            return NextResponse.next();
        }
        return NextResponse.redirect(loginUrl);
    }

    if (token && request.nextUrl.pathname === loginUrl.pathname) {
        return NextResponse.redirect(dashboardUrl);
    }

    try {
        const apiUrl = `${process.env.AUTH_URL}/auth/revalidate-token?token=${token}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Error body:", errorBody);

            if (response.status === 302 || errorBody.message?.includes('Please re-login your account')) {
                return clearSessionAndRedirect(loginUrl);
            }
        }
    } catch (error) {
        console.error("Error during token revalidation:", error);
        return clearSessionAndRedirect(loginUrl);
    }

    return NextResponse.next();
}

function clearSessionAndRedirect(loginUrl: URL) {
    const response = NextResponse.redirect(loginUrl);

    // Hapus cookie (accessToken)
    response.headers.set('Set-Cookie', [
        `accessToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`, // Hapus token
    ]);

    // Set custom headers untuk menghapus localStorage dan sessionStorage
    response.headers.set('X-Clear-LocalStorage', 'true');
    response.headers.set('X-Clear-SessionStorage', 'true');

    return response;
}

export const config = {
    matcher: ['/cms/:path*'],
};

