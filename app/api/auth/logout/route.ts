import {NextRequest, NextResponse} from 'next/server';
import { getAuthToken } from "@/utils/intercept-token";

export async function GET(req: NextRequest) {
    const token = getAuthToken(req); // Ambil token dari request

    if (!token) {
        return NextResponse.redirect('/cms/auth/login'); // Jika tidak ada token, arahkan ke login
    }

    const deviceId = req.headers.get('deviceId') as string | "undefined";
    const version = '1.0.0';
    console.log('DeviceId:', deviceId, 'Version:', version);

    try {
        // Melakukan request ke server untuk logout
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

        // Jika logout berhasil, hapus cookie accessToken dan arahkan ke login
        const res = NextResponse.redirect('/cms/auth/login');
        res.cookies.set('accessToken', '', { maxAge: 0, path: '/' }); // Hapus cookie accessToken
        return res;

    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}
