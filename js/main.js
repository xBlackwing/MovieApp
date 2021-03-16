//Variables
const main = document.querySelector(".main");
const headerSearchbar = document.querySelector(".header__searchbar");
const modalBackground = document.querySelector(".modal__background");

const apiMovies = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1`;
const apiSearch = `https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=`;
const urlImg = `https://image.tmdb.org/t/p/w500`;

//Event Listeners
headerSearchbar.addEventListener("input", searchMovies);
main.addEventListener("click", showModal);

//Functions

createMovies(getMovies(apiMovies));

async function getMovies(api) {
  const response = await fetch(api);
  const responseData = await response.json();
  return responseData;
}

async function createMovies(results) {
  const result = await results;
  const movies = result.results;
  main.innerHTML = "";
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "card";
    card.id = `${movie.id}`;
    const img = document.createElement("img");
    img.className = "card__img";
    if (movie.poster_path) {
      img.src = `${urlImg}${movie.poster_path}`;
    } else {
      img.src = "img/placeholder_poster.png";
    }
    card.innerHTML = `
    <div class="card__info">
      <h1 class="card__title">${movie.title}</h1>
      <div class="card__rating ${ratingColor(movie.vote_average)}">
      ${movie.vote_average.toFixed(1)}
      </div>
    </div>`;
    card.prepend(img);
    main.append(card);
  });
}

function ratingColor(rating) {
  if (rating >= 7) {
    return "card__rating--green";
  } else if (rating >= 5) {
    return "card__rating--orange";
  } else {
    return "card__rating--red";
  }
}

async function createModal(results, img) {
  const movie = await results;
  modalBackground.innerHTML = `
  <div class="modal">
    <img src="${img}" class="modal__img" />
    <div class="modal__info">
      <h1 class="modal__title">${movie.title}</h1>
      <p class="modal__genre">${getGenres(movie.genres)}</p>
      <p class="modal__desc">${movie.overview}</p>
      <p class="modal__release">
        <strong>Release date: </strong>
        ${movie.release_date}
      </p>
      <p class="modal__duration">
        <strong>Duration: </strong>
        ${movie.runtime} min
      </p>
    </div>
  </div>`;
}

function searchMovies(e) {
  const search = `${apiSearch}${e.target.value}`;
  createMovies(getMovies(search));
}

function getGenres(genres) {
  genresList = "";
  for (let i = 0; i < genres.length && i < 3; i++) {
    if (i === 0) {
      genresList += `${genres[i].name}`;
    } else {
      genresList += ` / ${genres[i].name}`;
    }
  }
  return genresList;
}

function showModal(e) {
  if (e.target.classList.contains("card")) {
    modalBackground.classList.add("modal__background--active");
    const img = e.target.querySelector(".card__img").src;
    const id = `http://api.themoviedb.org/3/movie/${e.target.id}?api_key=04c35731a5ee918f014970082a0088b1`;
    createModal(getMovies(id), img);
  }
}
