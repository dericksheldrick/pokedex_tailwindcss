document.addEventListener("DOMContentLoaded", () => {
  const pokemonList = document.getElementById("pokemon-list");
  const searchInput = document.getElementById("search");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const modal = document.getElementById("pokemon-modal");
  const closeModalButton = document.getElementById("close-modal");
  const modalContent = document.getElementById("modal-content");

  let currentPage = 1;
  const limit = 20;

  const fetchPokemon = async (page) => {
    const offset = (page - 1) * limit;
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    const data = await response.json();
    displayPokemon(data.results);
    prevButton.disabled = page === 1;
    nextButton.disabled = data.next === null;
  };

  const displayPokemon = (pokemon) => {
    pokemonList.innerHTML = "";
    pokemon.forEach(async (p) => {
      const pokeData = await fetch(p.url).then((res) => res.json());
      const pokemonCard = document.createElement("div");
      pokemonCard.classList.add(
        "bg-white",
        "p-4",
        "rounded-lg",
        "shadow-md",
        "text-center",
        "hover:bg-green-100",
        "cursor-pointer"
      );
      pokemonCard.innerHTML = `
          <img src="${pokeData.sprites.front_default}" alt="${
        pokeData.name
      }" class="w-20 mx-auto">
          <h2 class="text-xl font-bold capitalize text-green-500">${
            pokeData.name
          }</h2>
          <p class="text-green-500">#${pokeData.id} | Type: ${pokeData.types
        .map((type) => type.type.name)
        .join(", ")}</p>
        `;
      pokemonCard.addEventListener("click", () => {
        openModal(pokeData);
      });
      pokemonList.appendChild(pokemonCard);
    });
  };

  const openModal = (pokeData) => {
    modalContent.innerHTML = `
        <img src="${pokeData.sprites.front_default}" alt="${
      pokeData.name
    }" class="w-20 mx-auto">
        <h2 class="text-2xl font-bold capitalize text-green-500 mt-2">${
          pokeData.name
        } (#${pokeData.id})</h2>
        <p class="text-green-500">Type: ${pokeData.types
          .map((type) => type.type.name)
          .join(", ")}</p>
        <p class="text-gray-700 mt-2">Height: ${pokeData.height / 10}m</p>
        <p class="text-gray-700">Weight: ${pokeData.weight / 10}kg</p>
        <p class="text-gray-700">Base Experience: ${
          pokeData.base_experience
        }</p>
        <p class="text-gray-700 mt-2">Abilities: ${pokeData.abilities
          .map((ability) => ability.ability.name)
          .join(", ")}</p>
      `;
    modal.classList.remove("hidden");
  };

  const closeModal = () => {
    modal.classList.add("hidden");
  };

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const allPokemon = document.querySelectorAll("#pokemon-list > div");
    allPokemon.forEach((pokemon) => {
      const name = pokemon.querySelector("h2").textContent.toLowerCase();
      const number = pokemon.querySelector("p").textContent.match(/#(\d+)/)[1];
      if (name.includes(searchTerm) || number.includes(searchTerm)) {
        pokemon.style.display = "block";
      } else {
        pokemon.style.display = "none";
      }
    });
  });

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      fetchPokemon(currentPage);
    }
  });

  nextButton.addEventListener("click", () => {
    currentPage++;
    fetchPokemon(currentPage);
  });

  closeModalButton.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  fetchPokemon(currentPage);
});
