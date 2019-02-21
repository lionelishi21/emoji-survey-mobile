import api from '../../api'

const state = {
  sliders: []
}

const getters = {
  getAllSliders: state => state.sliders
}

const actions = {
  getSliders ({ commit, dispatch }, data) {
    var userId = data['user_id']
    var db = data['db']
    api.getSurveySlider(userId)
      .then(response => {
        return response.json()
      }).then(response => {
        dispatch('saveSliderToDataBase', { response, db })
      })
  },
  saveSliderToDataBase ({ commit }, response) {
    var data = response['response']
    var db = response['db']
    for (let key in data) {
      db.transaction(function (tx) {
        var sql = 'INSERT INTO sliders ( id, question_id, left, right, label) VALUES (?,?,?,?,?)'
        tx.executeSql(sql, [data[key]['id'], data[key]['question_id'], data[key]['left'], data[key]['right'], data[key]['label']])
      })
    }
  },
  getFeedbackSliderFromSqlLite ({ commit }, db) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM sliders;', [], function (tx, results) {
        var len = results.rows.length
        var resultsArray = []
        for (var i = 0; i < len; i++) {
          // console.log(results.rows.item(i).id);
          var res = {
            id: results.rows.item(i).id,
            question_id: results.rows.item(i).question_id,
            left: results.rows.item(i).left,
            right: results.rows.item(i).right,
            label: results.rows.item(i).label
          }
          resultsArray.push(res);
        }
        commit('setSlider', resultsArray)
      })
    })
  }
}

const mutations = {
  setSlider (state, slide) {
    state.sliders = slide
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

