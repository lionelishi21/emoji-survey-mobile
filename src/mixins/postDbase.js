export default {
	data() {
		return {
			mix: 'mix_me in',
	  		db: '',
	  		database: 'SurveyDb',
	        version: '1.0',
	        dbDisplay: 'ServeyDatabase',
	        maxSize: 1105535,
		}
	},
	methods: {
		 formSubmit() {
		 var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
          // created response database
          db.transaction(this.createResponseDatabase, this.errorHandler);
          var mc_question = this.mc_responses;
          for (var key in mc_question) {
             // check if the property/key is defined in the object itself, not in parent
             var question_id = key;
             var answer_id   = mc_question[key];
             this.saveResponses('Multiple Choice','', answer_id, question_id, this.feedback_id, '', '', 0);
          }

          var matrix_question = this.matrix_responses;
          for (var key in matrix_question) {
               // check if the property/key is defined in the object itself, not in parent
              if (matrix_question.hasOwnProperty(key)) {
                   var field  = matrix_question[key];
                   console.log(field);
                   var fields = field.split('-');
                   var answer_id = key;
                   var question_id = fields[0];
                   var matrix_id   = fields[1];
                   this.saveResponses('Matrix Question', matrix_id, answer_id, question_id, this.feedback_id, '', '', 0);
              }
          }
          var slider_question = this.slider_questions;
          for (var key in slider_question) {

              if (slider_question.hasOwnProperty(key)) {
                  // this.mcQuestion(key, slider_question[key]);
                   var question_id = key;
                   var slider      = slider_question[key];

                   this.saveResponses('Slider Question','', '', question_id, this.feedback_id, slider, '', 0);
              }
          }
          var suggesstion_question = this.comments_response;
          for (var key in suggesstion_question) {

              if (suggesstion_question.hasOwnProperty(key)) {
                  // this.mcQuestion(key, suggesstion_question[key]);
                  var question_id = key;
                  var comments    = suggesstion_question[key];

                  this.saveResponses(comments, '', '', question_id, this.feedback_id, '', '', 0);
              }
          }
          var range_question = this.range_questions;
          for (var key in range_question) {
            var question_id = key;
            var answer_id   = range_question[key];

            this.saveResponses('Range Questions','', answer_id, question_id, this.feedback_id, '', '', 0);
          }

          this.checkConnection();
          this.$router.push({name: 'Survey'});
        },
        saveResponses(response, matrix, answer_id, question_id, feedback_id, slider, user, sync) {
           var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
	       console.log('Saving responses to local database');
	       db.transaction(function(tx){
	          var sql = 'INSERT INTO responses (response, matrix, answer_id, question_id, feedback_id, slider) VALUES (?,?,?,?,?,?)'
	          tx.executeSql(sql, [response, matrix, answer_id, question_id, feedback_id, slider]);
	       });
	    },

	}
}
