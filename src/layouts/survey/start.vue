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
        <h1>{{feedbackInfo.name}}</h1>
        <h4 dark class="color--white"><i>{{feedbackInfo.desc}}</i></h4>
        <h4><i>{{ getYoutubeStatus }}</i></h4>
        <v-divider dark></v-divider>
          <v-btn
            style="width: auto; height: auto; border-radius: 100px"
            large
             color="red"
             class="white--texts survey-btn btn-red btn-survey-intro" 
            @click="goToSurvey()"
           >
           <img :src="'static/emoji/thumpsup.gif'" class="emoji-img nps-size">
           <h2>Begin Survey</h2>
           <img :src="'static/emoji/thumpsup.gif'" class="flip-emoji emoji-img nps-size">
    </v-btn>
    </div>
     <v-btn  @click="exitKioasMode()"
        color="red" red dark bottom fixed
        right fab >
         <v-icon>help</v-icon>
      </v-btn>
<!--        <v-btn  @click="disableKioskMode()"
        color="red" red dark bottom fixed
        left fab >
         Kiosk
      </v-btn> -->
</section>
</div>
</template>
<script>
import VueVideo from 'vue-video-module';
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
        deg: 5,
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
  created(){
    var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
    var feedback_id = this.$route.params.id
    var user_id = localStorage.getItem('user_id')
    this.$store.dispatch('getFeedbackTitleFromSqlLite', db);
    this.getIntroVideo(feedback_id)
  },
  methods: {
     disableKioskMode() {
        KioskPlugin.exitKiosk();
     },
     playing() {
       console.log('\o/ we are watching!!!')
     },
     ended(){
       location.reload()
       this.$refs.youtube.player
     },
     gotToLocalVideo() {
         this.$router.push({name: 'Intro2'})
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
         this.$http.get('https://jifs.happyreply.com/api/get/video-link/'+feedback_id)
          .then(response => {
            this.videoId = response.body
            if (this.videoId !== '') {
            } else {
              this.videoId = '/static/video/girl.mp4'
            }
          }, response => {
              this.videoId = '/static/video/girl.mp4'
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

.survey-btn {

  display: relative !important;
}

.flip-emoji {
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
</style>

