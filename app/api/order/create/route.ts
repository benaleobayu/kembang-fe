import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/utils/intercept-token';
import { routesUrl } from '@/components/apps/globals/options/routes';

const apiServer = routesUrl.find((data) => data.key === `orderServer`)?.url;
const apiRoute = `${process.env.API_URL}/${apiServer}`;

export async function POST(req: NextRequest) {
    const token = getAuthToken(req);

    try {
        // Baca body sekali dan simpan di variabel
        const body = await req.json();

        // Format tanggal sebelum mengirimkan
        const formattedOrderDate = new Date(body.orderDate).toISOString().split('T')[0];
        const formattedDeliveryDate = new Date(body.deliveryDate).toISOString().split('T')[0];

        const response = await fetch(apiRoute, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...body,
                orderDate: formattedOrderDate,
                deliveryDate: formattedDeliveryDate,
            }),
        });

        const responseText = await response.text();
        if (!response.ok) {
            throw new Error('Failed to create on: ' + apiRoute + ' - ' + responseText);
        }

        const data = JSON.parse(responseText);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: error.message,
        });
    }
}