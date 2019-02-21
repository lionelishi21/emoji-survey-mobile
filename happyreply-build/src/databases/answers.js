export default {
  methods: {
    loanAnswers () {
      this.$http.get('https://happyreply.com/api/get-answers-by-feedback-id?user_id=' + this.user_id)
        .then(response => {
          return response.json()
        }).then(data => {
          const resultArray = []
          console.log(data)
          this.db.transaction(this.createAnswerDatabase, this.errorHandler)
          for (let key in data) {
            resultArray.push(data[key])
            this.saveAnswers(data[key]['id'], data[key]['answer'], data[key]['emoji'], data[key]['feedback_id'], data[key]['question_id'], )
          }
          this.loadMatrixes()
          // var survey_count = resultArray.length
          // this.$store.commit('countAnswer', survey_count)
        })
    },
    getSurveyAnswers () {
      this.db.transaction(this.queryAnswerDatabase, this.errorHandler)
    },
    createAnswerDatabase (tx) {
      tx.executeSql('DROP TABLE IF EXISTS answers')
      tx.executeSql(`CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL,
	            answer TEXT NOT NULL, emoji TEXT, feedback_id INTEGER NOT NULL,  question_id INTEGER NOT NULL)`, [], this.nullHandler, this.errorHandler)
    },
    saveAnswers (id, answer, emoji, feedback_id, question_id) {
      this.db.transaction(function (tx) {
        var sql = 'INSERT INTO answers ( id, answer, emoji, feedback_id, question_id ) VALUES (?,?,?,?,?)';
        tx.executeSql(sql, [id, answer, emoji, feedback_id, question_id]);
      })
    },
    queryAnswerDatabase (tx) {
      tx.executeSql('SELECT * FROM answers;', [], this.renderAnswers, this.errorHandler);
    },
    renderAnswers (tx, results) {
      console.log('getting all answers');
      var len = results.rows.length
      var resultsArray = [];
      for (var i = 0; i < len; i++) {
        var res = { id: results.rows.item(i).id, answer: results.rows.item(i).answer, emoji: results.rows.item(i).emoji, feedback_id: results.rows.item(i).feedback_id, question_id: results.rows.item(i).question_id }
        resultsArray.push(res);
      }
      this.$store.commit('addToAnswer', resultsArray)
      this.$store.commit('countAnswer', len)
    }
  }
}
