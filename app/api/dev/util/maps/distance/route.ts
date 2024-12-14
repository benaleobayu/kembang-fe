import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        // Ambil origin dari environment variable
        const origin = process.env.NEXT_ORIGIN_LOCATION;
        const urlParams = new URL(req.url).searchParams;
        const destination = urlParams.get('destination');

        // Periksa apakah origin dan destination ada
        if (!origin || !destination) {
            return NextResponse.json({ error: 'Origin and destination are required' }, { status: 400 });
        }

        // API Key dari environment variable
        const apiKey = process.env.NEXT_MAPS_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Google Maps API key is missing' }, { status: 500 });
        }

        // Encoding origin dan destination
        const originEncoded = encodeURIComponent(origin);
        const destinationEncoded = encodeURIComponent(destination);

        // Membuat URL untuk request ke Google Distance Matrix API
        const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${originEncoded}&destinations=${destinationEncoded}&key=${apiKey}`;

        console.log('Request URL:', url); // Debugging URL yang terbentuk

        // Lakukan request ke Google Maps API
        const response = await fetch(url);

        // Periksa jika response sukses
        if (response.ok) {
            const data = await response.json();

            // Periksa apakah data yang diterima valid
            if (data.status === 'OK' && data.rows && data.rows[0].elements[0].distance) {
                const distanceText = data.rows[0].elements[0].distance.text;
                const distanceValue = data.rows[0].elements[0].distance.value; // dalam meter

                // Kembalikan response dengan jarak
                return NextResponse.json({
                    distanceText,
                    distanceValue,
                });
            } else {
                console.error('Google Maps API Response Error:', data);
                return NextResponse.json({ error: 'No valid distance data available from Google Maps API', details: data }, { status: 400 });
            }
        } else {
            const errorData = await response.json();
            console.error('Error from Google Maps API:', errorData);
            return NextResponse.json({ error: 'Failed to fetch distance from Google Maps API', details: errorData }, { status: 400 });
        }
    } catch (error) {
        console.error('Error fetching distance:', error);
        return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
    }
}
