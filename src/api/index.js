import { FeedbackResource, QuestionResource, AnswerResource, MatrixResource, SliderResource } from './resources'

export default {
  getSurveyTitle: function (id) {
    return FeedbackResource.get({user_id: id})
  },
  getSurveyQuestion: function (id) {
    return QuestionResource.get({user_id: id})
  },
  getSurveyAnswers: function (id) {
    return AnswerResource.get({user_id: id})
  },
  getSurveyMatrix: function (id) {
    return MatrixResource.get({user_id: id})
  },
  getSurveySlider: function (id) {
    return SliderResource.get({user_id: id})
  }
}
