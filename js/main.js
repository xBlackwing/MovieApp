//Variables
const main = document.querySelector(".main");
const headerSearchbar = document.querySelector(".header__searchbar");
const modalBackground = document.querySelector(".modal__background");

const apiMovies = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1`;
const apiSearch = `https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=`;
const imgUrl = `https://image.tmdb.org/t/p/w500`;

//Event Listeners
headerSearchbar.addEventListener("input", searchMovies);
main.addEventListener("click", showModal);

//Functions
createMovies(getData(apiMovies));

async function getData(api) {
  const response = await fetch(api);
  const responseData = await response.json();
  return responseData;
}

async function createMovies(data) {
  const moviesData = await data;
  const movies = moviesData.results;
  main.innerHTML = "";
  //Create a card div for each movie fetched
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.id = `${movie.id}`;
    const img = document.createElement("img");
    img.classList.add("card__img");
    img.setAttribute("alt", "Movie poster");
    if (movie.poster_path) {
      img.src = `${imgUrl}${movie.poster_path}`;
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

function searchMovies(e) {
  const searchUrl = `${apiSearch}${e.target.value}`;
  createMovies(getData(searchUrl));
}

function showModal(e) {
  if (e.target.classList.contains("card")) {
    modalBackground.classList.add("modal__background--active");
    //Select the target img to use instead of fetching the same img again
    const img = e.target.querySelector(".card__img").src;
    const idUrl = `https://api.themoviedb.org/3/movie/${e.target.id}?api_key=04c35731a5ee918f014970082a0088b1`;
    createModal(getData(idUrl), img);
  }
}

async function createModal(data, img) {
  const movie = await data;
  modalBackground.innerHTML = `
  <div class="modal">
    <span class="modal__close">X</span>
    <img class="modal__img" src="${img}" alt="Movie poster" />
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
  modalBackground.addEventListener("click", hideModal);
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

function hideModal(e) {
  if (
    e.target.classList.contains("modal__background--active") ||
    e.target.classList.contains("modal__close")
  ) {
    modalBackground.classList.remove("modal__background--active");
  }
}
