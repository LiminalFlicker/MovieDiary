import { accessTokenAuth } from "./private.js";

const url = "https://api.themoviedb.org/3/authentication";

const TMDB_ApiV3BaseUrl = "https://api.themoviedb.org/3";
const TMDB_ConfigurationEndpoint = "/configuration";
const TMDB_PopularMoviesEndpoint = "/movie/popular";
const TMDB_PopMov_options = "?language=en-US&page=1";

const imageConfiguration = {};

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${accessTokenAuth}`,
  },
};

function getTmdbConfig() {
  fetch(TMDB_ApiV3BaseUrl + TMDB_ConfigurationEndpoint, options)
    .then((res) => {
      if (!res.ok) throw new Error("Request Error: Get configuration failed");
      // Or access the JSON data in the response
      return res.json();
    })
    .then((data) => {
      imageConfiguration.imgBaseUrl = data.images.base_url;
      imageConfiguration.poster_sizes = data.images.poster_sizes;
    })
    .catch((err) => console.error(err));
}

getTmdbConfig();
console.log(imageConfiguration);

// reader = new FileReader();

/* TODO: Use async function */
function getPopularMovies() {
  fetch(
    TMDB_ApiV3BaseUrl + TMDB_PopularMoviesEndpoint + TMDB_PopMov_options,
    options
  )
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
}

getPopularMovies();
