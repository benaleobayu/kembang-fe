import {NextResponse} from 'next/server';
import {routesUrl} from "@/components/apps/globals/options/routes";

const folderName = __dirname.split('/').pop();
const apiServer = routesUrl.find(data => data.key === `${folderName}Server`)?.url;
console.log("this folderName is : " + folderName)
console.log("this apiServer is : " + apiServer)

export async function GET(request) {

    const query = `
    query {
      allFilms {
        films {
          id
          title
          releaseDate
          episodeID
          director
        }
        totalCount
      }
    }
  `;

    try {
        // Construct the API URL with dynamic query parameters
        const response = await fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({query}),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
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
