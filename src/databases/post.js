import { VueOnline } from 'vue-online'
export default {
  data(){
    return {
      // button: {
      //   loading: false,
      //   'dataStyle': 'expand-left',
      //   progress: 0,
      // },
    }
  },
  methods: {
    createResponseDatabase () {
      this.db.transaction(this.createDatabaseResponses, this.nullHandler)
    },
    getSurveyResponse () {
      this.db.transaction(this.queryResponsesDatabase, this.nullHandler)
    },
    createDatabaseResponses (tx) {
      console.log('create')
      tx.executeSql('CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, multiple_choice TEXT, matrix TEXT, slider TEXT, range TEXT, suggestion TEXT, feedback_id INTEGER )')
    },
    dropResponsesDatabase (tx) {
      console.log('dropping response table after upload to database')
      tx.executeSql('DROP TABLE IF EXISTS responses')
    },
    saveOfflineUpdate (multpleChoice, matrix, slider, range, comments, fbId) {
      var mc = JSON.stringify(multpleChoice)
      var matrixAnswers = JSON.stringify(matrix)
      var sliderAnswers = JSON.stringify(slider)
      var rangeAnswers = JSON.stringify(range)
      var commentsAnswers = JSON.stringify(comments)

      this.db.transaction(function (tx) {
        var sql = 'INSERT INTO responses (multiple_choice, matrix, slider, range, suggestion, feedback_id) VALUES (?,?,?,?,?,?)'
        tx.executeSql(sql, [mc, matrixAnswers, sliderAnswers, rangeAnswers, commentsAnswers, fbId])
      })

    },
    postResponse (response, answer_id, question_id, feedback_id, matrix, slider) {
      console.log('saving to server')
      this.$http
        .get('https://happyreply.com/post-survey-responses?response=' + response + '&answer_id=' + answer_id + '&question_id=' + question_id + '&feedback_id=' + feedback_id + '&matrix=' + matrix + '&slider=' + slider)
        .then(response => {
          this.success = true;
          this.connectionStatus = 'true';
        }, response => {
          this.success = false;
        })
    },
    newSaveResponse (multpleChoice, matrix, slider, range, comments, fbId) {
    
        this.newPostResponse(multpleChoice, matrix, slider, range, comments, fbId, false)
        // this.saveOfflineUpdate(multpleChoice, matrix, slider, range, comments, fbId)
    },
    newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, fbId, offline) {
      var action = 'https://happyreply.com/post-survey-responses2'
      var csrfToken = $('meta[name=csrf-token]').attr('content')
      // this.loadButton.loading = true
      this.button.loading = true;
      this.$http.post(action,
        { params:
           {
              feedback_id: fbId,
              mc: mcArray,
              matrix: matrixArray,
              slider: sliderArray,
              range: rangeArray,
              comment: commentArray }
           },
         {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        })
        .then(response => {
          if (offline == 'ture') {
            this.db.transaction(this.dropResponsesDatabase, this.nullHandler);
          }
          this.button.loading = false
          this.$router.push({ name: 'Completed', params: { id: fbId } })
        }, response => {
          this.saveOfflineUpdate(mcArray, matrixArray, sliderArray, rangeArray, commentArray, fbId)
          this.button.loading = false;
          this.$router.push({ name: 'Completed', params: { id: fbId } })
        });
    },

    queryResponsesDatabase (tx) {
      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses, this.errorHandler)
    },
    renderResponses (tx, results) {
      var len = results.rows.length;
      var resultsArray = []

      for (var i = 0; i < len; i++) {
        var response = results.rows.item(i).response
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

        resultsArray.push(res)
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
      this.loadButton.loading = true
      this.db.transaction(this.queryResponsesDatabase1, this.errorHandler)

    },
    queryResponsesDatabase1 (tx) {
      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses1, this.errorHandler)
    },
    renderResponses1 (tx, results) {
      var len = results.rows.length
      for (var i = 0; i < len; i++) {
        var mcArray = ''
        var matrixArray = ''
        var sliderArray = ''
        var rangeArray = ''
        var commentArray = ''

        if (results.rows.item(i).multiple_choice != '{}') {
          mcArray = JSON.parse(results.rows.item(i).multiple_choice)
        }

        if (results.rows.item(i).matrix != '{}') {
          matrixArray = JSON.parse(results.rows.item(i).matrix)
        }

        if (results.rows.item(i).slider != '{}') {
          sliderArray = JSON.parse(results.rows.item(i).slider)
        }

        if (results.rows.item(i).range != '{}') {
          rangeArray = JSON.parse(results.rows.item(i).range)
        }

        if (results.rows.item(i).range != '{}') {
          commentArray = JSON.parse(results.rows.item(i).suggestion)
        }
        var feedbackId = results.rows.item(i).feedback_id;
        this.newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, feedbackId, true)
      }
    }
  }
}
