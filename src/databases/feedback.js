export default {
  methods: {
    loadTitle () {
      this.user_id = localStorage.getItem('user_id')
      this.$http.get('https://happyreply.com/api/get-surveys?user_id=' + this.user_id)
        .then(response => {
          return response.json()
        }).then(data => {
          console.log(data)
          this.db.transaction(this.createSurveyDatabase, this.errorHandler)
          for (let key in data) {
            this.saveSurvey(data[key]['feedback_id'], data[key]['feedback_title'], data[key]['feedback_description'])
          }
          this.loadQuestions()
        })
    },
    getSurveyTitle () {
      this.db.transaction(this.queryFeedbackDatabase, this.errorHandler)
    },
    createSurveyDatabase (tx) {
      tx.executeSql('DROP TABLE IF EXISTS feedbacks')
      tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER,
	        feedback_title TEXT, feedback_desc TEXT)`, [], this.nullHandler, this.errorHandler)
    },
    saveSurvey (id, title, desc) {
      this.db.transaction(function (tx) {
        var sql = 'INSERT INTO feedbacks (feedback_id, feedback_title, feedback_desc) VALUES (?,?,?)';
        tx.executeSql(sql, [id, title, desc]);
      });
    },
    queryFeedbackDatabase (tx) {
      tx.executeSql('SELECT * FROM feedbacks;', [], this.renderFeedback, this.errorHandler);
    },
    renderFeedback (tx, results) {
      console.log('rendering feedback information')
      var len = results.rows.length;

      var resultsArray = [];
      for (var i = 0; i < len; i++) {
        var res = { feedback_id: results.rows.item(i).feedback_id, feedback_title: results.rows.item(i).feedback_title, feedback_desc: results.rows.item(i).feedback_desc }
        resultsArray.push(res);
      }
      this.$store.commit('addToFeedback', resultsArray)
    }
  }
}
