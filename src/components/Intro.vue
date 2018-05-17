<template>
<!-- Intro -->
<section class="survey-intro video_overlay">
  <youtube id="youtube_media" :video-id="getVideoId()" player-width="100%" :player-vars="playerVars" @playing="playing"></youtube>
  <img @click="exitKioasMode()" src="static/emoji/grey_question.svg"  class="position_gear">
    <div class="intro">
          <h1>{{feedbackInfo[0].feedback_title}}</h1>
          <h4><i>{{feedbackInfo[0].feedback_desc}}</i></h4>
           <hr>
          <button @click="goToSurvey()" class="survey-btn btn-red btn-survey-lg">Take Survey</button>
    </div>
</section>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  data(){
    return {
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
        pic_url: 'static/survey-themes/people-image.png',
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
       this.$refs.youtube.player.playVideo()
    },
    getVideoId() {
      var video = this.$youtube.getIdFromUrl(this.videoId)
      this.playerVars.playlist = video
      return video
    },
     goToSurvey() {
         this.$router.push({name: 'Survey'})
      },
      exitKioasMode() {
         this.$router.push({name: 'Home'});
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
    background: #fff;
    border-radius: 10px;
    position: absolute;
    top: 10px;
    right: 10px;
    padding:2px;
    color: #fff;
    font-weight: 50px;
    width:20px;
    height:20px;
    z-index: 1000;
}
</style>

