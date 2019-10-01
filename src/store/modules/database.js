import { DatabaseSetting } from '../../config/variables.js'

const state = {
	isDroping: false,
	isLoadSuccessfully: false,
	isLoading: false,
    dialog: {
	   isLoading: false,
	   message: ''
	},
}

const getters = {

	isLoadSuccessfully: state => state.isLoadSuccessfully,

	getDatabaseStatus: state => state.isDroping,

	isLoading: state => state.isLoading,

	loadingDailog: state => dialog
}

const actions = {

	/**
	 * *************************************************************
	 * This function create all local database for offline storage
	 * *************************************************************
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @param  {[type]} db               [description]
	 * @return {[type]}                  [description]
	 * *************************************************************
	 */
	async creatingDatabase({commit, dispatch}) {
		return new Promise( (resolve, reject) => {
				 console.log('creating dastabase...')

				 var params = {
				  	 preloader: true,
				  	 message:'Creating database'
				 }

				 commit('setLoading', params)
				 var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
				  db.transaction(
					  	function (tx) {
					  	tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER, feedback_title TEXT,
					  	feedback_desc TEXT, feedback_slug Text)`, [])

					  	tx.executeSql(`CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL, answer TEXT NOT NULL, emoji TEXT,
					  	feedback_id INTEGER NOT NULL,  question_id INTEGER NOT NULL, logic_to INTEGER)`, [])

					  	tx.executeSql(`CREATE TABLE IF NOT EXISTS matrixs (id INTEGER, emoji TEXT NOT NULL, matrix TEXT,
					  	question_id INTEGER NOT NULL)`, [])

					  	tx.executeSql(`CREATE TABLE IF NOT EXISTS sliders (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
					    question_id INTEGER NOT NULL, left TEXT NOT NULL, right TEXT NOT NULL, label TEXT )`, [])

					    tx.executeSql(`CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, multiple_choice TEXT,
					    matrix TEXT, slider TEXT, range TEXT, suggestion TEXT, email TEXT, number TEXT, shorttext TEXT, nps TEXT, feedback_id INTEGER )`, [])

					    tx.executeSql(`CREATE TABLE IF NOT EXISTS questions (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
					  	feedback_question TEXT NOT NULL, type INTEGER NOT NULL,
					  	feedback_id INTEGER NOT NULL,  answer_count INTEGER, isLogic TEXT, recieved_logic INTEGER)`, [])
					  },
					  function (tx) {
				        console.log('error on table create: ' + tx.message);
				      }
			     )

				  var params = {
				  	 preloader: false,
				  	 message:'Creating database'
				  }

				  /** Set loading */
			      commit('setLoading', params)
			      resolve()
		})
	},

	/**
	 * ************************************************************
	 * Drop all localdatabases
	 * ************************************************************
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @param  {[type]} db               [description]
	 * @return {[type]}                  [description]
	 * ************************************************************
	 */
	async dropDatabase({commit, dispatch}, db) {
	   return new Promise(( resolve, reject ) => {
          console.log('droping database...')
          var params = {
		  	 preloader: true,
		  	 message:'Reloading database'
	      }
	      db.transaction(function(tx){
		      tx.executeSql('DROP TABLE IF EXISTS feedbacks')
		      tx.executeSql('DROP TABLE IF EXISTS questions')
		      tx.executeSql('DROP TABLE IF EXISTS answers')
		      tx.executeSql('DROP TABLE IF EXISTS matrixs')
		      tx.executeSql('DROP TABLE IF EXISTS sliders')
		   })

	       commit('setLoading', params)
   		   resolve()
	    })
	},

	/**
	 * *********************************************************
	 * this funcion recreate local database for offline storage
	 * *********************************************************
	 * @param  {[type]} options.coWWmmit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @param  {[type]} db               [description]
	 * @return {[type]}                  [description]
	 * *********************************************************
	 */
	async reCreateDatabases({ commit, dispatch }, db) {
		var user_id = localStorage.getItem('user_id')
		return dispatch('dropDatabase', db).then(() => {
			 dispatch('creatingDatabase')
		})
	},

	/**
	 * ************************************************
	 * [reloadingQuestionAnswer description]
	 * ************************************************
	 * @param  {[type]} options.commit   [description]
	 * @param  {[type]} options.dispatch [description]
	 * @param  {[type]} db               [description]
	 * @return {[type]}                  [description]
	 * ***********************************************
	 */
	reloadingQuestionAnswer({commit, dispatch}, db) {
		console.log('loading all question and answer')
		var user_id = localStorage.getItem('user_id')
	},

   /**O
    * ***********************************************
    * This function recreate responses table
    * ************************************************
    * @param  {[type]} options.commit   [description]
    * @param  {[type]} options.dispatch [description]ss
    * @param  {[type]} db               [description]
    * @return {[type]}                  [description]
    */
	dropResponseTable({commit, dispatch}) {
		var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
		db.transaction(function(tx) {
			tx.executeSql('DROP TABLE IF EXISTS responses')
		    tx.executeSql(`CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, multiple_choice TEXT,
		    matrix TEXT, slider TEXT, range TEXT, suggestion TEXT, email TEXT, number TEXT, shorttext TEXT, nps TEXT, feedback_id INTEGER )`, [])
		})
	}

}

  
// dropResponseTable({commit, dispatch}) {
// 		var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
// 		db.transaction(function(tx) {
// 			tx.executeSql('DROP TABLE IF EXISTS responses', [], 

// 		     function(tx, results){
// 				console.log('droping response database')
// 			 },
// 			 function (tx, error){
// 			 	alert('working')
// 			 	console.log('Error: '+error.message)
// 			 	tx.executeSql(`CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, multiple_choice TEXT, matrix TEXT, slider TEXT, range TEXT, suggestion TEXT, email TEXT, number TEXT, shorttext TEXT, nps TEXT, feedback_id INTEGER )`, [])
// 			 }
// 			)
// 		})
// 	}

// }


const mutations = {

  /**
   * **************************************
   * [startLoading description]
   * **************************************
   * @param  {[type]} state   [description]
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  startLoading(state, message) {
    state.isLoading = true
  },

  /**
   * *************************************
   * [stopLoading description]
   * *************************************
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  stopLoading(state) {
    state.isLoading = false
  },

  /**
   * ***********************************
   * [setLoad description]
   * ***********************************
   * @param {[type]} state [description]
   */
  setLoad(state) {
  	state.isLoadSuccessfully = true
  },

  /**
   * ************************************
   * [unsetLoad description]
   * ************************************
   * @param  {[type]} state [description]
   * @return {[type]}       [description]
   */
  unsetLoad(state) {
  	state.isLoadSuccessfully = false
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}