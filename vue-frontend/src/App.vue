/*
 * Here was once upon a time the license text of amazon
 *
 */

<template>
  <div id="app">
    <v-menu/>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue'
import Menu from '@/components/Menu'

Vue.component('v-menu', Menu)

export default {
  name: 'app'
}
</script>

<style>
body {
  margin: 0
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
