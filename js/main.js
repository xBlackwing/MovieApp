//Variables
const main = document.querySelector(".main");
const searchbar = document.querySelector(".header__searchbar");

const apiUrl = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1`;
const imgUrl = `https://image.tmdb.org/t/p/w1280`;
const searchUrl = `https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=`;

//Event Listeners
searchbar.addEventListener("input", searchMovies);

//Functions
getMovies(apiUrl);

async function getMovies(api) {
  const response = await fetch(api);
  const responseData = await response.json();
  createMovies(responseData.results);
}

function createMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.className = "card__img";
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

function searchMovies(e) {
  const search = `${searchUrl}${e.target.value}`;
  getMovies(search);
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
