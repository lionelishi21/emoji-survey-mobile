import api from '../../api'

const state = {
  feedbacks: []

}

const getters = {
  feedbackInfo: state => state.feedbacks
}

const actions = {
  createFeedbackTable({dispatch}, db) {
    db.transaction(function (tx) {
      tx.executeSql('DROP TABLE IF EXISTS feedbacks')
      tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER,
          feedback_title TEXT, feedback_desc TEXT, feedback_slug Text)`, [])
    })
  },
  getFeedback ({commit, dispatch}, data) {
    var userId = data['user_id']
    var db = data['db']
    dispatch ("createFeedbackTable", db)
    api.getSurveyTitle(userId)
      .then(response => {
        return response.json()
      }).then( response => {
        dispatch('saveFeedbackInfoToDataBase', { response, db })
      })
  },
  saveFeedbackInfoToDataBase ({commit}, response) {
    var res = response['response']
    var db = response['db']
    for (let key in res) {
      db.transaction(function (tx) {
        var sql = 'INSERT INTO feedbacks (feedback_id, feedback_title, feedback_desc, feedback_slug) VALUES (?,?,?,?)';
        tx.executeSql(sql, [ res[key]['feedback_id'], res[key]['feedback_title'], res[key]['feedback_description'],res[key]['feedback_slug']]);
      })
    }
  },
  getFeedbackTitleFromSqlLite ({commit}, db) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM feedbacks;', [], function (tx, results) {
        var len = results.rows.length;
        var resultsArray = []
        for (var i = 0; i < len; i++) {
          var res = {
            feedback_id: results.rows.item(i).feedback_id,
            feedback_title: results.rows.item(i).feedback_title,
            feedback_desc: results.rows.item(i).feedback_desc,
            feedback_slug: results.rows.item(i).feedback_slug
          }
          resultsArray.push(res)
        }

        commit('setFeedback', resultsArray)
      })
    })
  }
}

const mutations = {
  setFeedback (state, feed) {
    state.feedbacks = feed
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
