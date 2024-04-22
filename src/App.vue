<template>
  <div id="app">
    <headerapp />
    <Home />
  </div>
</template>

<script>
import "./style/global.css";
import headerapp from "./components/headerapp";
import Home from "./pages/Home";


export default {
  name: "App",
  components: {
    headerapp,
    Home,
  },
};
</script>

<style></style>
