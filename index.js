import db from './db.js';

let formattedMovies = [];
const moviesDiv = document.querySelector('.movies');
const addMovieForm = document.getElementById('addmovie');
const exampleTable = document.getElementById('example-table')

exampleTable.addEventListener(
  'contextmenu',
  function (e) {
    // alert("You've tried to open context menu"); //here you draw your own menu
    e.preventDefault();
  },
  false
);

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
      { title: 'Titre', field: 'title' },
      { title: 'Année', field: 'year' },
    ],
    rowClick: function (e, row) {
      alertify.confirm(
        `Supprimer "${row.getData().title}" ?`,
        'Cliquer sur "OK" pour confirmer la suppression du film',
        async function () {
          const response = await db.deleteMovie(row.getData().id);
          console.log('alertify delete response', response);
          init();
          alertify.success('Film supprimé');
        },
        function () {
          // alertify.error('Suppression annulée');
        }
      );
    },
    rowContext: function (e, row) {
      // alert('Row ' + row.getIndex() + ' Context Clicked!!!!');
      createUpdateDialog(row.getData())
    },
  });
  table.setLocale('fr'); //set locale to french
}

function createUpdateDialog(rowData) {
  console.log(rowData)
}