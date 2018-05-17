import Vue from 'vue';
import VueResource from 'vue-resource'

Vue.use(VueResource)
export const FeedbackResource = Vue.resource('api/get-surveys{/id}')
export const QuestionResource = Vue.resource('api/get-questions-by-feedback-id?user_id{=id}')
export const AnswerResource = Vue.resource('api/get-answers-by-feedback-id?user_id{=id}')
export const MatrixResource = Vue.resource('api/get-matrixs?user_id{=id}')
export const SliderResource = Vue.resource('api/get-sliders?user_id{=id}')
