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
     saveQuestions(id, type, feedback_question, feedback_id) {
      var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
      db.transaction(function(tx) {
           var sql = 'INSERT INTO questions ( id, type, feedback_question, feedback_id ) VALUES (?,?,?,?)';
           tx.executeSql(sql, [id, type, feedback_question, feedback_id]);
      });
    },
   saveAnswers(id, answer, emoji, feedback_id, question_id) {
    var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
        db.transaction(function(tx){
             var sql = 'INSERT INTO answers ( id, answer, emoji, feedback_id, question_id ) VALUES (?,?,?,?,?)';
             tx.executeSql(sql, [id, answer, emoji, feedback_id, question_id]);
        });
    },
    saveMatrixs(id, emoji, matrix, question_id) {
      var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
        db.transaction(function(tx){
             var sql = 'INSERT INTO matrixs ( id, emoji, matrix, question_id) VALUES (?,?,?,?)';
             tx.executeSql(sql, [id, emoji, matrix, question_id]);
        });
    },
    saveSlider(id, question_id, left, right, label){
        console.log('Saving silder question to database');
      var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
        db.transaction(function(tx){
            var sql = 'INSERT INTO sliders ( id, question_id, left, right, label) VALUES (?,?,?,?,?)';
            tx.executeSql(sql, [id, question_id,left,right, label]);
        })
    },
    saveSurvey(id, title, desc) {
	      var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
	      db.transaction(function(tx) {
	        var sql = 'INSERT INTO feedbacks (feedback_id, feedback_title, feedback_desc) VALUES (?,?,?)';
	        tx.executeSql(sql, [id, title, desc]);
	      });
	    }
  }
}
