export default {
  methods: {
 	 queryFeedbackDatabase(tx) {
        tx.executeSql('SELECT * FROM feedbacks;',[], this.renderFeedback, this.errorHandler);
    },
    queryQuestionDatabase(tx) {
      console.log('getting all questions');
        tx.executeSql('SELECT * FROM questions;',[],this.renderQuestions,this.errorHandler);
    },
    queryAnswerDatabase(tx) {
        tx.executeSql('SELECT * FROM answers;',[],this.renderAnswers,this.errorHandler);
    },
    queryMatrixDatabase(tx) {
        tx.executeSql('SELECT * FROM matrixs;',[],this.renderMatrixs,this.errorHandler)
    },
    querySliderDatabase(tx) {
        tx.executeSql('SELECT * FROM sliders;',[],this.renderSlider,this.errorHandler)
    },
    renderFeedback(tx, results) {
      var len = results.rows.length;
      var resultsArray = [];
      for (var i = 0; i < len; i++) {
        var res = { feedback_id: results.rows.item(i).feedback_id, feedback_title: results.rows.item(i).feedback_title, feedback_desc: results.rows.item(i).feedback_desc }
        resultsArray.push(res);
        this.feedback_title = results.rows.item(i).feedback_title;
        this.feedback_desc  = results.rows.item(i).feedback_desc;
        this.feedback_id    = results.rows.item(i).feedback_id;
      }
    },
    renderQuestions(tx, results) {
      var len = results.rows.length;
      var resultsArray = [];
      for (var i=0; i<len; i++){
          var res = {id: results.rows.item(i).id, question: results.rows.item(i).feedback_question, type: results.rows.item(i).type, feedback_id: results.rows.item(i).feedback_id }
          resultsArray.push(res);
      }
      this.survey.questions = resultsArray;
    },
    renderAnswers(tx, results) {
	   var len = results.rows.length;
	   var resultsArray = [];
	   for (var i=0; i<len; i++){
	        var res = {id: results.rows.item(i).id, answer: results.rows.item(i).answer, emoji: results.rows.item(i).emoji, feedback_id: results.rows.item(i).feedback_id, question_id: results.rows.item(i).question_id }
	        resultsArray.push(res);
	   }
	   this.survey.answers = resultsArray;
    },
    renderMatrixs(tx, results) {
          var len = results.rows.length;
          var resultsArray = [];
          for (var i=0; i<len; i++){
              var res = {id: results.rows.item(i).id, matrix: results.rows.item(i).matrix, emoji: results.rows.item(i).emoji, question_id: results.rows.item(i).question_id }
              resultsArray.push(res);
          }
          this.survey.matrixs = resultsArray;
    },
	    renderSlider(tx, results) {
	        var len = results.rows.length;
	        var resultsArray = [];
	        for (var i=0; i<len; i++){
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
	        // console.log(resultsArray)
	        this.survey.sliders = resultsArray;
	    },
	     queryResponsesDatabase(tx) {
	        tx.executeSql('SELECT * FROM responses;',[],this.renderResponses,this.errorHandler)
	    },
	    renderResponses(tx, results) {
	        var len = results.rows.length;
	        console.log(results.rows.length)
	        var resultsArray = [];
	        this.amount_answer = len;

	        for (var i=0; i<len; i++){

	            var response    = results.rows.item(i).response;
	            var answer_id   = results.rows.item(i).answer_id;
	            var question_id = results.rows.item(i).question_id;
	            var feedback_id = results.rows.item(i).feedback_id;
	            var matrix      = results.rows.item(i).matrix;
	            var slider      = results.rows.item(i).slider;
	            console.log('post');
	            this.postResponse(response, answer_id, question_id, feedback_id, matrix, slider);
	        }


	    },
	}
}
