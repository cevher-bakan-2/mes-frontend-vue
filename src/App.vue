<template>
  <div id="app" v-cloak class="h-full">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
[v-cloak] {
  display: none;
}

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>