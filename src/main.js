// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('../css/main.css')
require('../response/assets/css/main.css')
require('expose?$!expose?jQuery!jquery')
require('../vendors/bower_components/jquery/dist/jquery.min.js')
require('../vendors/bower_components/bootstrap/dist/js/bootstrap.min.js')
require('../vendors/bower_components/Waves/dist/waves.min.js')
require('vue2-animate/dist/vue2-animate.min.css')
import Icon from 'vue-awesome/components/Icon'

// globally (in your main .js file)
Vue.component('icon', Icon)

import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'
export default Vue
import App from './components/App.vue'
import Survey from './components/Survey.vue'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Completed from './components/Completed';
import { store } from './store/store';
import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.css'
import auth from './auth/auth'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Import F7
/* eslint-disable no-unused-vars */
import Framework7 from 'framework7'
import Framework7Vue from 'framework7-vue'
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'


// Init F7 Vue Plugin
Vue.use(Framework7Vue)
Vue.use(Framework7)
Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(BootstrapVue)
// Vue.http.headers.common['X-CSRF-TOKEN'] = document.getElementsByName('csrf-token')[0].getAttribute('content');
Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');
// if (window.localStorage) {
//   Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');
// } else {
//   // can't be used
// }
Vue.http.options.root = 'https://happyreply.com/'

export var router = new VueRouter({
routes: [
     {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/survey',
      name: 'Survey',
      component: Survey
    },
    {
      path: '/completed',
      name: 'Completed',
      component: Completed
    }
  ]
});

function requireAuth (to, from, next) {
 if (!auth.loggedInt()){
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
 } else {
   next()
 }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
    framework7: {
    root: '#app',
     // Uncomment to enable Material theme:
    material: true
  },
  router: router,
  store: store,
  render: h => h(App)
})
