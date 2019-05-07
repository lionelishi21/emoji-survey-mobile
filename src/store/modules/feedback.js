import api from '../../api'

const state = {
  feedbacks: [],
  title: {
    id: '',
    slug: '',
    name: 'Survey Name',
    desc: 'Survey Description',
    question_count: ''
  },
  dialog: {
    preloader: false,
    message: ''
  },
  image: 'static/survey-themes/breeze-cotton.jpg',
  vide_link: '',
  youtube: '',

}

const getters = {
  feedbackInfo: state => state.title,
  getBgImage: state => state.image,
  getVideoLink: state => state.video_link,
  getYoutubeStatus: state => state.youtube
}

const actions = {
    getBackgroundImage({commit, dispatch}, id) {
      api.getBackgroundImage
        .then( response => {
            var image = response.body
            if (image != "") {
              commit('setSurveyBackgrounImage', 'demo.happyreply.com/'+image )
            }
        })
    },
    createFeedbackTable({dispatch}, db) {
      console.log('initialize creating feeback database')
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
          console.log(response)
          return response.json()
        }).then( response => {
          console.log('save to feedback table')
          dispatch('saveFeedbackInfoToDataBase', { response, db })
        })
    },
    saveFeedbackInfoToDataBase ({commit}, response) {
      var res = response['response']
      var db = response['db']
      db.transaction(function (tx) {
        var sql = 'INSERT INTO feedbacks (feedback_id, feedback_title, feedback_desc, feedback_slug) VALUES (?,?,?,?)';
        tx.executeSql(sql, [ res['feedback_id'], res['feedback_title'], res['feedback_description'],res['feedback_slug']]);
      })
    },
    getFeedbackTitleFromSqlLite ({commit, dispatch }, db) {
        db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM feedbacks;', [], function (tx, results) { 
         
          console.log('Getting feeback titles...')
          console.log(results.rows[0])
          commit('setFeedbackTitles', results.rows[0])
          dispatch('getFeedbackQuestionsFromSqlLite', db)
        })
      })
    },
   getIntroVideo({dispatch, commit},feedback_id) {
      api.getSurveyImage(feedback_id)
        .then(response => {
          console.log(response)
          var videoId = response.body
          if (this.videoId !== '') {
             var youtube = true
             commit('setYoutubeVideoLink', videoId)
             commit('setVideoType', youtube)
          }
        }, response => {
            this.youtube = false
            commit('setVideoType', youtube)
        })
    }
}

const mutations = {
  setFeedback (state, feed) {
    state.feedbacks = feed
  },
  setFeedbackTitles( state, title) {
    state.title.name = title.feedback_title
    state.title.desc = title.feedback_desc
    state.title.slug = title.feedback_slug
  },
  setSurveyBackgrounImage( state, img) {
    state.image = img
  },
  setYoutubeVideoLink(state, vid) {
    state.video_link = vid
  },
  setVideoType(state, vid) {
    state.youtube = vid
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
