<template>
<!-- Intro -->
<div>
<v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
  <v-container fill-height>
    <v-layout row justify-center align-center>
      <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
    </v-layout>
  </v-container>
</v-dialog>
<v-icon @click="exitKioasMode()" large color="blue darken-2"  class="position_gear" >help</v-icon>
<section class="survey-intro video_overlay">
  <youtube id="youtube_media" :video-id="getVideoId()" player-width="100%" :player-vars="playerVars" @playing="playing" @ended="ended"></youtube>
    <!-- <img @click="exitKioasMode()" src="static/emoji/grey_question.svg"  class="position_gear"> -->
    
    <div class="intro">
          <h1>{{feedbackInfo[0].feedback_title}}</h1>
          <h4><i>{{feedbackInfo[0].feedback_desc}}</i></h4>
          <hr>
          <button @click="goToSurvey()" class="survey-btn btn-red btn-survey-intro">Take Survey</button>
    </div>
</section>
</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
        loading: false,
        id: '',
        videoId: '',
        playerVars: {
          autoplay : 1,
          rel : 0,
          showinfo : 0,
          showsearch : 0,
          controls : 0,
          loop : 1,
          enablejsapi : 1,
          playlist: '',
          suggestedQuality: 'large'

        },
        feedback_video: '',
        hasVideo:false,
        pic_url: 'static/survey-themes/bg.jpg',
        database: 'SurveyDb',
        version: '1.0',
        dbDisplay: 'ServeyDatabase',
        maxSize: 1105535,
        db: '',
         video: {
          sources: [{
              src: 'static/video/girl.mp4',
              type: 'video/mp4'
          }],
          options: {
            src: 'https://www.youtube.com/watch?v=Z6WIAbPyrQA',
            poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
            spinner: 'circles',
            loop: 1,
            controlBar:false,
            autoPlay: true,
            fullscreen: false,
          }
      }
    }
  },
  watch: {
		'$route'(to, from) {
			// this.id = this.$route.params.id
		}
	},
  computed: {
   ...mapGetters([
       'feedbackInfo'
    ]),
    player () {
      return this.$refs.youtube.player

    }
  },
  created(){
    var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
    var user_id = localStorage.getItem('user_id')
    this.$store.dispatch('getFeedbackTitleFromSqlLite', db);
    this.getIntroVideo(this.$route.params.id)
  },
  methods: {
    playing() {
      console.log('\o/ we are watching!!!')
    },
    ended(){
       location.reload()
       this.$refs.youtube.player
       
    },
    getVideoId() {
      var video = this.$youtube.getIdFromUrl(this.videoId)
      this.playerVars.playlist = video
      return video
    },
     goToSurvey() {
        this.loading = true

        var self = this
        setTimeout(function(){
           self.loading = false;
           self.$router.push({name: 'Survey'})
        }, 500);
      },
      exitKioasMode() {
        this.loading = true

        var self = this;
        setTimeout(function(){
           self.loading = false;
           self.$router.push({name: 'Home'});
        }, 500);
        
      },
      getIntroVideo(feedback_id) {
         this.$http.get('https://happyreply.com/api/get/video-link/'+feedback_id)
        .then(response => {
          this.videoId = response.body
        }).then(data => {
          console.log(data)
        })
      }
  }
}
</script>
<style>
.position_gear{
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10000;
}
</style>

