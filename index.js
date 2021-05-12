import keys from './keys.js';
import utils from './utils.js';

const url = `https://api.airtable.com/v0/${keys.db}/Movies`;
const apiKey = keys.apiKey;

let formatedMovies = [];
const moviesDiv = document.querySelector('.movies');

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

  formatedMovies = utils.formatData(movies);
  console.log('formatedMovies', formatedMovies);
  displayMovies(formatedMovies);
}

function displayMovies(movies) {
  const cards = movies.map(
    (m) => `<div class="card">${m.title} (${m.year})</div>`
  );
  moviesDiv.innerHTML = `
    <h2>Tous les films</h2>
    ${cards.join('')}
    `;
}
