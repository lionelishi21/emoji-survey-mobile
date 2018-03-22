export default {
  methods: {
    getSurveyMatrixCount () {
      this.db.transaction(this.createMatrixDatabase, this.errorHandler)
      this.$http.get('https://happyreply.com/api/get-matrixs?user_id=' + this.user_id)
        .then(response => {
          return response.json()
        }).then(data => {
          console.log(data)
          for (let key in data) {
            this.saveMatrixs(data[key]['id'], data[key]['emoji'], data[key]['matrix'], data[key]['question_id'])
          }
        })
      this.button.loading = false;
    },
    getSurveyMatrix () {
      this.db.transaction(this.queryMatrixDatabase, this.errorHandler)
    },
    createMatrixDatabase (tx) {
      console.log('creating matrix database')
      tx.executeSql('DROP TABLE IF EXISTS matrixs')
      tx.executeSql('CREATE TABLE IF NOT EXISTS matrixs (id INTEGER, emoji TEXT NOT NULL, matrix TEXT, question_id INTEGER NOT NULL)', [], this.nullHandler, this.errorHandler)
    },
    saveMatrixs (id, emoji, matrix, question_id) {
      this.db.transaction(function (tx) {
        var sql = 'INSERT INTO matrixs ( id, emoji, matrix, question_id) VALUES (?,?,?,?)';
        tx.executeSql(sql, [id, emoji, matrix, question_id]);
      });
    },
    queryMatrixDatabase (tx) {
      tx.executeSql('SELECT * FROM matrixs;', [],this.renderMatrixs, this.errorHandler)
    },
    renderMatrixs (tx, results) {
      var len = results.rows.length;
      var resultsArray = [];
      for (var i = 0; i < len; i++) {
        var res = { id: results.rows.item(i).id, matrix: results.rows.item(i).matrix, emoji: results.rows.item(i).emoji, question_id: results.rows.item(i).question_id }
        resultsArray.push(res);
      }

      this.$store.commit('addToMatrix', resultsArray)
      this.$store.commit('countMatrix', len)
    }
  }
}
