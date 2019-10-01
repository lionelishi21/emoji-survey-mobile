import { VueOnline } from 'vue-online'
export default {
  data(){
    return {
      url: ''
      // button: {
      //   loading: false,
      //   'dataStyle': 'expand-left',
      //   progress: 0,
      // },
    }
  },
  created() {
     this.url = localStorage.getItem("url")
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
    saveOfflineUpdate (multpleChoice, matrix, slider, range, comments, email, number, shorttext, fbId, db) {

      var mc = JSON.stringify(multpleChoice)
      var matrixAnswers = JSON.stringify(matrix)
      var sliderAnswers = JSON.stringify(slider)
      var rangeAnswers = JSON.stringify(range)
      var commentsAnswers = JSON.stringify(comments)
      var emailAnswer = JSON.stringify(email)
      var numberAnswer = JSON.stringify(number)
      var shorttextAnswer = JSON.stringify(shorttext)

      db.transaction(function (tx) {
        var sql = 'INSERT INTO responses (multiple_choice, matrix, slider, range, suggestion, email, number, shorttext, feedback_id) VALUES (?,?,?,?,?,?,?,?,?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          )'
        tx.executeSql(sql, [mc, matrixAnswers, sliderAnswers, rangeAnswers, commentsAnswers, emailAnswer, numberAnswer, shorttextAnswer,  fbId], 
           function (tx, result) {
            console.log("Query Success");
          },
          function (tx, error) {
            console.log("Query Error: " + error.message);
          }

          )
      })

    },
    newSaveResponse (multpleChoice, matrix, slider, range, comments, email, number, shorttext, nps, lat = null, lng = null, fbId, db) {
        this.newPostResponse(multpleChoice, matrix, slider, range, comments, email, number, shorttext, nps, lat, lng, fbId, false, db)
        // this.saveOfflineUpdate(multpleChoice, matrix, slider, range, comments, fbId)
    },
    newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, emailArray, numberArray, shorttextArray, nps, lat, lng, fbId, offline, db) {
      var action = this.url+'/post-survey-responses2'
      var csrfToken = $('meta[name=csrf-token]').attr('content')
      this.$http.post(action,
        { params:
             {
                feedback_id: fbId,
                mc: mcArray,
                matrix: matrixArray,
                slider: sliderArray,
                range: rangeArray,
                comment: commentArray,
                email: emailArray,
                number: numberArray,
                shorttext: shorttextArray,
                nps: nps,
                lat: lat,
                lng: lng,
                customer_email:'',
                tablet: true
               }
           },
         {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          }
        })
        .then(response => {
          console.log(response)

          if (offline == true) {
            var  database = 'SurveyDb';
            var  version = '1.0';
            var  dbDisplay = 'ServeyDatabase';
            var maxSize =  '1105535';

             var db = openDatabase(database, version, dbDisplay, maxSize)
             db.transaction(this.dropResponsesDatabase, this.nullHandler);
          }

          this.$router.push({ name: 'Intro', params: { id: fbId } })

        }, response => {

           var  database = 'SurveyDb';
           var  version = '1.0';
           var  dbDisplay = 'ServeyDatabase';
           var maxSize =  '1105535'

          var db = openDatabase(database, version, dbDisplay, maxSize)
          this.saveOfflineUpdate(mcArray, matrixArray, sliderArray, rangeArray, commentArray,  emailArray, numberArray, shorttextArray, fbId, db)
          this.$router.push({ name: 'Intro', params: { id: fbId } })
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
      }

      this.$store.commit('addToResponse', resultsArray)
      this.$store.commit('countResponse', len)
    },

    /**
     * [postResponse1 description]
     * @param  {[type]} response    [description]
     * @param  {[type]} answer_id   [description]
     * @param  {[type]} question_id [description]
     * @param  {[type]} feedback_id [description]
     * @param  {[type]} matrix      [description]
     * @param  {[type]} slider      [description]
     * @return {[type]}             [description]
     */
    postResponse1(response, answer_id, question_id, feedback_id, matrix, slider) {
      console.log('saving to server')
      this.$http.get(this.url+'/post-survey-responses?response=' + response + '&answer_id=' + answer_id + '&question_id=' + question_id + '&feedback_id=' + feedback_id + '&matrix=' + matrix + '&slider=' + slider)
        .then(response => {
          this.success = true;
          this.connectionStatus = 'true';
        }, response => {
          this.success = false;
        })
    },
    postResponseOffline (db) {
      database.transaction(this.queryResponsesDatabas)

    },
    queryResponsesDatabase1 (tx) {
      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses)
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
        this.newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, feedbackId, true, db)
      }
    }
  }
}
