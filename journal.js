const favoritesContainer = document.querySelector("#movies-container");

//////////// Downloading selected movies from localStorage //////////
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
        class="movie-card bg-background-cards/70 rounded-xl overflow-hidden shadow-md border border-popcorn-gold-accent1/10 transition transform hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg duration-300"
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

          <!-- Footer Buttons  -->
          <div class="mt-3 flex items-center justify-between ">
            <div class="text-sm text-secondary-text-grey-blue">
               ${movie.release_date}
            </div>
            <!-- more button-->
            <div class="flex gap-3 ml-auto">
              <button
                 data-id="${movie.id}"
                  class="show-details  inline-flex items-center justify-center gap-2 w-22 bg-mint-accent2 text-background-main px-3 py-2 rounded-md font-semibold hover:bg-popcorn-gold-accent1 transition-all shadow-sm hover:shadow-md"
                    >
                        more
              </button>
              <button
                data-id="${movie.id}"
                class="remove-fav inline-flex items-center justify-center gap-2 w-22 bg-red-coral-accent3 text-background-main px-3 py-2 rounded-md font-semibold hover:bg-popcorn-gold-accent1 hover:text-background-main transition-all shadow-sm hover:shadow-md"
                >
                Remove
              </button>
            </div>
          </div>

           <!-- Hidden Details Box -->
      <div class="details hidden mt-4 p-4 bg-background-cards rounded-lg border border-popcorn-gold-accent1/20">
        
        <p class="text-sm text-secondary-text-grey-blue mb-2">
          <span class="font-bold">Release:</span> ${movie.release_date}
        </p>

        <p class="text-sm text-secondary-text-grey-blue mb-4">
          ${movie.overview}
        </p>

        <!-- Note Input -->
        <textarea
          class="note-input w-full bg-background-main text-main-text-light-grey p-3 rounded-lg border border-secondary-text-grey-blue/30"
          placeholder="Schreibe eine Notiz..."
        ></textarea>

        <button
          class="save-note mt-2 px-4 py-2 bg-popcorn-gold-accent1 text-background-main rounded-lg"
          data-id="${movie.id}"
        >
          Senden
        </button>

        <!-- Notes list -->
        <div class="notes-list mt-4 space-y-2"></div>

      </div>

        </div>
      </article>
    `;

    favoritesContainer.insertAdjacentHTML("beforeend", html);
  });
}

////////////////// Remove Favorite ////////////////////
favoritesContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-fav");
  if (!btn) return;

  const movieId = btn.dataset.id;
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter((fav) => fav.id !== movieId);
  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Also remove any open details placeholder if it belongs to that movie
  const detailsSection = document.querySelector("#movie-details");
  if (detailsSection && detailsSection.dataset.id == movieId) {
    const parent = detailsSection.parentElement;
    if (parent && parent.classList.contains("details-placeholder"))
      parent.remove();
    detailsSection.classList.add("hidden");
    detailsSection.dataset.id = "";
  }

  // Redrawing the list
  loadFavorites();
});

// Loading favorites when opening a page
loadFavorites();

////////////////// Film Details —— move details card below clicked movie /////////////////////////

const overlay = document.querySelector("#movie-details-overlay");
const detailsCard = document.querySelector("#movie-details-card");

favoritesContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".show-details");
  if (!btn) return;

  const movieId = btn.dataset.id;
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const movie = favorites.find((m) => m.id == movieId);
  if (!movie) return;

  // Build movie card
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
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 pt-14">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="rounded-xl shadow-lg" />

      <div class="flex flex-col gap-4">
        <h2 class="text-3xl font-bold">${movie.title}</h2>
        <p class="text-secondary-text-grey-blue text-lg">${movie.release_date}</p>
        <p class="text-secondary-text-grey-blue leading-relaxed">${movie.overview}</p>

      <!-- Notizen Bereich -->
        <textarea id="note-input"
          class="bg-background-main text-main-text-light-grey p-4 rounded-xl border border-secondary-text-grey-blue/30"
          placeholder="Schreibe eine Notiz..."></textarea>

        <button id="add-note" data-id="${movie.id}"
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
  // transition
  setTimeout(() => {
    detailsCard.classList.remove("opacity-0", "translate-y-5", "scale-95");
  }, 20);
  loadNotes(movieId);
});

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

//////////////////////// notes hochladen /////////////////////////
function loadNotes(movieId) {
  const notes = JSON.parse(localStorage.getItem("notes-" + movieId)) || [];
  const list = document.querySelector("#notes-list");

  if (!list) return;
  list.innerHTML = notes
    .map(
      (n) => `
      <div class="bg-background-cards p-4 rounded-lg border border-secondary-text-grey-blue/20">
        ${n}
      </div>`
    )
    .join("");
}

// Save new note
document.addEventListener("click", (e) => {
  if (!e.target.matches("#add-note")) return;

  const movieId = e.target.dataset.id;
  const input = document.querySelector("#note-input");

  if (!input || input.value.trim() === "") return;

  const notes = JSON.parse(localStorage.getItem("notes-" + movieId)) || [];
  notes.push(input.value.trim());
  localStorage.setItem("notes-" + movieId, JSON.stringify(notes));

  input.value = "";
  loadNotes(movieId);
});
