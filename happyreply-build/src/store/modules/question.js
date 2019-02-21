import api from '../../api'
import { 
  LOAD_QUESTION,
} from '../mutation-types';

const state = {
  questions: [],
  questionCount: 0
}

const getters = {
  getAllQuestions: state => state.questions,
  QuestionAmount: state => state.questionCount,
}

const actions = {
  getQuestions ({commit, dispatch}, data) {
    var db = data['db']
    var userId = data['user_id']
   
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
        var sql = 'INSERT INTO questions ( id, type, feedback_question, feedback_id, answer_count, isLogic, recieved_logic ) VALUES (?,?,?,?,?,?,?)'
        tx.executeSql(sql, [data[key]['id'], data[key]['type'], 
          data[key]['feeback_question'], data[key]['feedback_id'],
           data[key]['answer_count'], data[key]['isLogic'], data[key]['recieved_logic']])
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
                       feedback_id: results.rows.item(i).feedback_id, answer_count:
                        results.rows.item(i).answer_count, recieved_logic: results.rows.item(i).recieved_logic, isLogic: results.rows.item(i).isLogic }
            resultsArray.push(res);
          }
          commit('setQuestions', resultsArray)
          
        }, function(tx, error) {
          console.log(error)
        })

      })
   },
   getQuestionCount({commit}, db) {
       db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM questions;', [], function (tx, results) {
          var len = results.rows.length
          commit('countQuestions', len)
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
 
  
}

export default {
  state,
  getters,
  actions,
  mutations
}
