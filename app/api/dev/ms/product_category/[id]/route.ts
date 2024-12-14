import {NextResponse} from 'next/server';
import {getAuthToken} from "@/utils/intercept-token";


const mainName = "product_category"
const apiRoute = `${process.env.API_URL}/ms/${mainName}`

export async function GET(request: Request, {params}: { params: { id: string } }) {
    const token = getAuthToken(request);
    const {id} = params
    try {
        // Construct the API URL with dynamic query parameters
        const apiUrl = `${apiRoute}/${id}`;
        console.log(apiUrl)
        const response = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error)
        return NextResponse.json({
            status: error.status.code(),
            message: error.message,
        }).status(error.status.code());
    }
}


export async function PUT(req: Request, {params}: { params: { id: string } }) {
    const token = getAuthToken(req);
    const {id} = params
    try {
        const {name, province, orders, status} = await req.json();
        const response = await fetch(`${apiRoute}/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name, province, orders, status}),
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

export async function DELETE(req: Request, {params}: { params: { id: string } }) {
    const token = getAuthToken(req);
    const {id} = params
    try {
        const response = await fetch(`${apiRoute}/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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

