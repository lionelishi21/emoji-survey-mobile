import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    feedbacks: {},
    survey: [],
    sliders: [],
    matrixs: [],
    answers: [],
    responses: [],
    questions: [],
    count_responses: "",
    count_question: "",
    count_answer: "",
    count_matrix: ""
  },
  getters: {

    all_questions (state) {
      return state.questions
    },
    all_answers (state) {
      return state.answers
    },
    all_matrixs (state) {
      return state.matrixs
    },
    all_sliders (state) {
      return state.sliders
    },
    all_feedback (state) {
      return state.feedbacks
    },
    all_response (state) {
      return state.responses
    },
    question_count (state) {
      return state.count_question
    },
    answer_count (state) {
      return state.count_answer
    },
    matrix_count (state) {
      return state.count_matrix
    },
    response_count (state) {
      return state.count_responses
    }
  },
  mutations: {
    addToFeedback (state, feedback) {
      state.feedbacks = feedback
    },
    addToQuestion (state, question) {
      state.questions = question
    },
    addToAnswer (state, answer) {
      state.answers = answer
    },
    addToMatrix (state, matrix) {
      state.matrixs = matrix
    },
    addToSlider (state, slider) {
      state.sliders = slider
    },
    addToResponse (state, response) {
      state.responses = response
    },
    countQuestion (state, count_question) {
      state.count_question = count_question
    },
    countAnswer (state, count_answer){
      state.count_answer = count_answer
    },
    countResponse (state, count) {
      state.count_responses = count
    },
    countMatrix(state, count){
      state.count_matrixs = count
    }
  }
})
