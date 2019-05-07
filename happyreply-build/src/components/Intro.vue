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
<section class="survey-intro video_overlay">
    <youtube 
      id="youtube_media" 
      :video-id="getVideoId()" 
      player-width="100%" 
      :player-vars="playerVars" 
      @playing="playing" 
      @ended="ended">
    </youtube>
    <div class="intro">
        <h1>{{feedbackInfo[0].feedback_title}}</h1>
        <h4><i>{{feedbackInfo[0].feedback_desc}}</i></h4>
        <!-- <h4><i>{{ getYoutubeStatus }}</i></h4> -->
        <hr>
        <button @click="goToSurvey()" class="survey-btn btn-red btn-survey-intro">Take Survey</button>
    </div>
     <v-btn  @click="exitKioasMode()"
        color="red" red dark bottom fixed
        right fab >
         <v-icon>help</v-icon>
      </v-btn>
</section>
</div>
</template>
<script>
import VueVideo from 'vue-video-module';
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
        local: false,
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
        videoOptions: {
          src: "/static/video/girl.mp4",
          poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
          controlBar: false,
          loop : true,
          spinner: 'circles',
          autoPlay: true,
          fullscreen: true,
        }
     }
  },
  watch: {
		'$route'(to, from) {
			// this.id = this.$route.params.id
		},
	},
  components: {
     VueVideo
  },
  computed: {
   ...mapGetters([
       'feedbackInfo',
       'getVideoLink',
       'getYoutubeStatus'
    ]),
    player () {
      return this.$refs.youtube.player
    }
    
  },
  mounted() {
     // this.video1 = this.$refs.video1;
     
  },
  created(){
    var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
    var feedback_id = this.$route.params.id
    var user_id = localStorage.getItem('user_id')
    this.$store.dispatch('getFeedbackTitleFromSqlLite', db);
    // this.$store.dispatch('getIntroVideo', feedback_id)
    
    this.getIntroVideo(feedback_id)
  },
  methods: {
     playing() {
       console.log('\o/ we are watching!!!')
     },
     ended(){
       location.reload()
       this.$refs.youtube.player
     },
     gotToLocalVideo() {
         this.$router.push({name: 'Intro2'})
         // var url = '/intro2/'+this.$route.params.id
         window.location.href = url
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
         this.$http.get('https://psoj.happyreply.com/api/get/video-link/'+feedback_id)
          .then(response => {
            this.videoId = response.body
            if (this.videoId !== '') {
            } else {
              this.gotToLocalVideo()
            }
          }, response => {
              this.gotToLocalVideo()
          })
      }
  }
}
</script>
<style>
.p_gear{
    cursor: pointer;
    position: absolute;
    z-index: 1000;
    top: 20px;
    right: 20px;
}
</style>

