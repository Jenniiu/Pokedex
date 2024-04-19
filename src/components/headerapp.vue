<template>
  <header>
    <nav class="container">
      <a href="/"
        ><img alt="pokeball" id="logo" src="../assets/pokeball.svg"
      /></a>
      <h1 id="title">Pokédex</h1>
    </nav>
  </header>
</template>

<script>
export default {
  name: "headerapp",
};
</script>

<style scoped>
header {
  background-color: #dc0a2d;
  width: 100%;
  height: 9vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2vh;
  padding-bottom: 2vh;
  position: fixed;
  top: 0;
}

#logo {
  width: 5vh;
}

nav {
  display: flex;
  justify-content: left;
  align-items: center;
}

#title {
  @import url(https://fonts.googleapis.com/css?family=Poppins) margin: 0;
  color: #ffffff;
  font-size: xx-large;
  font-weight: 900;
  font-family: "Poppins";
  padding-left: 2vh;
}
</style>
