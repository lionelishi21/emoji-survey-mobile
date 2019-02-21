
export default {
  methods: {
    startDatabase: function () {
      console.log('creating database')
   	  var db
      db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
      console.log(db)
      this.db = db
      this.getSelectedSurvey(db)
    },
    getSelectedSurvey (dbase) {
      var database = dbase
      this.user_id = localStorage.getItem('user_id')
      this.$http.get('https://happyreply.com/api/get-surveys?user_id='+this.user_id)
        .then(response => {
          return response.json()
        }).then(data => {
          for (let key in data) {
            this.saveSurvey(data[key]['feedback_id'], data[key]['feedback_title'], data[key]['feedback_description'])
            this.feedback_id = data[key]['feedback_id']
            this.feedback_title = data[key]['feedback_title']
            this.feedback_desc = data[key]['feedback_description']
          }
        })
      // Fetch infromation in sqllite database
      dbase.transaction(this.queryFeedbackDatabase, this.errorHandler);
      this.getSurveyQuestions(database)
    },
    getSurveyQuestions (dbase) {
      dbase.transaction(this.createQuestionsDatabase, this.errorHandler)
      this.$http.get('https://happyreply.com/api/get-questions-by-feedback-id?user_id=' + this.user_id)
        .then(response => {
          return response.json()
        }).then(data => {
          const resultArray = []

          for (let key in data) {
            console.log(data)
            resultArray.push(data[key])
            this.saveQuestions(data[key]['id'], data[key]['type'], data[key]['feeback_question'], data[key]['feedback_id'])
          }
          this.surveys = resultArray
        })
      dbase.transaction(this.queryQuestionDatabase, this.errorHandler)
      // this.getSurveyAnswers(dbase)
    },
    getSurveyAnswers (dbase) {
      dbase.transaction(this.createAnswerDatabase, this.errorHandler)
      this.$http.get('https://happyreply.com/api/get-answers-by-feedback-id?user_id=' + this.user_id)
          .then(response => {
            return response.json()
          }).then(data => {
            const resultArray = []
            console.log(data)
            dbase.transaction(this.createAnswerDatabase, this.errorHandler)
            for (let key in data) {
              resultArray.push(data[key])
              this.saveAnswers(data[key]['id'], data[key]['answer'], data[key]['emoji'], data[key]['feedback_id'], data[key]['question_id'], )
            }
          })
      dbase.transaction(this.queryAnswerDatabase, this.errorHandler)
    },
    getSurveyMatrix () {
      this.$http.get('https://happyreply.com/api/get-matrixs?user_id=' + this.user_id)
          .then(response => {
            return response.json()
          }).then(data => {
            console.log(data)
            this.db.transaction(this.createMatrixDatabase, this.errorHandler)
            for (let key in data) {
              this.saveMatrixs(data[key]['id'], data[key]['emoji'], data[key]['matrix'], data[key]['question_id'])
            }
          })
      this.db.transaction(this.queryMatrixDatabase, this.errorHandler)
    },
    getSurveySlider () {
    	var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
      this.$http.get('https://happyreply.com/api/get-sliders?user_id=' + this.user_id)
          .then(response => {
            return response.json()
          }).then(data => {
            console.log(data)
            this.db.transaction(this.createSliderDatabase, this.errorHandler)
            for (let key in data) {
              this.saveSlider(data[key]['id'], data[key]['question_id'], data[key]['left'], data[key]['right'], data[key]['label'])
            }
          })
      this.db.transaction(this.querySliderDatabase, this.errorHandler)
    },
    createResponseDatabase (tx) {
        tx.executeSql('DROP TABLE IF EXISTS responses')
        tx.executeSql('CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, response TEXT, answer_id INTEGER, matrix INTEGER, question_id INTEGER, feedback_id INTEGER, user TEXT, sync INTEGER, slider INTEGER )', [], this.nullHandler, this.errorHandler)
    },
    createAnswerDatabase(tx) {
      tx.executeSql('DROP TABLE IF EXISTS answers')
      tx.executeSql(`CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL,
	            answer TEXT NOT NULL, emoji TEXT, feedback_id INTEGER NOT NULL,  question_id INTEGER NOT NULL)`, [], this.nullHandler, this.errorHandler)
    },
    createQuestionsDatabase(tx) {
      console.log('creating question database')
      tx.executeSql('DROP TABLE IF EXISTS questions')
      tx.executeSql(`CREATE TABLE IF NOT EXISTS questions (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
	       feedback_question TEXT NOT NULL, type INTEGER NOT NULL, feedback_id INTEGER NOT NULL)`, [], this.nullHandler, this.errorHandler)
    },
  }
}
