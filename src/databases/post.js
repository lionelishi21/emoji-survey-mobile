import { VueOnline } from 'vue-online'
export default {
  data(){
    return {
      button: {
        loading: false,
        'dataStyle': 'expand-left',
        progress: 0,
      },
    }
  },
  methods: {
    createResponseDatabase () {
      this.db.transaction(this.createDatabase, this.nullHandler)
    },
    getSurveyResponse () {
      console.log('question query response')
      this.db.transaction(this.queryResponsesDatabase, this.nullHandler)
    },
    createDatabase (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, response TEXT, answer_id INTEGER, matrix INTEGER, question_id INTEGER, feedback_id INTEGER, user TEXT, question_type INTEGER, slider INTEGER )', [], this.nullHandler, this.errorHandler)
    },
    dropResponsesDatabase (tx) {
      console.log('dropping response table after upload to database')
      tx.executeSql('DROP TABLE IF EXISTS responses')
    },
    saveResponses (response, matrix, answer_id, question_id, feedback_id, slider, user, sync) {
      // var check = VueOnline.isOnline;
      console.log('saving response')
      this.createResponseDatabase()
      this.db.transaction(function (tx) {
        var sql = 'INSERT INTO responses (response, matrix, answer_id, question_id, feedback_id, slider) VALUES (?,?,?,?,?,?)'
        tx.executeSql(sql, [response, matrix, answer_id, question_id, feedback_id, slider]);
      });

    },
    saveOffline (mcQuestion, matrixQuestion, sliderQuestion, rangeQuestion, suggesstionQuestion) {
        var mc_question = mcQuestion
        for (var key in mc_question) {
          // check if the property/key is defined in the object itself, not in parent
          var question_id = key;
          var answer_id = mc_question[key];
          this.saveResponses('Multiple Choice', '', answer_id, question_id, fb_id, '', '', 0);
        }

      var matrix_question = matrixQuestion;
        for (var key in matrix_question) {
          // check if the property/key is defined in the object itself, not in parent
          if (matrix_question.hasOwnProperty(key)) {
            var field = matrix_question[key];
            console.log(field);
            var fields = field.split('-');
            var answer_id = key;
            var question_id = fields[0];
            var matrix_id = fields[1];
            this.saveResponses('Matrix Question', matrix_id, answer_id, question_id, fb_id, '', '', 0);
          }
        }

      var slider_question = sliderQuestion;
        for (var key in slider_question) {
          if (slider_question.hasOwnProperty(key)) {
            // this.mcQuestion(key, slider_question[key]);
            var question_id = key;
            var slider = slider_question[key];
            this.saveResponses('Slider Question', '', '', question_id, fb_id, slider, '', 0);
          }
        }

      var suggesstion_question = suggesstionQuestion;
        for (var key in suggesstion_question) {
          if (suggesstion_question.hasOwnProperty(key)) {
            // this.mcQuestion(key, suggesstion_question[key]);
            var question_id = key;
            var comments = suggesstion_question[key];
            this.saveResponses(comments, '', '', question_id, fb_id, '', '', 0);
          }
        }

      var range_question = rangeQuestion;
        for (var key in range_question) {
          var question_id = key;
          var answer_id = range_question[key];
          this.saveResponses('Range Questions', '', answer_id, question_id, fb_id, '', '', 0);
        }
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
      var check = VueOnline.isOnline;
      if (check == true) {
        this.newPostResponse(multpleChoice, matrix, slider, range, comments, fbId)
      }
    },
    newPostResponse (mcArray, matrixArray, sliderArray, rangeArray, commentArray, fbId) {
      var action = 'https://happyreply.com/post-survey-responses2'
      var csrfToken = $('meta[name=csrf-token]').attr('content')
      // this.loadButton.loading = true
      this.button.loading = true;


      this.$http.post(action, { params:
          {
            feedback_id: fbId,
            mc: mcArray,
            matrix: matrixArray,
            slider: sliderArray,
            range: rangeArray,
            comment: commentArray } },
         {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        })
        .then(function (data) {
          // let obj = {
          //   title: 'Thank for your feedback we love you!',
          //   type: 'info',
          //   customIconUrl: '/static/veryhappy.svg',
          //   onClose: this.onClose
          // }
          // this.$refs.simplert.openSimplert(obj)

           this.$router.push({ name: 'Survey' })
           location.reload()
          // setTimeout(this.afterSubmit(), 5000)
          // this.loadButton.loading = false
          this.button.loading = false
        })
        .catch(function (data, status, request) {
          // this.loadButton.loading = false
          this.button.loading = false;
        });

    },
    afterSubmit (){

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
      // this.loadButton.loading = false
    },
    queryResponsesDatabase1 (tx) {
      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses1, this.errorHandler)
    },
    renderResponses1 (tx, results) {
      var len = results.rows.length;
      var resultsArray = [];
      var mcArray = [];
      var matrixArray = [];
      var sliderArray = [];
      var rangeArray = [];
      var commentArray = [];

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

        /**Save Multiple choice answer in array */
        if (results.rows.item(i).question_type === 1) {
          var mcResults = {
            question_id: results.rows.item(i).answer_id
          }
          mcArray.push(mcResults)
        }

        /** Save Matrix answer in array */
        if (results.rows.item(i).question_type === 2) {
          var matrixResults = {
            answer_id: question_id + '-' + matrix
          }
          matrixArray.push(matrixResults)
        }

        /**Save Comment Answers */
        if (results.rows.item(i).question_type === 3) {
          var commentResults = {
            question_id: response
          }
          commentArray.push(commentResults)
        }

        /**Save slider question */
        if (results.rows.item(i).question_type === 4) {
          var sliderResults = {
            question_id: slider
          }

          sliderArray.push(sliderResults)
        }

        /**Save range answer in array */
        if (results.rows.item(i).question_type === 5) {
          var rangeResults = {
            question_id: results.rows.item(i).answer_id
          }
          rangeArray.push(rangeResults)
        }

        var res = {
          response: results.rows.item(i).response,
          answer_id: results.rows.item(i).answer_id,
          question_id: results.rows.item(i).question_id,
          feedback_id: results.rows.item(i).feedback_id,
          matrix: results.rows.item(i).matrix,
          slider: results.rows.item(i).slider
        }
        resultsArray.push(res);
        this.newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, this.feedback_id);
      }
      this.db.transaction(this.dropResponsesDatabase, this.nullHandler);
      // this.$swal('Response was successfully send to the server');
    }
  }
}
