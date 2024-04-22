<template>
  <div class="forms">
    <div class="search-form">
      <form class="search-button">
        <label hidden for="searchPokemonField" class="form-label"
          >Search</label
        >
        <input
          v-model="searchQuery"
          type="text"
          id="searchPokemonField"
          :placeholder="$t('search.placeholder')"
        />
      </form>
    </div>
    <div class="languages">
      <span @click="setLocale('pt_br')">PT</span>
      <span> | </span>
      <span @click="setLocale('en')">EN</span>
      <span> | </span>
      <span @click="setLocale('es')">ES</span>
    </div>
  </div>

  <main class="content">
    <div class="block">
      <ul id="array">
        <li
          class="pokemon"
          v-for="pokemon in pokemonsFiltered"
          :key="pokemon.name"
          @click="show_pokemon(get_id(pokemon))"
        >
          <div class="itens">
            <h2 class="id">{{ get_id(pokemon) }}</h2>

            <div class="species" v-if="pokemon.species">
              <div
                class="species-item"
                v-for="(species, index) in pokemon.species"
                :key="index"
              >
                {{ species.name }}
              </div>
            </div>
          </div>
          <img
            :src="get_svg(pokemon)"
            :alt="pokemon.name"
            width="50%"
            height="150vw"
          />
          <div class="container-type">
            <div class="types" v-if="pokemon.types">
              {{ $t('typetitle.type') }}:
              <div
                class="type-item"
                v-for="(type, index) in pokemon.types"
                :key="index"
              >
                {{ type.type.name }}
              </div>
            </div>
          </div>
          <h2 class="name">{{ get_name(pokemon) }}</h2>
        </li>
      </ul>
      <div class="list-group-wrapper">
        <transition name="fade">
          <div class="loading" v-show="loading">
            <span class="fa fa-spinner fa-spin"></span>
            Loading
          </div>
        </transition>
      </div>
    </div>
  </main>

  <div v-if="popupVisible && selectedPokemon !== null" class="popup">
    <div></div>
    <div class="popup-content">
      <div class="button">
        <h2 class="card-name">{{ $t('pokecardname.name') }}: {{ selectedPokemon.name }}</h2>
        <button class="popup-button" @click="closePopup">X</button>
      </div>
      <li class="sprites">
        <h2 class="sprites-name">Sprites:</h2>
        <img
          :src="selectedPokemon.sprites.front_default"
          :alt="selectedPokemon.name"
        />
        <img
          :src="selectedPokemon.sprites.back_default"
          :alt="selectedPokemon.name"
        />
        <img
          :src="selectedPokemon.sprites.front_shiny"
          :alt="selectedPokemon.name"
        />
        <img
          :src="selectedPokemon.sprites.back_shiny"
          :alt="selectedPokemon.name"
        />
      </li>
      <div class="evolution-session">
        <h3 class="evolution-name">{{ $t('pokecardevolutions.evolutions') }}:</h3>
        <ul class="evolution">
          <li
            class="evolution-items"
            v-for="evolution in selectedPokemon.evolutions"
            :key="evolution.name"
          >
            {{ evolution.name }}
          </li>
        </ul>
      </div>
      <div class="moves-session">
        <h3 class="name-moves">{{ $t('pokecardmoves.moves') }}:</h3>
        <ul class="moves">
          <li
            class="moves-items"
            v-for="move in selectedPokemon.movesList"
            :key="move"
          >
            {{ move }}
          </li>
        </ul>
      </div>
      <div class="game-session">
        <ul class="games">
          <h3 class="name-game">Games:</h3>
          <li
            class="game-items"
            v-for="game in selectedPokemon.game_indices"
            :key="game.version.name"
          >
            {{ game.version.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",

  data() {
    return {
      pokemons: [],
      searchQuery: "",
      loading: false,
      nextItem: 1,
      items: [],
      selectedPokemon: null,
      popupVisible: false,
    };
  },

  mounted() {
    this.loadPokemonData();
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  methods: {
    async loadPokemonData() {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=200"
        );
        this.pokemons = response.data.results;
        await this.loadPokemonTypes();
        await this.loadPokemonspecies();
      } catch (error) {
        console.error("Error loading pokemon data", error);
      }
    },

    async loadPokemonTypes() {
      for (const pokemon of this.pokemons) {
        try {
          const response = await axios.get(pokemon.url);
          pokemon.types = response.data.types;
        } catch (error) {
          console.error(`Error loading pokemon types ${pokemon.name}:`, error);
        }
      }
    },

    async loadPokemonspecies() {
      for (const pokemon of this.pokemons) {
        try {
          const response = await axios.get(
            `https://pokeapi.co/api/v2/pokemon-species/${this.get_id(pokemon)}`
          );
          pokemon.species = [response.data];
          console.log(pokemon.species[0].name);
        } catch (error) {
          console.error(
            `Error loading pokemon species ${pokemon.name}:`,
            error
          );
        }
      }
    },

    get_id(pokemon) {
      const pokemonNumber = pokemon.url.split("/")[6];
      return pokemonNumber;
    },

    get_svg(pokemon) {
      const pokemonNumber = this.get_id(pokemon);
      const urlsvg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonNumber}.svg`;
      return urlsvg;
    },

    get_name(pokemon) {
      return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    },

    async loadMore() {
      if (this.loading) return;

      this.loading = true;
      try {
        const response = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=25&offset=${this.pokemons.length}`
        );
        const newPokemons = response.data.results;
        await this.loadPokemonTypes(newPokemons);
        await this.loadPokemonspecies(newPokemons);
        this.pokemons.push(...newPokemons);
      } catch (error) {
        console.error("Erro loading more pokemon data:", error);
      } finally {
        this.loading = false;
      }
    },

    handleScroll() {
      const bottomOfWindow =
        document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;
      if (bottomOfWindow) {
        this.loadMore();
      }
    },

    handlePokemonClick(pokemon) {
      this.selectedPokemon = pokemon;
      this.popupVisible = true;
    },

    closePopup() {
      this.popupVisible = false;
      console.log("Closed")
    },

    show_pokemon(id) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) => {
        this.selectedPokemon = response.data;
        this.selectedPokemon.movesList = response.data.moves.map(
          (move) => move.move.name
        );
        console.log("Opened");
        console.log(response.data);
        axios.get(this.selectedPokemon.species.url).then((speciesResponse) => {
          const evolutionChainUrl = speciesResponse.data.evolution_chain.url;
          axios.get(evolutionChainUrl).then((evolutionChainResponse) => {
            const evolutionChain = evolutionChainResponse.data.chain;
            const evolutions = this.extractEvolutions(evolutionChain);
            this.selectedPokemon.evolutions = evolutions;
            this.popupVisible = true;
          });
        });
      });
    },

    extractEvolutions(chain) {
      const evolutions = [];
      let current = chain;

      while (current) {
        const evolutionDetails = {
          name: current.species.name,
        };
        evolutions.push(evolutionDetails);
        current = current.evolves_to[0];
      }
      return evolutions;
    },

    setLocale(locale) {
      this.$i18n.locale = locale;
    }
  },

  computed: {
    pokemonsFiltered() {
      if (this.searchQuery) {
        const searchTerm = this.searchQuery.toLowerCase();
        return this.pokemons.filter((pokemon) => {
          const matchesId = this.get_id(pokemon).includes(searchTerm);
          const matchesName = pokemon.name.toLowerCase().includes(searchTerm);
          const matchesType =
            pokemon.types &&
            pokemon.types.some((type) =>
              type.type.name.toLowerCase().includes(searchTerm)
            );
          const matchesSpecies =
            pokemon.species &&
            pokemon.species.length > 0 &&
            pokemon.species[0].name.toLowerCase().includes(searchTerm);
          return matchesName || matchesType || matchesId || matchesSpecies;
        });
      } else {
        return this.pokemons;
      }
    },
  },
};
</script>

<style scoped>
main {
  background-color: #ffffff;
  padding: 20px;
}

#array {
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 1vw;
  justify-content: center;
}

@media (max-width: 768px) {
  #array {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 10px;
  }
}

.pokemon {
  width: calc(100% - 5vw);
  margin: 2vw;
  padding-top: 0.5vw;
  background-color: #ffffff;
  text-align: center;
  border-radius: 8px 8px 8px 8px;
  box-shadow: 0 0 5px gray;
  -webkit-box-shadow: 0 0 5px gray;
}

.name {
  font-family: "Poppins", sans-serif;
  color: #1d1d1d;
  font-weight: lighter;
  font-size: 20px;
  margin-top: 0;
  padding-bottom: 1vw;
  padding-top: 1vw;
  background-color: #efefef;
}

.forms {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5vh;
  padding-bottom: 4vh;
  padding-left: 4.5vh;
  padding-right: 4.5vh;
}

.search-form {
  display: flex;
  justify-content: left;
}

.search-button input[type="text"] {
  padding: 10px;
  width: 45vw;
  border-radius: 15px;
  border: none;
  outline: 0;
  box-shadow: 0 0 5px gray;
  -webkit-box-shadow: 0 0 5px gray;
}

.languages {
  font-weight: bold;
  color: white;
  font-size: medium;
}
#searchPokemonField {
  font-family: "Poppins";
  font-size: small;
}

.itens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-left: 1vh;
  padding-right: 1vh;
}

.id {
  font-family: "Poppins";
  font-size: smaller;
  font-weight: bold;
  display: flex;
  justify-content: start;
  color: #b8b8b8;
  padding-left: 1vh;
  padding-top: 0.2vh;
}

.types {
  font-family: "Poppins";
  color: #b8b8b8;
  font-weight: bold;
  display: flex;
  flex-wrap: wrap;
  column-gap: 1vh;
  align-items: center;
}

.type-item {
  background-color: #efefef;
  border-radius: 1vh;
  padding: 0.7vh;
}

.species {
  display: flex;
  justify-content: start;
  align-items: center;
  color: #b8b8b8;
  font-family: "Poppins";
  font-weight: bold;
  padding-right: 0.5vh;
}

.species-item {
  padding-left: 0.2vw;
}

.container-type {
  display: flex;
  justify-content: center;
  margin-bottom: 1vh;
}

.list-group-wrapper {
  position: relative;
}

.list-group {
  overflow: auto;
  height: 50vh;
  border: 2px solid #dce4ec;
  border-radius: 5px;
}

.loading {
  text-align: center;
  position: absolute;
  color: #fff;
  z-index: 9;
  background-color: #b8b8b8;
  padding: 8px 18px;
  border-radius: 5px;
  left: calc(50% - 45px);
  top: calc(50% - 18px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background-color: white;
  padding: 2vh;
  width: 40%;
  border-radius: 1.5vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-items: center;
  align-items: center;
  overflow-y: auto;
  overflow-x: auto;
  max-height: 90vh;
  max-width: 60%;
}

.button {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 95%;
}

.card-name {
  font-family: "Poppins";
  font-weight: bolder;
  color: #b7b9d0;
  font-size: larger;
  display: flex;
  align-items: center;
}

.popup-button {
  background-color: white;
  color: #b7b9d0;
  font-weight: bolder;
  border-radius: 1vh;
  padding: 2vh;
  outline: 0;
  border: none;
  font-size: larger;
}

.evolution-session {
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  justify-content: start;
  align-items: center;
  row-gap: 1vh;
  column-gap: 1vh;
  padding-bottom: 1vh;
}

.evolution-items {
  background-color: #b8b8b8;
  color: #efefef;
  border-radius: 1vh;
  padding: 0.7vh;
}

.evolution {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1vh;
  row-gap: 1vh;
  align-items: center;
  list-style-type: none;
  color: #efefef;
  border-radius: 1vh;
  font-weight: bold;
  justify-content: center;
  font-size: x-small;
}

.evolution-name {
  color: #b8b8b8;
  font-size: medium;
}

.moves {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.5vh;
  row-gap: 0.5vh;
  align-items: center;
  list-style-type: none;
  color: #efefef;
  font-weight: bold;
  justify-content: center;
  font-size: x-small;
}

.moves-session {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.name-moves {
  color: #b7b9d0;
  font-size: medium;
}

.moves-items {
  color: #b8b8b8;
  display: flex;
}

.sprites {
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
}

.sprites-name {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b7b9d0;
  font-size: medium;
}

.game-session {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1vh;
}

.name-game {
  color: #b7b9d0;
  font-size: medium;
}

.games {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1vh;
  row-gap: 1vh;
  align-items: center;
  list-style-type: none;
  color: #efefef;
  border-radius: 1vh;
  padding: 0.7vh;
  font-weight: bold;
  justify-content: center;
  font-size: x-small;
}

.game-items {
  background-color: #efefef;
  color: #b8b8b8;
  border-radius: 1vh;
  padding: 0.7vh;
}
</style>
