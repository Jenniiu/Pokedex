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
        >
        <div class="itens">
          <div class="types" v-if="pokemon.types">
            <div class="type_item" v-for="(type, index) in pokemon.types" :key="index">
              {{ type.type.name }}
            </div>
          </div>
          <h2 class="id">#{{ get_id(pokemon) }}</h2>
        </div>
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
</template>

<script>
import axios from "axios";

export default {
  name: "Home",

  data() {
    return {
      pokemons: [],
      searchQuery: "",
    };
  },

  mounted() {
    this.loadPokemonData();
  },

  methods: {

    async loadPokemonData() {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=150");
        this.pokemons = response.data.results;
        await this.loadPokemonTypes();
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
          console.error(`Erro ao carregar os tipos do Pokémon ${pokemon.name}:`, error);
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
  },

  computed: {
    pokemonsFiltered() {
      if (this.searchQuery) {
        const searchTerm = this.searchQuery.toLowerCase();
          return this.pokemons.filter(pokemon => {
            const matchesId = this.get_id(pokemon).includes(searchTerm);
            const matchesName = pokemon.name.toLowerCase().includes(searchTerm);
            const matchesType = pokemon.types.some(type => type.type.name.toLowerCase().includes(searchTerm));
          return matchesName || matchesType || matchesId;
          });
          
          }else{
            return this.pokemons;
          }
    }
  }
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

.itens{
  display: flex;
  flex-direction: row;
  align-items: center;
}

.id {
  font-family: "Poppins";
  font-size: smaller;
  font-weight: lighter;
  width: 95%;
  display: flex;
  justify-content: end;
  padding-right: 1vw;
}

.types{
  font-family: "Poppins";
  font-weight: bold;
  color:#B8B8B8;
  display: flex;
  flex-direction: row;
}

.type_item{
  padding-left: 0.8vw;
}
</style>
