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
          <div class="mt-3 flex items-center justify-between gap-3">
            <div class="text-sm text-secondary-text-grey-blue">
               ${movie.release_date}
            </div>
            <!-- more button--!>
              <button
  data-id="${movie.id}"
  class="show-details inline-flex items-center justify-center gap-2 w-22 bg-mint-accent2 text-background-main px-3 py-2 rounded-md font-semibold hover:bg-popcorn-gold-accent1 transition-all shadow-sm hover:shadow-md"
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

////////////////// Delete a movie on click from fav ////////////////////
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

////////////////// Film Details karte open & colse /////////////////////////
const detailsSection = document.querySelector("#movie-details");

// Listener für Mehrere buttons
favoritesContainer.addEventListener("click", (e) => {
  const btn = e.target.closest(".show-details"); // more button
  if (!btn) return;

  const movieId = btn.dataset.id;
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const movie = favorites.find((m) => m.id == movieId);

  if (!movie) return;

  // wenn wir nochmal auf more klicken, schließt die Details Karte
  // Wenn die Karte für denselben Film geöffnet ist → verbergen wir sie nur
  if (
    !detailsSection.classList.contains("hidden") &&
    detailsSection.dataset.id == movieId
  ) {
    detailsSection.classList.add("hidden");
    return;
  }

  // ansonst, Details zum neuen Film zeigen
  detailsSection.dataset.id = movieId;

  //  details card HTML
  const html = `
    <div class="bg-background-cards/70 border border-popcorn-gold-accent1/20 rounded-xl p-8 shadow-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <!-- Linkes Bild -->
        <img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          class="rounded-xl shadow-lg"
        />

        <!-- Recht content -->
        <div class="flex flex-col gap-4">
          <h2 class="text-3xl font-bold">${movie.title}</h2>
          <p class="text-secondary-text-grey-blue text-lg"> ${movie.release_date}</p>

          <p class="text-secondary-text-grey-blue leading-relaxed">
            ${movie.overview}
          </p>

          <!-- Note Input -->
          <textarea
            id="note-input"
            placeholder="Schreiben Sie eine Notiz"
            class="bg-background-main text-main-text-light-grey p-4 rounded-xl border border-secondary-text-grey-blue/30"
          ></textarea>

          <button
            id="add-note"
            data-id="${movie.id}"
            class="self-start px-6 py-2 bg-popcorn-gold-accent1 text-background-main rounded-lg hover:bg-red-coral-accent3 transition-all"
          >
            senden
          </button>
        </div>
      </div>

      <!-- Notes list -->
      <h3 class="text-xl font-bold mt-10 mb-4">Recent Noten</h3>
      <div id="notes-list" class="flex flex-col gap-4"></div>
    </div>
  `;

  detailsSection.innerHTML = html;
  detailsSection.classList.remove("hidden");

  loadNotes(movieId);
});

//////////////////////// notes hochladen /////////////////////////
function loadNotes(movieId) {
  const notes = JSON.parse(localStorage.getItem("notes-" + movieId)) || [];
  const list = document.querySelector("#notes-list");

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

  if (input.value.trim() === "") return;

  const notes = JSON.parse(localStorage.getItem("notes-" + movieId)) || [];
  notes.push(input.value.trim());
  localStorage.setItem("notes-" + movieId, JSON.stringify(notes));

  input.value = "";
  loadNotes(movieId);
});
