<template>
<v-app>
<div>
   <v-snackbar
      :timeout="timeout"
      :top="y === 'top'"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      v-model="snackbar"
    >
      {{ text }}
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
 </div>
  <v-container
      fluid
      grid-list-lg
    >
	  <v-layout row wrap>
	    <v-flex xs4>
	    	 <v-row>
			   <v-card class="text-center">
			   	 <v-card-title primary-title>
	              <div>
	                <div class="headline">Offline Responses</div>
	              </div>
	            </v-card-title>
			    <v-card-text>
			      <p class="text-md-center display-4">{{ResponseAmount}}</p>
			      <p class="text-md-center"> Offline Respponse</p>
			      <v-btn :loading="loading" :disabled="loading" v-if="checkResponses()" color="blue-grey" class="white--text"@click="postResponseOffline()">
			          Post Response
			        <v-icon right dark>cloud_upload</v-icon>
			     </v-btn>
			     <v-btn class="btn btn-default" @click="exportResponseToText()">
			     	Export Responses
			     </v-btn>
			    </v-card-text>
			  </v-card>
			 </v-row>
	    </v-flex>
	  </v-layout>
  </v-container>
</v-app>
</template>
<script>
import { mapGetters } from 'vuex';
import VueLadda from 'vue-ladda'
export default {
	components: {
		 'vue-ladda': VueLadda,
	},
    data() {
      return {
      	json_fields: {
      		"data" : "String",
      		"Question" : "String",
      		"Answer" : "String"
      	},
      	json_data: [],
      	text: "",
      	snackbar: false,
        value: 0,
        y: 'top',
        x: null,
        mode: '',
        timeout: 5000,
      	isLoading: false,
      	loading: false,
      	feedback_title: '',
        feedback_desc: '',
        feedback_slug: '',
         button: {
	          loading: false,
	          'dataStyle': 'expand-left',
	          progress: 0,
          },
      	  response_count: 0,
          database: 'SurveyDb',
          version: '1.0',
          dbDisplay: 'ServeyDatabase',
          maxSize: 1105535,
          db: ""
		 }
	  },
	  watch: {
	  	ResponseAmount(value){
	  		this.response_count = this.ResponseAmount
	  	},
	  	feedbackInfo(oldValue, newValue) {
	        this.feedback_title = this.feedbackInfo[0].feedback_title
	        this.feedback_desc = this.feedbackInfo[0].feedback_desc
	        this.feedback_slug = this.feedbackInfo[0].feedback_slug
        }
	  },
	  created() {
	  	this.init()
	  },
	 computed: {
      ...mapGetters([
      	'feedbackInfo',
        'GetAllResponses',
        'ResponseAmount'
      ]),
    },
      methods: {
      	    init() {
		  	 	 var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
		  	 	 this.db = db
		      	 var user_id = localStorage.getItem('user_id')
		      	 this.$store.dispatch('getResponses', db)
		      	 this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
	      	},
	      	checkResponses() {
	      		if (this.ResponseAmount < 1) {
	      			return false
	      		}
	      		return true;
	      	},
	      	exportResponseToText() {
	      		var response_loading = true
	      		this.doc = true
	      		this.postResponseOffline();
	      	},
	      	postResponseOffline () {
	         this.loading = true
	         var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
		     db.transaction(this.getResponsesFromSqlite)
		     this.loading = false;
		    },
		    getResponsesFromSqlite (tx) {
		      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses1)
		    },
			renderResponses1 (tx, results) {
		      var len = results.rows.length
		      console.log('response '+len)
		      for (var i = 0; i < len; i++) {
		        var mcArray = ''
		        var matrixArray = ''
		        var sliderArray = ''
		        var rangeArray = ''
		        var commentArray = ''
		        var emailArray = ''
		        var numberArray = ''
		        var shorttextArray = ''

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

		        if (results.rows.item(i).range != '{}') {
		          emailArray = JSON.parse(results.rows.item(i).email)
		        }

		        if (results.rows.item(i).range != '{}') {
		          numberArray = JSON.parse(results.rows.item(i).number)
		        }

		         if (results.rows.item(i).range != '{}') {
		          shorttextArray = JSON.parse(results.rows.item(i).shorttext)
		        }

		        var feedbackId = results.rows.item(i).feedback_id;
		        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
		       
		        if (this.doc == true) {
		        	this.saveToLocalFile(mcArray, matrixArray, sliderArray, rangeArray, commentArray, emailArray, numberArray, shorttextArray)
		        }  else {
		        	 this.newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, emailArray, numberArray, shorttextArray, feedbackId, true, db)
		        }
		      }
		    },
		    saveToLocalFile(json1, json2, json3, json4 , json5 , json6, json7, json8) {
			    var finalObj = $.merge(json1, json2, json3, json4 , json5 , json6, json7, json8);
			    window.localStorage.setItem('responses', JSON.stringify(finalObj))
			    this.saveFile();
		    },
		    saveFile() {
		    	var data = window.localStorage.getItem('responses')
		    	const blob = new Blob([data],{ type: 'text/plain'})
		    	const e = document.createEvent('MouseEvents');
		        var a = document.createElement('a');
			    a.download = "Happyreply.json";
			    a.href = window.URL.createObjectURL(blob);
			    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
			    e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			    a.dispatchEvent(e);
		    	this.doc = false
		    },
		    newSaveResponse (multpleChoice, matrix, slider, range, comments,number, email, shorttext, fbId, db) {
		        this.newPostResponse(multpleChoice, matrix, slider, range, comments, number, email, shortext, fbId, false, db)
		    },
		    newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, emailArray, numberArray, shorttextArray, fbId, offline, db) {
		      var action = 'https://psoj.happyreply.com/post-survey-responses2'
		      var csrfToken = $('meta[name=csrf-token]').attr('content')
		      // this.loadButton.loading = true
		      // this.button.loading = true;
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
		              shorttext: shorttextArray

		               }
		           },
		         {
		          headers: {
		            'X-CSRF-TOKEN': csrfToken
		          }
		        })
		        .then(response => {
		        	 console.log(response)
		             var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
		             db.transaction(this.dropResponsesDatabase);
		             this.text = 'Response has been succesfully post to the servery'
                     this.snackbar = true;
		             this.loading = false
		        }, response => {
		        	 console.log(response)
		        	//TODO: Snackbar goes here
		            this.text = 'Responses did not post, something wen wrong'
                    this.snackbar = true;
		        	this.loading = false
		        	this.init()
		        });
		    },
		    exportResponseFromSqlite() {
		    	window
		    },
		    dropResponsesDatabase (tx) {
		      console.log('dropping response table after upload to database')
		      tx.executeSql('DROP TABLE IF EXISTS responses')
		    },
      }   	
}
</script>