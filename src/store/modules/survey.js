import api from '../../api'
import { DatabaseSetting} from '../../config/variables.js'

const state = {
	surveys: [],
}

const actions = {

	/**
	 * thid action get survey from api
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @param  {[type]} data             [description]
	 * @return {[type]}                  [description]
	 */
  async getSurvey({commit, dispatch}, data) {
      return new Promise ((resolve, reject) => {
			setTimeout(() => {
				console.log('getting survey title....')
				api.getSurveyTitle(data['user_id'])
				  .then ( response => {
				  	console.log( response )
				  	return response.json()
				  })
				  .then ( response => {
				  	console.log('saved to survey table')

				  	/*** Save survey to tlocal database ****/
				  	 dispatch('saveSurveyInfoToDataBase', response)
				  })
			})
		})
    },

   /**
    * [saveSurveyInfoToDataBase description]
    * @param  {[type]} options.commit [description]
    * @param  {[type]} response       [description]
    * @return {[type]}                [description]
    */
   async saveSurveyInfoToDataBase( {commit}, response){
   	 var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
 	 db.transaction( function (tx) {
 	 	  var sql = 'INSERT INTO feedbacks (feedback_id, feedback_title, feedback_desc, feedback_slug) VALUES (?,?,?,?)';
          tx.executeSql(sql, [ res['feedback_id'], res['feedback_title'], res['feedback_description'],res['feedback_slug']]);
 	 })
   }


}


export default {
	state,
	actions
}

