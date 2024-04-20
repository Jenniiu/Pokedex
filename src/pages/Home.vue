<template>
  <div class="forms">
    <div class="search_form">
      <form class="search-button">
        <label hidden for="searchPokemonField" class="form-label"
          >Pesquisar</label
        >
        <input
          v-model="searchQuery"
          type="text"
          id="searchPokemonField"
          placeholder="Pesquisar..."
        />
      </form>
    </div>
  </div>

  <main class="content">
    <div class="block">
      <ul id="array">
        <li
          class="pokemon"
          v-for="pokemon in pokemonsFiltered"
          :key="pokemon.name"
          v-item="item"
        >
          <div class="itens">
            <h2 class="id">{{ get_id(pokemon) }}</h2>

            <div class="species" v-if="pokemon.species">
              <div
                class="species_item"
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
          <div class="container_type">
            <div class="types" v-if="pokemon.types">
              Type:
              <div
                class="type_item"
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
        console.error("Erro ao carregar dados dos Pokémon:", error);
      }
    },

    async loadPokemonTypes() {
      for (const pokemon of this.pokemons) {
        try {
          const response = await axios.get(pokemon.url);
          pokemon.types = response.data.types;
        } catch (error) {
          console.error(
            `Erro ao carregar os tipos do Pokémon ${pokemon.name}:`,
            error
          );
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
            `Erro ao carregar espécies de Pokémon ${pokemon.name}:`,
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
        console.error("Erro ao carregar mais dados de Pokémon:", error);
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
  grid-gap: 20px;
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
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6vh;
  padding-top: 3.5vh;
  padding-bottom: 6vh;
}
.search_form {
  width: 95%;
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

#searchPokemonField {
  font-family: "Poppins";
  font-size: small;
}

.itens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.5vh;
  padding-right: 0.5vh;
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

.type_item {
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

.species_item {
  padding-left: 0.2vw;
}

.container_type {
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
</style>
