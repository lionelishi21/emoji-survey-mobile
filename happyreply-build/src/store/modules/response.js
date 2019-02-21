const state = {
  responses: [],
  responseCount: 0
}

const getters = {
  GetAllResponses: state => state.responses,
  ResponseAmount: state => state.responseCount
}

const actions = {
  getResponses ({commit}, db) {
    db.transaction(function (tx) {
      tx.executeSql('SELECT * FROM responses;', [], function (tx, results) {
        var len = results.rows.length
        commit('setResponseCount', len)
      })
    })
  }
}

const mutations = {
  setResponseCount (state, count) {
    state.responseCount = count
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}

