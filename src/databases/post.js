import { VueOnline } from 'vue-online'
export default {
  methods: {
    createResponseDatabase () {
      this.db.transaction(this.createDatabase, this.nullHandler)
    },
    getSurveyResponse () {
      console.log('question query response')
      this.db.transaction(this.queryResponsesDatabase, this.nullHandler)
    },
    createDatabase (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, response TEXT, answer_id INTEGER, matrix INTEGER, question_id INTEGER, feedback_id INTEGER, user TEXT, sync INTEGER, slider INTEGER )', [], this.nullHandler, this.errorHandler)
    },
    dropResponsesDatabase (tx) {
      console.log('dropping response table after upload to database')
      tx.executeSql('DROP TABLE IF EXISTS responses')
    },
    saveResponses (response, matrix, answer_id, question_id, feedback_id, slider, user, sync) {
      var check = VueOnline.isOnline;
      if (check == true) {
        this.postResponse(response, answer_id, question_id, feedback_id, matrix, slider)
      } else {
         console.log('saving response')
         this.createResponseDatabase()
         this.db.transaction(function (tx) {
            var sql = 'INSERT INTO responses (response, matrix, answer_id, question_id, feedback_id, slider) VALUES (?,?,?,?,?,?)'
            tx.executeSql(sql, [response, matrix, answer_id, question_id, feedback_id, slider]);
          });
      }
    },
    postResponse (response, answer_id, question_id, feedback_id, matrix, slider) {
      console.log('saving to server')
      this.$http.get(
        'https://happyreply.com/post-survey-responses?response=' + response + '&answer_id=' + answer_id + '&question_id=' + question_id + '&feedback_id=' + feedback_id + '&matrix=' + matrix + '&slider=' + slider)
        .then(response => {
          this.success = true;
          this.connectionStatus = 'true';
        }, response => {
          this.success = false;
        })

    },
    queryResponsesDatabase (tx) {
      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses, this.errorHandler)
    },
    renderResponses (tx, results) {
      var len = results.rows.length;
      var resultsArray = [];

      for (var i = 0; i < len; i++) {
        var response = results.rows.item(i).response;
        var answer_id = results.rows.item(i).answer_id;
        var question_id = results.rows.item(i).question_id;
        var feedback_id = results.rows.item(i).feedback_id;
        var matrix = results.rows.item(i).matrix;
        var slider = results.rows.item(i).slider;
        var res = {
          response: results.rows.item(i).response,
          answer_id: results.rows.item(i).answer_id,
          question_id: results.rows.item(i).question_id,
          feedback_id: results.rows.item(i).feedback_id,
          matrix: results.rows.item(i).matrix,
          slider: results.rows.item(i).slider
        }
        resultsArray.push(res);
        // this.postResponse(response, answer_id, question_id, feedback_id, matrix, slider);
      }
      this.$store.commit('addToResponse', resultsArray)
      this.$store.commit('countResponse', len)
    },

     postResponse1(response, answer_id, question_id, feedback_id, matrix, slider) {
      console.log('saving to server')
      this.$http.get(
        'https://happyreply.com/post-survey-responses?response=' + response + '&answer_id=' + answer_id + '&question_id=' + question_id + '&feedback_id=' + feedback_id + '&matrix=' + matrix + '&slider=' + slider)
        .then(response => {
          this.success = true;
          this.connectionStatus = 'true';
        }, response => {
          this.success = false;
        })

    },
    postResponseOffline () {
      this.button.loading = true
      this.db.transaction(this.queryResponsesDatabase1, this.errorHandler)
    },
    queryResponsesDatabase1 (tx) {
      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses1, this.errorHandler)
      // this.db.transaction(this.dropResponsesDatabase, this.nullHandler)
    },
    renderResponses1 (tx, results) {
      var len = results.rows.length;
      var resultsArray = [];

      for (var i = 0; i < len; i++) {
        var response = results.rows.item(i).response;
        var answer_id = results.rows.item(i).answer_id;
        var question_id = results.rows.item(i).question_id;
        var feedback_id = results.rows.item(i).feedback_id;
        var matrix = results.rows.item(i).matrix;
        var slider = results.rows.item(i).slider;
        var res = {
          response: results.rows.item(i).response,
          answer_id: results.rows.item(i).answer_id,
          question_id: results.rows.item(i).question_id,
          feedback_id: results.rows.item(i).feedback_id,
          matrix: results.rows.item(i).matrix,
          slider: results.rows.item(i).slider
        }
        resultsArray.push(res);
        this.postResponse1(response, answer_id, question_id, feedback_id, matrix, slider);
      }
      this.db.transaction(this.dropResponsesDatabase, this.nullHandler);
      this.button.loading = true
      this.$swal('Response was successfully send to the server');
    }
  }
}
