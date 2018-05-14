import api from '../../api'

const state = {
 answers: []
}

const getters = {
  getAllAnswers: state => state.answers
}

const actions = {
  getAnswers ({commit, dispatch}, data) {
    var userId = data['user_id']
    var db = data['db']
    api.getSurveyAnswers(userId)
      .then(response => {
        return response.json()
      }).then(response => {
        dispatch('saveAnswerToDataBase', { response, db })
      })
  },
  saveAnswerToDataBase ({ commit }, response) {
   var data = response['response']
   var db = response['db']
   for (let key in data) {
    db.transaction(function (tx) {
      var sql = 'INSERT INTO answers ( id, answer, emoji, feedback_id, question_id ) VALUES (?,?,?,?,?)';
      tx.executeSql(sql, [data[key]['id'], data[key]['answer'], data[key]['emoji'], data[key]['feedback_id'], data[key]['question_id']]);
    })
   }
  },
  getFeedbackAnswerFromSqlLite ({commit}, db) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM answers;', [], function (tx, results) {
        var len = results.rows.length
        var resultsArray = [];
        for (var i = 0; i < len; i++) {
          var res = {
            id: results.rows.item(i).id, 
            answer: results.rows.item(i).answer, 
            emoji: results.rows.item(i).emoji,
            feedback_id: results.rows.item(i).feedback_id, 
            question_id: results.rows.item(i).question_id 
          }
          resultsArray.push(res);
        }
        commit('setAnswers', resultsArray)
      })
    })
  }
}

const mutations = {
 setAnswers (state, answer) {
  state.answers = answer
 }
}


export default {
  state,
  getters,
  actions,
  mutations
}

