export default {
  method: {
	    createResponseDatabase (tx) {
	       tx.executeSql('DROP TABLE IF EXISTS responses')
	       tx.executeSql('CREATE TABLE IF NOT EXISTS responses (id INTEGER PRIMARY KEY AUTOINCREMENT, response TEXT, answer_id INTEGER, matrix INTEGER, question_id INTEGER, feedback_id INTEGER, user TEXT, sync INTEGER, slider INTEGER )', [], this.nullHandler, this.errorHandler)
	    },
	    dropResponsesDatabase (tx) {
	      console.log('dropping response table after upload to database')
	      tx.executeSql('DROP TABLE IF EXISTS responses')
	    },
	    createSurveyDatabase (tx) {
	      tx.executeSql('DROP TABLE IF EXISTS feedbacks')
	      tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER,
	        feedback_title TEXT, feedback_desc TEXT)`, [], this.nullHandler, this.errorHandler)
	    },
	    createQuestionsDatabase (tx) {
         console.log('creating question database')
	       tx.executeSql('DROP TABLE IF EXISTS questions')
	       tx.executeSql(`CREATE TABLE IF NOT EXISTS questions (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
	       feedback_question TEXT NOT NULL, type INTEGER NOT NULL, feedback_id INTEGER NOT NULL)`, [], this.nullHandler, this.errorHandler)
	    },
	    createAnswerDatabase (tx) {
	        tx.executeSql('DROP TABLE IF EXISTS answers')
	        tx.executeSql(`CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL,
	            answer TEXT NOT NULL, emoji TEXT, feedback_id INTEGER NOT NULL,  question_id INTEGER NOT NULL)`, [], this.nullHandler, this.errorHandler)
	    },
	    createMatrixDatabase (tx) {
	        console.log('creating matrix database')
	        tx.executeSql('DROP TABLE IF EXISTS matrixs')
	        tx.executeSql('CREATE TABLE IF NOT EXISTS matrixs (id INTEGER, emoji TEXT NOT NULL, matrix TEXT, question_id INTEGER NOT NULL)', [], this.nullHandler, this.errorHandler)
	    },
	    createSliderDatabase (tx) {
	       console.log('creating slider database')
	       tx.executeSql('DROP TABLE IF EXISTS sliders')
	       tx.executeSql(`CREATE TABLE IF NOT EXISTS sliders (id INTEGER NOT NULL PRIMARY KEY UNIQUE,
	       question_id INTEGER NOT NULL, left TEXT NOT NULL, right TEXT NOT NULL, label TEXT )`, [], this.nullHandler, this.errorHandler)
	    }
	    // saveSurvey(id, title, desc) {
	    //   var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize);
	    //   db.transaction(function(tx) {
	    //     var sql = 'INSERT INTO feedbacks (feedback_id, feedback_title, feedback_desc) VALUES (?,?,?)';
	    //     tx.executeSql(sql, [id, title, desc]);
	    //   });
	    // },
}
}
