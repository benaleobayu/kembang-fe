import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/utils/intercept-token";
import { routesUrl } from "@/components/apps/globals/options/routes";

const apiServer = routesUrl.find(data => data.key === "productServer")?.url;

export async function POST(req: NextRequest) {
    const token = getAuthToken(req);

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

        const response = await fetch(`${process.env.API_URL}/${apiServer}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: backendFormData, // Mengirim semua data sebagai multipart/form-data
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}