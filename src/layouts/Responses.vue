<template>
<div>
	<v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center  border-bottom">
    <h1 class="h2">Offline Responses</h1>

  </div>
  <v-row>
   <v-card>
    <v-card-text>
      <p class="text-md-center display-4">{{response_count}}</p>
      <p class="text-md-center"> Offline Respponse</p>
        <v-btn
      :loading="loading3"
      :disabled="loading3"

      color="blue-grey"
      class="white--text"
      @click="postResponseOffline()"
    >
      Post Response
      <v-icon right dark>cloud_upload</v-icon>
    </v-btn>
    </v-card-text>
  </v-card>
  </v-row>
 </div>	
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
          db: "",
       
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
	      	postResponseOffline () {
	         this.loading = true
	         var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
		     db.transaction(this.getResponsesFromSqlite)
		    },
		    getResponsesFromSqlite (tx) {
		      tx.executeSql('SELECT * FROM responses;', [], this.renderResponses1)
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
		        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
		        this.newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, feedbackId, true, db)
		      }
		    },
		     newSaveResponse (multpleChoice, matrix, slider, range, comments, fbId, db) {
		        this.newPostResponse(multpleChoice, matrix, slider, range, comments, fbId, false, db)
		    },
		    newPostResponse(mcArray, matrixArray, sliderArray, rangeArray, commentArray, fbId, offline, db) {
		      var action = 'https://happyreply.com/post-survey-responses2'
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
		              comment: commentArray }
		           },
		         {
		          headers: {
		            'X-CSRF-TOKEN': csrfToken
		          }
		        })
		        .then(response => {
		             var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
		             db.transaction(this.dropResponsesDatabase, this.nullHandler);
		             this.loading = false
		        }, response => {
		        	//TODO: Snackbar goes here
		        	 this.loading = false
		        	this.init()
		        });
		    }
      }   	
}
</script>