import {NextResponse} from 'next/server';
import {getAuthToken} from "@/utils/intercept-token";
import {routesUrl} from "@/components/apps/globals/options/routes";


const apiServer = routesUrl.find(data => data.key === "productServer")?.url;
const apiRoute = `${process.env.API_URL}${apiServer}`

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

        if (!response.ok){
            throw new Error(`Failed to fetch data url : ${apiUrl}`)
        }

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
        // Parsing FormData dari request
        const formData = await req.formData();

        // Ekstrak parameter
        const name = formData.get("name") as string;
        const price = formData.get("price") as string;
        const description = formData.get("description") as string;
        const categoryId = formData.get("categoryId") as string;
        const isActive = formData.get("isActive") as string;
        const file = formData.get("file") as File;

        // Bangun FormData baru untuk mengirim ke backend
        const backendFormData = new FormData();
        backendFormData.append("name", name);
        backendFormData.append("price", price);
        backendFormData.append("description", description);
        backendFormData.append("categoryId", categoryId);
        backendFormData.append("isActive", isActive);
        if (file instanceof File) {
            backendFormData.append("file", file);
        }

        const response = await fetch(`${apiRoute}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: backendFormData,
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

