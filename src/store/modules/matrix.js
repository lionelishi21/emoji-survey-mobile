import api from '../../api'

const state = {
  matrixs: []
}

const getters = {
  getAllMatrixs: state => state.matrixs
}

const actions = {
  getAnswers ({ commit, dispatch }, data) {
    var userId = data['user_id']
    var db = data['db']
    api.getSurveyMatrix(userId)
      .then(response => {
        return response.json()
      }).then(response => {
        dispatch('saveMatrixToDataBase', { data, db })
      })
  },
  saveMatrixToDataBase ({ commit }, response) {
    var data = response['data']
    var db = response['db']
    for (let key in data) {
      db.transaction(function (tx) {
        var sql = 'INSERT INTO matrixs ( id, emoji, matrix, question_id) VALUES (?,?,?,?)'
        tx.executeSql(sql, [data['id'], data['emoji'], data['matrix'], data['question_id']])
      })
    }
  },
  getFeedbackMatixFromSqlLite ({ commit }, db) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM answers;', [], function (tx, results) {
        var len = results.rows.length;
        var resultsArray = [];
        for (var i = 0; i < len; i++) {
          var res = { id: results.rows.item(i).id, matrix: results.rows.item(i).matrix, emoji: results.rows.item(i).emoji, question_id: results.rows.item(i).question_id }
          resultsArray.push(res)
        }
        commit('setMatrixs', resultsArray)
      })
    })
  }
}

const mutations = {
  setMatrixs (state, matix) {
    state.matrixs = matix
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

