import { accessTokenAuth, apiKey } from "./private.js";

const url = "https://api.themoviedb.org/3/authentication";

const TMDB_ApiV3BaseUrl = "https://api.themoviedb.org/3";
const TMDB_ConfigurationEndpoint = "/configuration";
const TMDB_PopularMoviesEndpoint = "/movie/popular";
const NumberOfPages = "1";
const TMDB_PopMov_options = `&language=en-US&page=${NumberOfPages}`;
const MAX_NR_OF_MOVIES = 16;
const QUERY = "?";
const API_KEY = `api_key=${apiKey}`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${accessTokenAuth}`,
  },
};

const movieContainer = document.querySelector(`#movies-container`);
let ImageBaseUrl = "";

/* # Select image size. Options are:
 * "w45", "w92", "w154", "w185" ,"w300", "w500", "original"
 */
const ImageFileSize = "original";

/* # Data we need from TMDB for rendering the movie cards:
 * - id
 * - overview
 * - poster_path
 * - release_date
 * - title
 */
function renderMovieCards(movieData, NumberOfMovies) {
  let index = 0;
  for (const element of movieData.results) {
    if (index++ < MAX_NR_OF_MOVIES) {
      const html = `
        <article
          class="#${
            element.id
          } bg-background-cards/70 rounded-xl overflow-hidden shadow-md border border-popcorn-gold-accent1/10 transition transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg duration-300"
        >
          <!-- Poster -->
          <img src="https://${ImageBaseUrl.slice(7)}${ImageFileSize}${
        element.poster_path
      }" alt="Poster" class="w-full aspect-[2/3] object-cover rounded-t-xl" />

          <!-- Content -->
          <div class="p-4 flex flex-col min-h-[220px]">
            <div class="flex-grow">
              <h2 class="text-lg font-semibold text-popcorn-gold-accent1 line-clamp-2 min-h-[48px]">
                ${element.title}
              </h2>
              <p
                class="mt-1 text-sm text-secondary-text-grey-blue line-clamp-3"
              >
              ${element.overview}
              </p>
            </div>

            <!-- Footer (release + button) -->
            <div class="mt-3 flex items-center justify-between gap-3">
              <div class="text-sm text-secondary-text-grey-blue">
               ${element.release_date}
              </div>
              <button
              data-overview="${element.overview}"
              data-id="${element.id}"
              data-title="${element.title}"
              data-poster_path="${element.poster_path}"
              data-release_date="${element.release_date}"
                class="add-fav inline-flex items-center justify-center gap-2 w-22 bg-popcorn-gold-accent1 text-background-main px-3 py-2 rounded-md font-semibold hover:bg-red-coral-accent3 hover:text-background-main transition-all shadow-sm hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6.42
               3.42 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99
               14.96 5 16.5 5 18.58 5 20 6.42 20 8.5c0 3.78-3.4
               6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
                Add
              </button>
            </div>
          </div>
        </article>`; /* Back ticks, JavaScript Template literals */

      movieContainer.insertAdjacentHTML(`beforeend`, html);
    } else {
      break;
    }
  }
}

function getTmdbConfig() {
  fetch(
    TMDB_ApiV3BaseUrl + TMDB_ConfigurationEndpoint + QUERY + API_KEY
    //options
  )
    .then((res) => {
      if (!res.ok) throw new Error("Request Error: Get configuration failed");
      // Or access the JSON data in the response
      return res.json();
    })
    .then((data) => {
      console.log(data);
      ImageBaseUrl = data.images.base_url;
    })
    .catch((err) => console.error(err));
}

console.lig;
getTmdbConfig();

/* TODO: Use async function */
function getPopularMovies() {
  fetch(
    TMDB_ApiV3BaseUrl +
      TMDB_PopularMoviesEndpoint +
      QUERY +
      API_KEY +
      TMDB_PopMov_options
    // options
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      renderMovieCards(data);
    })
    .catch((err) => console.error(err));
}

getPopularMovies();

// Check if there are already saved favorite movies
if (!localStorage.getItem("favorites")) {
  localStorage.setItem("favorites", JSON.stringify([]));
}

// Function to check if a movie is already in favorites
function isFavorite(id) {
  const storageData = JSON.parse(localStorage.getItem("favorites")) || [];
  return storageData.some((item) => item.id === id);
}

// Function to update buttons after downloading movies
function updateFavoriteButtons() {
  const buttons = document.querySelectorAll(".add-fav");
  buttons.forEach((btn) => {
    const movieId = btn.dataset.id;
    if (isFavorite(movieId)) {
      btn.innerHTML = `Added`;
      btn.classList.add("bg-mint-accent2");
      btn.classList.remove("bg-popcorn-gold-accent1");
    } else {
      btn.innerHTML = `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
          2 6.42 3.42 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87
          C13.46 5.99 14.96 5 16.5 5C18.58 5 20 6.42 20 8.5
          c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      Add`;
      btn.classList.add("bg-popcorn-gold-accent1");
      btn.classList.remove("bg-mint-accent2");
    }
  });
}

// Update the buttons after loading movies (after a short delay)
setTimeout(updateFavoriteButtons, 1000);

// Click listener on movie container
movieContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-fav");
  if (!btn) return;

  const addedFilmData = {
    overview: btn.dataset.overview,
    id: btn.dataset.id,
    title: btn.dataset.title,
    poster_path: btn.dataset.poster_path,
    release_date: btn.dataset.release_date,
  };

  const storageData = JSON.parse(localStorage.getItem("favorites")) || [];
  const alreadyExists = storageData.find(
    (item) => item.id === addedFilmData.id
  );

  // If the movie is already in your favorites, delete it.
  if (alreadyExists) {
    const updatedData = storageData.filter(
      (item) => item.id !== addedFilmData.id
    );
    localStorage.setItem("favorites", JSON.stringify(updatedData));

    // Change the button back to "Add"
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
        2 6.42 3.42 5 5.5 5c1.54 0 3.04.99 3.57 2.36h1.87
        C13.46 5.99 14.96 5 16.5 5C18.58 5 20 6.42 20 8.5
        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
      Add`;
    btn.classList.add("bg-popcorn-gold-accent1");
    btn.classList.remove("bg-mint-accent2");

    console.log(
      `The film "${addedFilmData.title}" has been removed from favorites.`
    );
  } else {
    // Otherwise, add the film to your favorites
    const newStorageData = [...storageData, addedFilmData];
    localStorage.setItem("favorites", JSON.stringify(newStorageData));

    // Change the button to "Added"
    btn.innerHTML = `Added`;
    btn.classList.add("bg-mint-accent2");
    btn.classList.remove("bg-popcorn-gold-accent1");

    console.log(
      `The film "${addedFilmData.title}" has been added to your favorites`
    );
  }
});
