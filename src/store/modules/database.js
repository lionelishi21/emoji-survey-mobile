const state = {
	isDroping: false,
	isLoading: false,
	isLoadSuccessfully: false
}

const getters = {
	getDatabaseStatus: state => state.isDroping,
	isLoading: state => state.isLoading,
	isLoadSuccessfully: state => state.isLoadSuccessfully
}

const actions = {
	creatingDatabase({commit, dispatch}, db) {
	  db.transaction(function (tx) {

	  	tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER, feedback_title TEXT, 
	  	feedback_desc TEXT, feedback_slug Text)`, [])

	  	tx.executeSql(`CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL, answer TEXT NOT NULL, emoji TEXT, 
	  	feedback_id INTEGER NOT NULL,  question_id INTEGER NOT NULL, logic_to INTEGER)`, [])

	  	tx.executeSql(`CREATE TABLE IF NOT EXISTS matrixs (id INTEGER, emoji TEXT NOT NULL, matrix TEXT,
	  	question_id INTEGER NOT NULL)`, [])

	  	tx.executeSql(`CREATE TABLE IF NOT EXISTS sliders (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
	    question_id INTEGER NOT NULL, left TEXT NOT NULL, right TEXT NOT NULL, label TEXT )`, [])

	    tx.executeSql(`CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, multiple_choice TEXT, 
	    matrix TEXT, slider TEXT, range TEXT, suggestion TEXT, email TEXT, number TEXT, feedback_id INTEGER )`, [])

	    tx.executeSql(`CREATE TABLE IF NOT EXISTS questions (id INTEGER NOT NULL PRIMARY KEY UNIQUE, 
	  	feedback_question TEXT NOT NULL, type INTEGER NOT NULL, 
	  	feedback_id INTEGER NOT NULL,  answer_count INTEGER, isLogic TEXT, recieved_logic INTEGER)`, [])
	  })
	},
	dropDatabase({commit, dispatch}, db) {
	  db.transaction(function(tx){
	      tx.executeSql('DROP TABLE IF EXISTS feedbacks')
	      tx.executeSql('DROP TABLE IF EXISTS questions')
	      tx.executeSql('DROP TABLE IF EXISTS answers')
	      tx.executeSql('DROP TABLE IF EXISTS matrixs')
	      tx.executeSql('DROP TABLE IF EXISTS sliders')
	  })
	},
	reCreateDatabases({commit, dispatch}, db) {
		dispatch('dropDatabase', db)
		dispatch('creatingDatabase', db)
		  // Retrieve
		
	},
	reloadingQuestionAnswer({commit, dispatch}, db) {
		console.log('loading all question and answer')
		var user_id = localStorage.getItem('user_id')
		
	}
}

const mutations = {
  startLoading(state) {
    state.isLoading = true
  },
  stopLoading(state) {
    state.isLoading = false
  },
  setLoad(state) {
  	state.isLoadSuccessfully = true
  },
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