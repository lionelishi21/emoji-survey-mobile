<template>
<v-app>
  <tool-bar></tool-bar>
  <!-- <loader-component></loader-component> -->
  <nav-drawer></nav-drawer>
  <mainView></mainView>
</v-app>
</template>
<script>
import LoaderComponent from './components/Loading.vue'
import navDrawer from './components/core/Drawer.vue'
import toolBar from './components/core/Toolbar.vue'
import mainView from './components/core/View.vue'
import { mapGetters } from 'vuex'
 export default {
   components: {
     	LoaderComponent,
      navDrawer,
      mainView,
      toolBar
   },
   // mounted() {
   //    var user_id = localStorage.getItem('user_id')
   //     this.$echo.channel('survey.'+user_id).listen('NewMessageNotification', (payload) => {
   //     alert('connect to server')
   //          // console.log(payload.message.message);
   //          // this.snackbar = true
   //          // this.message = payload.message.message
   //          // var self = this;
   //    setTimeout(()=>{
   //          self.snackbar = false
   //    },1000);
   //      });
   //  },
 }
</script>
