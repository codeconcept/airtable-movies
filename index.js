import keys from './keys.js';
const url = `https://api.airtable.com/v0/${keys.db}/Movies`;
const apiKey = keys.apiKey;

function init() {
  getMovies();
}

init();

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
  console.log(movies);
}
