import { accessTokenAuth } from "./private.js";

const url = "https://api.themoviedb.org/3/authentication";

const TMDB_ApiV3BaseUrl = "https://api.themoviedb.org/3";
const TMDB_ConfigurationEndpoint = "/configuration";
const TMDB_PopularMoviesEndpoint = "/movie/popular";
const NumberOfPages = "1";
const TMDB_PopMov_options = `?language=en-US&page=${NumberOfPages}`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${accessTokenAuth}`,
  },
};

const movieContainer = document.querySelector(`#movies-container`);
let ImageBaseUrl = "";
const ImageFileSize = "original";

/* # Data we need from TMDB for rendering the movie cards:
 * - id
 * - overview
 * - poster_path
 * - release_date
 * - title
 */
function renderMovieCards(movieData, NumberOfMovies) {
  console.log("bas", ImageBaseUrl);
  movieData.results.forEach((element) => {
    const html = `
        <article
          class="#${
            element.id
          } bg-background-cards/70 rounded-xl overflow-hidden shadow-md border border-popcorn-gold-accent1/10 transition transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg duration-300"
        >
          <!-- Poster -->
          <img src="https://${ImageBaseUrl.slice(7)}${ImageFileSize}${
      element.poster_path
    }" alt="Poster" class="w-full h-64 object-cover" />

          <!-- Content -->
          <div class="p-4 flex flex-col justify-between h-44">
            <div>
              <h2 class="text-lg font-semibold text-popcorn-gold-accent1">
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
               Release: ${element.release_date}
              </div>
              <button
                class="add-fav inline-flex items-center gap-2 bg-popcorn-gold-accent1 text-background-main px-3 py-2 rounded-md font-semibold hover:bg-red-coral-accent3 hover:text-background-main transition-all shadow-sm hover:shadow-md"
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
  });
}

function getTmdbConfig() {
  fetch(TMDB_ApiV3BaseUrl + TMDB_ConfigurationEndpoint, options)
    .then((res) => {
      if (!res.ok) throw new Error("Request Error: Get configuration failed");
      // Or access the JSON data in the response
      return res.json();
    })
    .then((data) => {
      ImageBaseUrl = data.images.base_url;
    })
    .catch((err) => console.error(err));
}

getTmdbConfig();

/* TODO: Use async function */
function getPopularMovies() {
  fetch(
    TMDB_ApiV3BaseUrl + TMDB_PopularMoviesEndpoint + TMDB_PopMov_options,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      renderMovieCards(data);
    })
    .catch((err) => console.error(err));
}

getPopularMovies();
