import Vue from 'vue'
import Vuex from 'vuex'
import feedback from './modules/feedback'
import question from './modules/question'
import answer from './modules/answer'
import matrix from './modules/matrix'
import slider from './modules/slider'
import response from './modules/response'
import database from './modules/database'
import post from './modules/post'
import customer from './modules/customer'
import dialog from './modules/dialogs.js'
import user from './modules/user.js'
import snackbar from './modules/snackbar.js'
import survey from './modules/survey.js'

Vue.use(Vuex)
Vue.config.debug = true

export default new Vuex.Store({
  modules: {
    feedback,
    question,
    survey,
    snackbar,
    response,
    answer,
    matrix,
    slider,
    database,
    post,
    user,
    customer,
    dialog
  }
})
