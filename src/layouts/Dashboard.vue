<template>
<v-app>
  <tool-bar></tool-bar>
  <nav-drawer></nav-drawer>
  <mainView></mainView>
</v-app>
</template>
<script>
import navDrawer from './components/core/Drawer.vue'
import toolBar from './components/core/Toolbar.vue'
import mainView from './components/core/View.vue'
import { mapGetters } from 'vuex'
 export default {
   components: {
    navDrawer,
    mainView,
    toolBar
   }
 }
</script>
