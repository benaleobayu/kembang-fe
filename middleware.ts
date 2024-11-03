import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const isLogin = false;
    const loginUrl = new URL('/cms/auth/login', request.url);

    if (!isLogin && request.nextUrl.pathname !== loginUrl.pathname) {
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/cms/:path*'],
};
