<template>
  <div class="forms">
    <div class="search_form">
      <form class="search-button">
        <label hidden for="searchPokemonField" class="form-label"
          >Pesquisar</label
        >
        <input
          v-model="searchPokemonField"
          type="text"
          id="searchPokemonField"
          placeholder="Pesquisar..."
        />
      </form>
    </div>
  </div>

  <main class="content" ref="content">
    <div class="block">
      <ul id="array">
        <li
          class="pokemon"
          v-for="pokemon in pokemonsFiltered"
          :key="pokemon.name"
        >
          <h2 class="id">#{{ get_id(pokemon) }}</h2>
          <img
            :src="get_svg(pokemon)"
            :alt="pokemon.name"
            width="50%"
            height="150vw"
          />
          <h2 class="name">{{ get_name(pokemon) }}</h2>
        </li>
      </ul>
    </div>
  </main>

  <div id="scroll-trigger" ref="infinitescrolltrigger">
    <i class="fas fa-spinner faa-spin"></i>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",

  data() {
    return {
      pokemons: [],
      searchPokemonField: "",
      pokemonTypes: [],
      searchQuery: "",
    };
  },

  mounted() {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=150")
      .then((response) => {
        this.pokemons = response.data.results;
      });
    this.loadPokemons();
    window.addEventListener("scroll", this.handleScroll);
  },

  methods: {
    async loadPokemons() {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=150"
      );
      this.pokemons = response.data.results;
    },

    async handleScroll() {
      const content = this.$refs.content;
      if (content) {
        const scrollTop =
          content.scrollTop || document.documentElement.scrollTop;
        const scrollHeight =
          content.scrollHeight || document.documentElement.scrollHeight;
        const clientHeight =
          content.clientHeight || document.documentElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
          await this.loadMorePokemons();
        }
      }
    },

    async loadMorePokemons() {
      try {
        const response = await axios.get(
          "https://pokeapi.co/api/v2/pokemon?limit=150&offset=" +
            this.pokemons.length
        );
        this.pokemons.push(...response.data.results);
      } catch (error) {
        console.error("Erro ao carregar mais pokémons:", error);
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
  },

  computed: {
    pokemonsFiltered() {
      if (this.searchQuery) {
        const searchTerm = this.searchQuery.toLowerCase();
        return this.pokemons.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm) ||
            this.get_id(pokemon).includes(searchTerm)
        );
      } else {
        return this.pokemons;
      }
    },
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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
  padding-top: 1vw;
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
  padding-bottom: 10px;
  padding-top: 10px;
  background-color: #efefef;
}

.forms {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 6vh;
  padding-top: 4vh;
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

.id {
  font-family: "Poppins";
  font-size: smaller;
  font-weight: lighter;
  display: flex;
  justify-content: flex-end;
  width: 95%;
}


</style>
