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
  const table = new Tabulator('#example-table', {
    height: 220, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: movies, //assign data to table
    layout: 'fitColumns', //fit columns to width of table (optional)
    pagination: 'local',
    paginationSize: 3,
    columns: [
      //Define Table Columns
      { title: 'Titre', field: 'title'},
      { title: 'Année', field: 'year'},
    ],
    rowClick: function (e, row) {
      //trigger an alert message when the row is clicked
      alert('Row ' + row.getData().id + ' Clicked!!!!');
    },
  });
  table.setLocale('fr'); //set locale to french
  console.log(table.getLang());
}
