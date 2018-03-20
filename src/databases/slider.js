export default {
  methods: {
    getSurveySliders(user_id) {
      this.db.transaction(this.createSliderDatabase, this.errorHandler)
      this.$http.get('https://happyreply.com/api/get-sliders?user_id=' + user_id)
        .then(response => {
          return response.json()
        }).then(data => {
          console.log(data)
          for (let key in data) {
            this.saveSlider(data[key]['id'], data[key]['question_id'], data[key]['left'], data[key]['right'], data[key]['label'])
          }
        })
    },

    createSliderDatabase (tx) {
      console.log('creating slider database')
      tx.executeSql('DROP TABLE IF EXISTS sliders')
      tx.executeSql(`CREATE TABLE IF NOT EXISTS sliders (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
	       question_id INTEGER NOT NULL, left TEXT NOT NULL, right TEXT NOT NULL, label TEXT )`, [], this.nullHandler, this.errorHandler)
    },
    saveSlider (id, question_id, left, right, label) {
      this.db.transaction(function (tx) {
        var sql = 'INSERT INTO sliders ( id, question_id, left, right, label) VALUES (?,?,?,?,?)';
        tx.executeSql(sql, [id, question_id, left, right, label]);
      })
      this.db.transaction(this.querySliderDatabase, this.errorHandler);
    },
    querySliderDatabase (tx) {
      tx.executeSql('SELECT * FROM sliders;', [], this.renderSlider, this.errorHandler)
    },
    renderSlider (tx, results) {
      var len = results.rows.length;
      var resultsArray = [];
      for (var i = 0; i < len; i++) {
        // console.log(results.rows.item(i).id);
        var res = {
          id: results.rows.item(i).id,
          question_id: results.rows.item(i).question_id,
          left: results.rows.item(i).left,
          right: results.rows.item(i).right,
          label: results.rows.item(i).label
        }
        resultsArray.push(res);
      }
      this.$store.commit('addToSlider', resultsArray)
    },

  }
}
