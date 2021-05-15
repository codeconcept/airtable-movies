import db from './db.js';

let formattedMovies = [];
const moviesDiv = document.querySelector('.movies');
const addMovieForm = document.getElementById('addmovie');
const exampleTable = document.getElementById('example-table');

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
      createUpdateDialog(row.getData());
    },
  });
  table.setLocale('fr'); //set locale to french
}

function createUpdateDialog(rowData) {
  console.log(rowData);
  const clonedForm = addMovieForm.cloneNode(true);
  console.log(clonedForm);

  // populate with existing data
  clonedForm.querySelector('#movietitle').value = rowData.title;
  clonedForm.querySelector('#movieyear').value = rowData.year;
  // select all options for genre
  clonedForm.querySelector('#moviegenre').value = rowData.genre;
  const allGenres = clonedForm.querySelector('#moviegenre');
  for (let i = 0; i < allGenres.length; i++) {
    allGenres.options[i].selected =
      rowData.genre.indexOf(allGenres.options[i].value) >= 0;
  }
  // clonedForm.querySelector('#addmovie > div:nth-child(4) > button').innerText =
  //   'modifier le film';
  clonedForm.querySelector('.btn').innerText = 'modifier le film';
  clonedForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formElements = clonedForm.elements;
    console.log('submit update', formElements);
    // we cast to an array all options, then filter to keep only the selected one, then map each option to its value
    const allSelectedGenres = [...formElements[2].options]
      .filter((option) => option.selected)
      .map((option) => option.value);
    const movieEdited = {
      id: rowData.id,
      fields: {
        title: formElements[0].value,
        year: Number(formElements[1].value),
        genre: allSelectedGenres,
      },
    };
    console.log('movieEdited', movieEdited);
    const data = await db.updateMovie(movieEdited);
    console.log('data', data);
    if (data.records.length === 1) {
      alertify.alert('Mise à jour effectuée').setHeader('Modification réussie');
    }
  });

  alertify.minimalDialog ||
    alertify.dialog('minimalDialog', function () {
      return {
        main: function (content) {
          this.setContent(content);
        },
        setup: function () {
          return {
            options: {
              maximizable: true,
              closableByDimmer: true,
              resizable: false,
              transition: 'fade',
              /*disable autoReset, to prevent the dialog from resetting it's size on window resize*/
              autoReset: false,
            },
          };
        },
        prepare: function () {
          this.elements.footer.style.visibility = 'hidden';
        },
        hooks: {
          onshow: function () {
            this.elements.dialog.style.maxWidth = 'none';
            this.elements.dialog.style.width = '70%';
          },
        },
      };
    });
  alertify.minimalDialog(clonedForm).setHeader(`Modifier "${rowData.title}"`);
}
