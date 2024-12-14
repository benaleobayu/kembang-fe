import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/utils/intercept-token';
import { routesUrl } from '@/components/apps/globals/options/routes';

const folderName = __dirname.split('/').pop();
const apiServer = routesUrl.find(data => data.key === `${folderName}Server`)?.url;
const apiRoute = `${process.env.API_URL}/${apiServer}`;
console.log("this apiServer is : " + apiServer)

export async function POST(req: NextRequest) {
    const token = getAuthToken(req);

    try {
        const body = await req.json();

        const formattedDate = new Date(body.date).toISOString().split('T')[0];

        const response = await fetch(apiRoute, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...body,
                date: formattedDate,
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