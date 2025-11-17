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

/////////////////abood///////////////////////

const searchInput = document.getElementById("search-input");
const form = document.getElementById("search");

const overlay = document.querySelector("#movie-details-overlay");
const detailsCard = document.querySelector("#movie-details-card");

const TMDB_SeachEndpoint = `/search/movie`;

const searchApi = async function (query) {
  const QUERY = `?query=`;
  const searhcUrl =
    TMDB_ApiV3BaseUrl +
    TMDB_SeachEndpoint +
    QUERY +
    query +
    TMDB_PopMov_options;

  try {
    const res = await fetch(searhcUrl, options);
    if (!res.ok) {
      throw new Error("ma ente Hmar");
    }
    const data = await res.json();
    console.log(data);
    const html = ``;

    let element = data.results;
    console.log(element[0]);
    console.log(element[0].poster_path);

    if (!element[0]) {
      detailsCard.innerHTML = ``;
    }

    movieContainer.innerHTML = "";
    renderMovieCards(data);
    detailsCard.innerHTML = `

      <!-- close Button-->
      <div class="relative">
        <div id="close-btn" class="cursor-pointer transition group absolute top-0 right-0 z-50">
          <svg
            viewBox="0 0 24 24"
              class="w-10 h-10 fill-current text-red-coral-accent3 group-hover:text-[var(--color-popcorn-gold-accent1)] transition  "
              xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.49556 2 2 6.49556 2 12C2 17.5044 6.49556 22 12 22C17.5044 22 22 17.5044 22 12C22 6.49556 17.5044 2 12 2ZM15.9393 15.9393C15.658 16.2206 15.2319 16.2628 14.9393 16.0669L14.8536 15.9999L12 13.1464L9.14645 15.9999C8.85444 16.2919 8.37828 16.2919 8.08622 15.9999C7.80491 15.7186 7.76268 15.2924 7.95859 14.9999L8.02563 14.9142L10.8787 12.0607L8.02563 9.20711C7.74432 8.9258 7.70209 8.49964 7.898 8.20711C8.17931 7.9258 8.60547 7.88357 8.898 8.07948L8.98374 8.14645L12 11.1623L15.0163 8.14645C15.2976 7.86514 15.7238 7.8229 16.0163 8.01882L16.102 8.08579C16.3833 8.3671 16.4256 8.79326 16.2296 9.08579L16.1626 9.17152L13.1464 12.1877L16.1626 15.2039C16.4439 15.4852 16.4862 15.9114 16.2903 16.2039L16.2232 16.2896L15.9393 15.9393Z"/>
          </svg>
      </div>

      <!-- Kart Inhalte in overlaym-->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 pt-14">
          
          <img src="https://image.tmdb.org/t/p/w500${element[0].poster_path}" class="rounded-xl shadow-lg max-h-lg object-cover" />
          
          <div class="flex flex-col gap-4">
            <h2 class="text-3xl font-bold">${element[0].title}</h2>
            <p class="text-secondary-text-grey-blue text-lg">${element[0].release_date}</p>
            <p class="text-secondary-text-grey-blue leading-relaxed">${element[0].overview}</p>

          <!-- Notizen Bereich -->
            <textarea id="note-input"
              class="bg-background-main text-main-text-light-grey p-4 rounded-xl border border-secondary-text-grey-blue/30"
              placeholder="Schreibe eine Notiz..."></textarea>

            <button id="add-note" data-id="${element[0].id}"
              class="self-start px-6 py-2 bg-popcorn-gold-accent1 text-background-main rounded-lg hover:bg-red-coral-accent3 transition-all">
              senden
            </button>
          </div>
        </div>

        <h3 class="text-xl font-bold mt-10 mb-4">Recent Noten</h3>
        <div id="notes-list" class="flex flex-col gap-4"></div>
        </div>

        `;
    overlay.classList.remove("hidden");
    detailsCard.classList.remove("opacity-0", "translate-y-5", "scale-95");

    // Close button (Overlay)
    document.addEventListener("click", (e) => {
      if (e.target.closest("#close-btn")) {
        closeModal();
        return;
      }

      //
      if (e.target.id === "movie-details-overlay") {
        closeModal();
      }
    });
    function closeModal() {
      // Start close animation
      detailsCard.classList.add("opacity-0", "translate-y-5", "scale-95");

      // Wait for animation to finish
      setTimeout(() => {
        overlay.classList.add("hidden");
      }, 400);
    }
  } catch (err) {
    console.log(err);
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  console.log(query);
  searchApi(query);
});

////////////////////////////////////////////////////////

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
