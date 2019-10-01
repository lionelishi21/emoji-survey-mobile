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
import Surveys from './layouts/Surveys.vue'
import Dashboard from './layouts/Dashboard.vue'

import Home from './layouts/home/index.vue'
import Response from './layouts/Responses'
import Completed from './components/Completed'
import Intro from './layouts/survey/start.vue'
import Intro2 from './components/Intro2'
import Settings from './layouts/settings/index.vue'
import store  from './store/';
import 'font-awesome/css/font-awesome.css'
import 'bootstrap/dist/css/bootstrap.css'
import auth from './auth/auth'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Notifications from 'vue-notification'
import VueYoutube from 'vue-youtube'
import VModal from 'vue-js-modal'
import Vuetify from 'vuetify'
import ResponseTheme from './response-main'
import IdleVue from 'idle-vue'
import JsonExcel from 'vue-json-excel'
import VueTouchKeyboard from "vue-touch-keyboard";
import style from "vue-touch-keyboard/dist/vue-touch-keyboard.css"; // load default style
import VueQrcodeReader from 'vue-qrcode-reader'
import Qrscanner from './layouts/Scanner.vue'
import NxCard from 'nx-card'
import VueCordova from 'vue-cordova'
// import VueEcho from 'vue-echo-laravel';
// window.io = require('socket.io-client')

import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
// Components
// import './components'

// Plugins
// import './plugins'
Vue.use(VueCordova)
Vue.use(NxCard)
Vue.use(VueQrcodeReader)
Vue.use(VueTouchKeyboard);
Vue.component('downloadExcel', JsonExcel)
Vue.use(ResponseTheme)
Vue.use(Vuetify)
Vue.use(VModal)

Vue.use(VueRouter)
Vue.use(VueResource)


// this a test
Vue.use(Notifications)
Vue.use(VueYoutube)
// Vue.use(VueEcho, {
//     broadcaster: 'socket.io',
//     host: `http://${localStorage.getItem('tenant')}.iledgers.io:6001`,
// });


import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('id_token');
Vue.http.options.root = localStorage.getItem('url')
Vue.http.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin'

import Login from './layouts/login/index.vue';
import Starting from './pages/getstarted.vue';

export var router = new VueRouter({
routes: [
     {
      path: '/',
      name: 'Login',
      component: Login
    },
    { path: '/started', name: 'Starting', component: Starting },
    {
      path: '/dashboard',
      component: Dashboard,
      children:[
        { path: '', name: 'Home', component:  Home },
        { path: '/surveys', name: 'Survyes', component: Surveys },
        { path: '/response', name:'Response', component: Response },
        {
          path: '/qrscanner', name: 'QrcodeScanner', component: Qrscanner
        },
        {
          path: '/settings',
          name: 'Settings',
          component: Settings
        },
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
    // { path: '/intro2/:id', name: 'Intro2', component: Intro2 }
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



export const state = () => ({
  snack: ''
})

export const mutations = {
  setSnack (state, snack) {
    state.snack = snack
  }
}