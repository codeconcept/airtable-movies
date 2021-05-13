import keys from './keys.js';
import utils from './utils.js';

const url = `https://api.airtable.com/v0/${keys.db}/Movies?sort[0][field]=year&sort[0][direction]=desc`;
const baseUrl = `https://api.airtable.com/v0/${keys.db}/Movies`;
const apiKey = keys.apiKey;

async function getMovies() {
  const response = await fetch(`${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
  });
  const data = await response.json();
  const movies = data.records;

  const formattedMovies = utils.formatData(movies);
  console.log('formattedMovies', formattedMovies);
  return formattedMovies;
}

async function postMovie(movie) {
  const payload = {
    records: [
      {
        fields: movie,
      },
    ],
  };
  const response = await fetch(`${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
}

async function deleteMovie(movieId) {
  const response = await fetch(`${baseUrl}/${movieId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  // data should look like {deleted: true, id: "recQQ8ejKEJ76Co1f"}
  const data = await response.json();
  return data;
}

export default {
  getMovies,
  postMovie,
  deleteMovie,
};
