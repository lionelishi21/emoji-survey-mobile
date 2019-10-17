import api from '../../api'
import { DatabaseSetting } from '../../config/variables.js'

const state = {
  feedbacks: [],
  title: {
    id: '',
    slug: '',
    name: 'Survey Name',
    desc: 'Survey Description',
    question_count: ''
  },
  // dialog: {
  //   preloader: false,
  //   message: 'Please stand by'
  // },
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

    /**
     * [getBackgroundImage description]
     * @param  {[type]} options.commit   [description]
     * @param  {[type]} options.dispatch [description]
     * @param  {[type]} id               [description]
     * @return {[type]}                  [description]
     */
    getBackgroundImage({commit, dispatch}, id) {

      api.getBackgroundImage(id)
        .then( response => {
            var image = response.body
            if (image != "") {
              var url = localStorage.getItem("url")
              commit('setSurveyBackgrounImage', url+'/'+image )
            }
        })
    },

    /**
     * [createFeedbackTable description]
     * @param  {[type]} options.dispatch [description]
     * @param  {[type]} db               [description]
     * @return {[type]}                  [description]
     */
    createFeedbackTable({dispatch}, db) {
      console.log('initialize creating feeback database')
      db.transaction(function (tx) {
        tx.executeSql('DROP TABLE IF EXISTS feedbacks')
        tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER,
            feedback_title TEXT, feedback_desc TEXT, feedback_slug Text)`, [])
      })
    },

    /**
     * ***********************************************************************
     * This function get feedback title from api
     * ***********************************************************************
     * @param  {[type]} options.commit   [description]
     * @param  {[type]} options.dispatch [description]
     * @param  {[type]} data             [description]
     * @return {[type]}                  [description]
     * ***********************************************************************
     */
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


    
    /**
     * [saveFeedbackInfoToDataBase description]
     * @param  {[type]} options.commit [description]
     * @param  {[type]} response       [description]
     * @return {[type]}                [description]
     */
    saveFeedbackInfoToDataBase ({commit}, response) {
      var res = response['response']
      var db = response['db']
      db.transaction(function (tx) {
        var sql = 'INSERT INTO feedbacks (feedback_id, feedback_title, feedback_desc, feedback_slug) VALUES (?,?,?,?)';
        tx.executeSql(sql, [ res['feedback_id'], res['feedback_title'], res['feedback_description'],res['feedback_slug']]);
      })
    },

    /**
     * ****************************************************************************
     * This function get Survey title from websql database
     * ****************************************************************************
     * @param  {[type]} options.commit   [description]
     * @param  {[type]} options.dispatch [description]
     * @param  {[type]} db               [description]
     * @return {[type]}                  [description]
     * *****************************************************************************
     */
    async getFeedbackTitleFromSqlLite ({commit, dispatch }, db) {
        db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM feedbacks;', [], function (tx, results) { 
          console.log('Getting feeback titles...')
          commit('setFeedbackTitles', results.rows[0])
          dispatch('getFeedbackQuestionsFromSqlLite', db)
        })
      })
   },

   /**
    * *********************************************************************************
    * THis function get intro video
    * *********************************************************************************
    * @param  {[type]} options.dispatch [description]
    * @param  {[type]} options.commit   [description]
    * @param  {[type]} feedback_id      [description]
    * @return {[type]}                  [description]
    * *********************************************************************************
    */
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
  },


}

export default {
  state,
  getters,
  actions,
  mutations
}
