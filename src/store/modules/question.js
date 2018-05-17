import api from '../../api'
import { 
  LOAD_QUESTION,
  LOAD_QUESTIONS_SUCCESSFULL
} from '../mutation-types';

const state = {
  questions: [],
  questionCount: 0,
  isLoading: false
}

const getters = {
  getAllQuestions: state => state.questions,
  QuestionAmount: state => state.questionCount,
  isLoading: state => state.isLoading
}

const actions = {
  getQuestions ({commit, dispatch}, data) {
    var db = data['db']
    var userId = data['user_id']
    commit(LOAD_QUESTION)
    api.getSurveyQuestion(userId)
      .then (response => {
        return response.json()
      }).then(response => {
        dispatch('saveQuestionsInfoToDatabase', {response, db})
      })
  },
  saveQuestionsInfoToDatabase ({commit}, response) {
    var data = response['response']
    var db  = response['db']
    for (let key in data) {
      db.transaction(function (tx) {
        var sql = 'INSERT INTO questions ( id, type, feedback_question, feedback_id, answer_count ) VALUES (?,?,?,?,?)'
        tx.executeSql(sql, [data[key]['id'], data[key]['type'], data[key]['feeback_question'], data[key]['feedback_id'], data[key]['answer_count']])
      }, function(tx, error){
        console.log(tx)
      })
    }
  },
  getFeedbackQuestionsFromSqlLite ({commit}, db) {
     db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM questions;', [], function (tx, results) {
          var len = results.rows.length
          console.log(results)
          var resultsArray = []
          for (var i = 0; i < len; i++) {
            var res = { id: results.rows.item(i).id, question: results.rows.item(i).feedback_question, type: results.rows.item(i).type, 
                       feedback_id: results.rows.item(i).feedback_id, answer_count: results.rows.item(i).answer_count }
            resultsArray.push(res);
          }
          commit('countQuestions', len)
          commit('setQuestions', resultsArray)
          commit(LOAD_QUESTIONS_SUCCESSFULL)
        }, function(tx, error) {
          console.log(error)
        })
      })
  }
}

const mutations = {
  setQuestions (state, question) {
    state.questions = question
  },
  countQuestions (state, count) {
    state.questionCount = count
  },
  [LOAD_QUESTION](state) {
    state.isLoading = true
  },
  [LOAD_QUESTIONS_SUCCESSFULL](state) {
    state.isLoading = false
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
