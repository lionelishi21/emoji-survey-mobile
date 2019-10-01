import api from '../../api'
import { DatabaseSetting } from '../../config/variables.js'


const state = {
    mcResponses: [],
    matrix_responses: {},
    range_responses: {},
    comments_responses: {},
    slider_responses: {},
}

const getters = {
	getMcResponse: state => state.mcResponses,
	getMatrixResponse: state => state.matrix_responses,
	getRangeResponse: state => state.range_responses,
	getCommentResponse: state => state.comment_responses,
	getSliderResponse: state => state.slider_responses
}

const actions = {

	/**
	 * [postResponses description]
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @param  {[type]} payload          [description]
	 * @return {[type]}                  [description]
	 */
	postResponses ({commit, dispatch}, payload) {

		var csrfToken = $('meta[name=csrf-token]').attr('content')
		api.postResponses(payload)
			.then(response => {
				console.log(response)
				return response.json()
			}).then( response => {
				console.log(response)
				if (payload['offline'] != true) {
					dispatch('saveOffline', payload)
				}

				if (payload['offline'] == true) {
					  commit('setSnack', 'Response post successfully')
					  
					  dispatch('dropResponseTable')
					  var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
			      	  	dispatch('getResponses', db)
			          	dispatch('getFeedbackTitleFromSqlLite', db)
				}
			})
	},

	/**
	 * [saveToLocalFile description]
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @param  {[type]} payload          [description]
	 * @return {[type]}                  [description]
	 */
	saveToLocalFile({commit, dispatch}, payload) {
		 var finalObj = $.merge(json1, json2, json3, json4 , json5 , json6, json7, json8);
		 windows.localStorage.setItem('responses', JSON.stringify(finalObj))
		 dispatch('saveFileLocally');
	},

	/**
	 * [saveFile description]
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @return {[type]}                  [description]
	 */
	saveFileLocally({commit, dispatch}) {
    	var data = window.localStorage.getItem('responses')
    	const blob = new Blob([data],{ type: 'text/plain'})
    	const e = document.createEvent('MouseEvents');
        var a = document.createElement('a');
	    a.download = "Happyreply.json";
	    a.href = window.URL.createObjectURL(blob);
	    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
	    e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	    a.dispatchEvent(e);
    	// this.doc = false
	},

	/**
	 * ***********************************************
	 * Post Survery data offline
	 * ***********************************************
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @return {[type]}                  [description]
	 * ***********************************************
	 */
   saveOffline({commit, dispatch}, payload) {

	  var mc = JSON.stringify(payload['multpleChoice'])
      var matrixAnswers = JSON.stringify(payload['matrix'])
      var sliderAnswers = JSON.stringify(payload['slider'])
      var rangeAnswers = JSON.stringify(payload['range'])
      var commentsAnswers = JSON.stringify(payload['comments'])
      var emailAnswer = JSON.stringify(payload['email'])
      var numberAnswer = JSON.stringify(payload['number'])
      var shorttextAnswer = JSON.stringify(payload['shorttext'])

	  db.transaction(function (tx) {
	        var sql = 'INSERT INTO responses (multiple_choice, matrix, slider, range, suggestion, email, number, shorttext, feedback_id) VALUES (?,?,?,?,?,?,?,?,?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          )'
	        tx.executeSql(sql, [mc, matrixAnswers, sliderAnswers, rangeAnswers, commentsAnswers, emailAnswer, numberAnswer, shorttextAnswer,  fbId], 
	           function (tx, result) {
	            console.log("Query Success");
	          }, function (tx, error) {
		            console.log("Query Error: " + error.message);
		         }

	          )
	      })
	 },

	 /**
	  * [postResponseOffline description]
	  * @param  {[type]} options.commit   [description]
	  * @param  {[type]} options.dispatch [description]
	  * @param  {[type]} payload          [description]
	  * @return {[type]}                  [description]
	  */
	 postResponseOffline({commit, dispatch}, payload) {

	    var db = openDatabase(payload['database'], payload['version'], payload['dbDisplay'], payload['maxSize'])
	 	db.transaction(function(tx) {
	 		tx.executeSql('SELECT * FROM responses;', [], function(tx, results) {
	 			
	 			var len = results.rows.length
	 			console.log('response '+len )
	 			for (var i = 0; i < len; i++) {
	 			    var mcArray = ''
			        var matrixArray = ''
			        var sliderArray = ''
			        var rangeArray = ''
			        var commentArray = ''
			        var emailArray = ''
			        var numberArray = ''
			        var shorttextArray = ''
			        var npsArray = ''

			        if (results.rows.item(i).multiple_choice != '{}') {
			          mcArray = JSON.parse(results.rows.item(i).multiple_choice)
			        }

			        if (results.rows.item(i).matrix != '{}') {
			          matrixArray = JSON.parse(results.rows.item(i).matrix)
			        }

			        if (results.rows.item(i).slider != '{}') {
			          sliderArray = JSON.parse(results.rows.item(i).slider)
			        }

			        if (results.rows.item(i).range != '{}') {
			          rangeArray = JSON.parse(results.rows.item(i).range)
			        }

			        if (results.rows.item(i).suggestion != '{}') {
			          commentArray = JSON.parse(results.rows.item(i).suggestion)
			        }

			        if (results.rows.item(i).email != '{}') {
			          emailArray = JSON.parse(results.rows.item(i).email)
			        }

			        if (results.rows.item(i).number != '{}') {
			          numberArray = JSON.parse(results.rows.item(i).number)
			        }

			        if (results.rows.item(i).shortext != '{}') {
			          shorttextArray = JSON.parse(results.rows.item(i).shorttext)
			        }

			        //  if (results.rows.item(i).nps != '{}') {
			        //     npsArray = JSON.parse(results.rows.item(i).nps)
			        //  }
			        // // 
			        var feedbackId = results.rows.item(i).feedback_id;
			        var params = {
			        	mc: mcArray,
			        	matrix: matrixArray,
			        	slider: sliderArray,
			        	range: rangeArray,
			        	comment: commentArray,
			        	email: emailArray,
			        	number: numberArray,
			        	shorttext: shorttextArray,
			        	nps: npsArray,
			        	offline: true,
			        	customer_email: '',
			        	feedback_id: feedbackId
			        }
			        dispatch('postResponses', params)
	 			}
	 		})
	 	})
	 },

	 /**
	  * ******************************************************
	  * This function only post offline responses
	  * ******************************************************
	  * @param {[type]} options.commit   [description]
	  * @param {[type]} options.dispatch [description]
	  * @param {[type]} payload          [description]
	  */
	 PostOfflineResponse({commit, dispatch}, payload) {

	 }

}

const mutations = {

	/**
	 * [setMcResponse description]
	 * @param {[type]} state [description]
	 * @param {[type]} mc    [description]
	 */
	setMcResponse(state, mc) {
		state.mcResponses = mc
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}


