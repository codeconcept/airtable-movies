import db from './db.js';

let formattedMovies = [];
const moviesDiv = document.querySelector('.movies');
const addMovieForm = document.getElementById('addmovie');

addMovieForm.addEventListener('submit', (e) => {
  e.preventDefault();
  new FormData(addMovieForm);
});

addMovieForm.addEventListener('formdata', async (e) => {
  // https://developer.mozilla.org/fr/docs/Web/API/FormData/FormData
  let data = e.formData;

  // genre requires to use getAll() as select has the multiple attribute
  const newMovie = {
    title: data.get('movietitle'),
    year: Number(data.get('movieyear')),
    genre: data.getAll('moviegenre'),
  };
  console.log(newMovie, data.values());
  const postedMovie = await db.postMovie(newMovie);
  console.log('postMovie() | postedMovie', postedMovie);
  
  // to refresh the displayed movie and see our added movie :)
  formattedMovies = await db.getMovies();
  displayMovies(formattedMovies);
});

async function init() {
  formattedMovies = await db.getMovies();
  displayMovies(formattedMovies);
}

init();

function displayMovies(movies) {
  const cards = movies.map(
    (m) => `<div class="card">${m.title} (${m.year})</div>`
  );
  moviesDiv.innerHTML = `
    <h2>Tous les films</h2>
    ${cards.join('')}
    `;
}

