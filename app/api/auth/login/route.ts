import {NextResponse, NextRequest} from "next/server";

export async function POST(req: NextRequest) {
    try {
        const {email,password} = await req.json();
        const response = await fetch(`${process.env.AUTH_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        });

        if (!response.ok) {
            throw new Error('LOGIN FAILED');
        }
        const data : any = await response.json();

        const token  = data.data.accessToken as string; // Adjust based on your actual response structure
        const code  = data.data.restrict_code as string; // Adjust based on your actual response structure

        const responseJson : any = NextResponse.json(data);

        responseJson.cookies.set('accessToken', token)
        responseJson.cookies.set('code', code)

        return responseJson;
    }catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}