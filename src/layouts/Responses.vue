<template>
<main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
	  <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center  border-bottom">
	    <h1 class="h2">Dashboard</h1>
	  </div>
	  <div class="row center-x" style="padding-top: 20%;">
	  	 <div class="col-xs-6">
  	 		 <article class="custom-card animated fadeInLeft" @click="goToSurvey(feedbackInfo[0].feedback_slug)">
                <div class="card-body">
                  <h4 class="card-title">{{feedbackInfo[0].feedback_title}}</h4>
                  <h6 class="text-muted">Questions: {{ ResponseAmount }}</h6>
                   <vue-ladda
                     v-if="ResponseAmount > 0"
                       class="p-t-5 survey-btn btn-red btn-survey-lg"
                      :loading="loadingButton(isLoading)"
                      :data-style="button.dataStyle"
                      :progress="button.progress"
                       @click="postResponse()">
                      Post Response
                    </vue-ladda>
                </div>
              </article><!-- .end Card -->
	  	 </div>
	  </div>
 </main>	
</template>
<script>
import { mapGetters } from 'vuex';
import VueLadda from 'vue-ladda'
import Post from '../databases/post'
export default {
	mixins:[Post],
	components: {
		 'vue-ladda': VueLadda,
	},
    data() {
      return {
          database: 'SurveyDb',
          version: '1.0',
          pic_url: 'static/survey-themes/people-image.png',
          dbDisplay: 'ServeyDatabase',
          maxSize: 1105535,
          db: "",
		 }
	  },
	 computed: {
      ...mapGetters([
      	'feedbackInfo',
        'GetAllResponses',
        'ResponseAmount',
        'isLoading'
      ]),
    },
      methods: {
      	 init() {
      	 	var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
	      	 var user_id = localStorage.getItem('user_id')
	      	 this.$store.dispatch('getResponses', db)
	      	 this.$store.dispatch('getFeedback', {user_id, db})
	      	},
	      	postResponse() {

	      	}
      }   
}
</script>