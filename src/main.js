// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('expose?$!expose?jQuery!jquery')
require('../vendors/bower_components/jquery/dist/jquery.min.js')
require('vue2-animate/dist/vue2-animate.min.css')


import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'
import App from './components/App.vue'
import Survey from './layouts/Survey.vue'
import Dashboard from './layouts/Dashboard.vue'
import Login from './components/Login.vue'
import Home from './layouts/Home.vue'
import Response from './layouts/Responses'
import Completed from './components/Completed'
import Intro from './components/Intro'
import Intro2 from './components/Intro2'
import store  from './store/';
import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.css'
import auth from './auth/auth'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Notifications from 'vue-notification'
import VueYoutube from 'vue-youtube'
import VueUp from 'vueup'
import VModal from 'vue-js-modal'
import Vuetify from 'vuetify'
import ResponseTheme from './response-main'
import IdleVue from 'idle-vue'
import VueGeolocation from 'vue-browser-geolocation';

Vue.use(VueGeolocation);
const eventsHub = new Vue()
 
// Vue.use(IdleVue, {
//   eventEmitter: eventsHub,
//   idleTime: 60000
// })

Vue.use(IdleVue, { store })
Vue.use(ResponseTheme)
Vue.use(Vuetify)
Vue.use(VModal)

Vue.use(VueRouter)
Vue.use(VueResource)

// this a test
Vue.use(Notifications)
Vue.use(VueYoutube)

import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');
Vue.http.options.root = 'https://app.happyreply.com/'
Vue.http.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin'

export var router = new VueRouter({
routes: [
     {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children:[
        { path: '', name: 'Home', component:  Home },
        { path: '/response', name:'Response', component: Response }
        // { path: '/settings', component: SurveyStart },
      ]
    },
    {
      path: '/survey/:id',
      name: 'Survey',
      component: Survey
    },
    {
      path: '/completed/:id',
      name: 'Completed',
      component: Completed
    },
    { path: '/intro/:id', name: 'Intro', component: Intro },
    { path: '/intro2/:id', name: 'Intro2', component: Intro2 }
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
  router: router,
  store: store,
  render: h => h(App)
})
