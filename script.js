document.addEventListener("DOMContentLoaded", () => {
  const currencySelect = document.getElementById("currency");
  const refreshBtn = document.getElementById("refreshRate");
  const rateDisplay = document.getElementById("rate");
  const baseCurrencyLabel = document.getElementById("baseCurrency");
  const toggleWidget = document.getElementById("toggleWidget");
  const widget = document.getElementById("exchange-widget");

  // Hide widget by default
  widget.classList.add("hidden");

  // Toggle
  toggleWidget.addEventListener("change", () => {
    widget.classList.toggle("hidden", !toggleWidget.checked);
  });

  async function fetchExchangeRate(currency) {
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${currency}`);
      const data = await res.json();

      if (data.result === "success") {
        const rate = data.rates.VND;
        rateDisplay.textContent = rate.toLocaleString("en-US", { maximumFractionDigits: 0 });
      } else {
        throw new Error("Invalid data");
      }
    } catch (err) {
      rateDisplay.textContent = "Error fetching rate";
    }
  }

  // Fetch default USD
  fetchExchangeRate("USD");

  // Change rate when currency changes
  currencySelect.addEventListener("change", (e) => {
    const selected = e.target.value;
    baseCurrencyLabel.textContent = selected;
    fetchExchangeRate(selected);
  });

  // Refresh
  refreshBtn.addEventListener("click", () => {
    const selected = currencySelect.value;
    baseCurrencyLabel.textContent = selected;
    fetchExchangeRate(selected);
  });

  // Pokemon section
  async function loadPokemon() {
    const pokemonNames = [
      "eevee", "vaporeon", "jolteon", "flareon",
      "espeon", "umbreon", "leafeon", "glaceon", "sylveon"
    ];
    const container = document.getElementById("pokemon-container");
    container.innerHTML = "<p class='text-gray-500'>Loading Pokémon...</p>";

    const typeColors = {
      normal: "#A8A77A", fire: "#EE8130", water: "#6390F0", electric: "#F7D02C",
      grass: "#7AC74C", ice: "#96D9D6", fighting: "#C22E28", poison: "#A33EA1",
      ground: "#E2BF65", flying: "#A98FF3", psychic: "#F95587", bug: "#A6B91A",
      rock: "#B6A136", ghost: "#735797", dragon: "#6F35FC", dark: "#705746",
      steel: "#B7B7CE", fairy: "#D685AD"
    };

    const results = await Promise.all(
      pokemonNames.map(async name => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        return res.json();
      })
    );

    container.innerHTML = results.map(p => {
      const type = p.types[0].type.name;
      const color = typeColors[type] || "#ccc";
      const glowColor = `${color}4D`;

      return `
        <div class="relative group w-48 h-64 rounded-xl overflow-hidden 
                    border backdrop-blur-xl bg-white/15 
                    transition-all duration-500 hover:scale-105"
            style="border: 1.5px solid ${color};
                   box-shadow: 0 6px 25px ${glowColor};">

          <div class="flex flex-col items-center justify-center text-center p-4 h-full relative z-10">

            <!-- Pokemon image -->
            <img src="${p.sprites.front_default}" alt="${p.name}" 
                class="w-28 h-28 mb-2 mt-2 transition-all duration-500 transform 
                        group-hover:scale-115 group-hover:drop-shadow-[0_0_15px_${color}]">

            <!-- Pokémon Name -->
            <h3 class="capitalize font-semibold text-gray-900 text-lg transition-transform duration-300 
                      transform translate-y-8 group-hover:translate-y-1">
              ${p.name}
            </h3>

            <!-- Hidden Info -->
            <div class="text-sm text-gray-800 opacity-0 translate-y-4 
                        group-hover:opacity-100 group-hover:translate-y-0 
                        transition-all duration-500 ease-out delay-100 mt-1">
              <p><strong>Type:</strong> ${p.types.map(t => t.type.name).join(", ")}</p>
              <p><strong>EXP:</strong> ${p.base_experience}</p>
              <p><strong>Height:</strong> ${p.height * 10} cm</p>
              <p><strong>Weight:</strong> ${p.weight / 10} kg</p>
            </div>
          </div>

          <!-- Hover Overlay -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 
                      transition-all duration-500 rounded-xl"></div>
        </div>
      `;
    }).join("");
  }

  loadPokemon();
});

// Toggle mobile menu
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");

menuToggle.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  menu.classList.toggle("show");
});
