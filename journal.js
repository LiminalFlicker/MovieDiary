const favoritesContainer = document.querySelector("#movies-container");

// Downloading selected movies from localStorage
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // If there is nothing, we show a message
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `
      <div class="col-span-full flex justify-center items-center py-10">
        <p class="text-secondary-text-grey-blue text-lg text-center">
           You haven’t added any favorite movies yet 🎬
        </p>
      </div>
    `;
    return;
  }

  // Cleaning the container
  favoritesContainer.innerHTML = "";

  // Render each card
  favorites.forEach((movie) => {
    const html = `
      <article
        class="bg-background-cards/70 rounded-xl overflow-hidden shadow-md border border-popcorn-gold-accent1/10 transition transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg duration-300"
      >
        <!-- Poster -->
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
             alt="${movie.title}"
             class="w-full aspect-[2/3] object-cover rounded-t-xl" />

        <!-- Content -->
        <div class="p-4 flex flex-col min-h-[220px]">
          <div class="flex-grow">
            <h2 class="text-lg font-semibold text-popcorn-gold-accent1 line-clamp-2 min-h-[48px]">${movie.title}</h2>
            <p class="mt-1 text-sm text-secondary-text-grey-blue line-clamp-3">${movie.overview}</p>
          </div>

          <!-- Footer -->
          <div class="mt-3 flex items-center justify-between gap-3">
            <div class="text-sm text-secondary-text-grey-blue">
              Release: ${movie.release_date}
            </div>
            <button
              data-id="${movie.id}"
              class="remove-fav inline-flex items-center justify-center gap-2 w-22 bg-red-coral-accent3 text-background-main px-3 py-2 rounded-md font-semibold hover:bg-popcorn-gold-accent1 hover:text-background-main transition-all shadow-sm hover:shadow-md"
            >
              Remove
            </button>
          </div>
        </div>
      </article>
    `;

    favoritesContainer.insertAdjacentHTML("beforeend", html);
  });
}

// Delete a movie on click
favoritesContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-fav");
  if (!btn) return;

  const movieId = btn.dataset.id;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((fav) => fav.id !== movieId);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Redrawing the list
  loadFavorites();
});

// Loading favorites when opening a page
loadFavorites();
