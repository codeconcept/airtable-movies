import keys from './keys.js';
import utils from './utils.js';

const url = `https://api.airtable.com/v0/${keys.db}/Movies`;
const apiKey = keys.apiKey;

let formatedMovies = [];
const moviesDiv = document.querySelector('.movies');
const addMovieForm = document.getElementById('addmovie');

addMovieForm.addEventListener('submit', (e) => {
  e.preventDefault();
  new FormData(addMovieForm);
});

addMovieForm.addEventListener('formdata', (e) => {
  // https://developer.mozilla.org/fr/docs/Web/API/FormData/FormData
  let data = e.formData;

  // genre requires to use getAll() as select has the multiple attribute
  const newMovie = {
    title: data.get('movietitle'),
    year: Number(data.get('movieyear')),
    genre: data.getAll('moviegenre'),
  };
  console.log(newMovie, data.values());
  postMovie(newMovie);
});

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
  console.log('postMovie()', data);
  // to refresh the displayed movie and see our added movie :)
  getMovies();
}
