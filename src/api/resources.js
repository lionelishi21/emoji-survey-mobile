import Vue from 'vue';
import VueResource from 'vue-resource'

Vue.use(VueResource)
// var url = localStorage.getItem("url")


// if (url != undefined) {
//   url = localStorage.getItem("url")
// } else {
	var url = 'http://happyreplydev.com';
// }

export const ResponseResources = Vue.resource(url+'/post-survey-responses2')
export const FeedbackResource = Vue.resource(url+'/api/get-surveys{/id}')
export const QuestionResource = Vue.resource(url+'/api/get-questions-by-feedback-id?user_id{=id}')
export const AnswerResource = Vue.resource(url+'/api/get-answers-by-feedback-id?user_id{=id}')
export const MatrixResource = Vue.resource(url+'/api/get-matrixs?user_id{=id}')
export const SliderResource = Vue.resource(url+'/api/get-sliders?user_id{=id}')
export const SurveyImageResource = Vue.resource(url+'/api/get-background-image{/id}')
export const VideoResource = Vue.resource(url+'/api/get/video-link{/id}')
export const PostQrcodeResource = Vue.resource(url+'/api/post-qrcodes{/id}')
