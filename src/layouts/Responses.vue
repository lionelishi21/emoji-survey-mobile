<template>
<v-app>
<div>
   <snackbar-cmp></snackbar-cmp>
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
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>l;.
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
			      <p class="text-md-center"> Offline Respponses</p>
			     <v-btn :loading="loading" :disabled="loading" v-if="ResponseAmount" color="blue-grey" class="white--text"@click="postResponseOffline()">
			          Post Responses
			        <v-icon right dark>cloud_upload</v-icon>
			     </v-btn>
			     <v-btn class="btn btn-default" @click="exportResponseToText()" v-if="ResponseAmount">
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
import { mapGetters, mapMutations } from 'vuex';
import SnackbarCmp from '../components/Snackbar.vue'
export default {
	components: {
	   SnackbarCmp
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
          snackName: '',
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
     checkResponses() {
      	   if (this.ResponseAmount < 1) {
      		   return false
      		}
      		return true;
       }
    },
      methods: {

       /**
        * z
        * @return {[type]} [description]
        */
  	   init() {
  	 	  var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
      	  var user_id = localStorage.getItem('user_id')
      	  this.$store.dispatch('getResponses', db)
          this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
      	},

      	/**
      	 * [exportResponseToText description]
      	 * @return {[type]} [description]
      	 */
      	exportResponseToText() {
      		var response_loading = true
      		this.doc = true
      		this.postResponseOffline();
      	},

      	/**
      	 * ********************************************************
      	 * This function post response that alread store online
      	 * *******************************************************
      	 * @return {[type]} [description]
      	 * *******************************************************
      	 */
	    postResponseOffline () {
	     	var params = {
	     	 	database: this.database,
	     	 	version: this.version,
	     	 	dbDisplay: this.dbDisplay,
	     	 	maxSize: this.maxSize,
	     	 	doc: false
	     	}
	       	this.$store.dispatch('postResponseOffline', params)
		 },

		 /**
		  * *****************************************************
		  * Save File to csv 
		  * *****************************************************
		  * [SaveFileToTable description]
		  */
		 SaveFileToTable() {
		 	 var params = {
	     	 	database: this.database,
	     	 	version: this.version,
	     	 	dbDisplay: this.dbDisplay,
	     	 	maxSize: this.maxSize,
	     	 	doc: true
	     	 }
	       	this.$store.dispatch('postResponseOffline', params)
		 },

		 /**
		  * [snackTime description]
		  * @param  {[type]} snack [description]
		  * @return {[type]}       [description]
		  */
	    snackTime: function (snack) {
	      this.setSnack(this.snackName)
	      // this.$router.push('/')
	    },

	    /**
	     * [setSnack description]
	     * @type {String}
	     */
	    ...mapMutations({
	      setSnack: 'snackbar/setSnack'
	    })
      }
}
</script>