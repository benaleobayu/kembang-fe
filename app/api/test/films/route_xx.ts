// pages/api/films.ts

import type { NextApiRequest, NextApiResponse } from 'next';

const fetchFilms = async () => {
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

    const res = await fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    const data = await res.json();
    return data.data.allFilms.films;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const films = await fetchFilms();
        // Mengurutkan film berdasarkan id secara ascending
        films.sort((a, b) => a.id - b.id);

        // Mengembalikan response dengan data film yang sudah diurutkan
        res.status(200).json(films);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
    }
}
