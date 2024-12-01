import {NextRequest, NextResponse} from 'next/server';

export async function GET(req: NextRequest) {
    return NextResponse.json({
        logo: process.env.PATH_LOGO,
    });
}