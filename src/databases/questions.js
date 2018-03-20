export default {
  methods: {
    getSurveyQuestionCount () {
      this.db.transaction(this.createQuestionsDatabase, this.errorHandler)
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
          var survey_count = resultArray.length
          this.$store.commit('countQuestion', survey_count)
        })
    },
    createQuestionsDatabase (tx) {
      console.log('creating question database')
      tx.executeSql('DROP TABLE IF EXISTS questions')
      tx.executeSql(`CREATE TABLE IF NOT EXISTS questions (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
	       feedback_question TEXT NOT NULL, type INTEGER NOT NULL, feedback_id INTEGER NOT NULL)`, [], this.nullHandler, this.errorHandler)
    },
    saveQuestions (id, type, feedback_question, feedback_id) {
      this.db.transaction(function (tx) {
        var sql = 'INSERT INTO questions ( id, type, feedback_question, feedback_id ) VALUES (?,?,?,?)';
        tx.executeSql(sql, [id, type, feedback_question, feedback_id]);
      });
    },
    getSurveyQuestions () {
        this.db.transaction(this.queryQuestionDatabase, this.errorHandler);
    },
    queryQuestionDatabase (tx) {
      console.log('getting all questions');
      tx.executeSql('SELECT * FROM questions;', [], this.renderQuestions, this.errorHandler);
    },
    renderQuestions (tx, results) {
      var len = results.rows.length;
      var resultsArray = [];
      for (var i = 0; i < len; i++) {
        var res = { id: results.rows.item(i).id, question: results.rows.item(i).feedback_question, type: results.rows.item(i).type, feedback_id: results.rows.item(i).feedback_id }
        resultsArray.push(res);
      }
      this.$store.commit('addToQuestion', resultsArray)
    }
  }
}
