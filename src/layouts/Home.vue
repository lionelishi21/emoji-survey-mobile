<template>
	<main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center  border-bottom">
            <h1 class="h2">Dashboard</h1>
          </div>
           <div class="row center-xs" style="padding-top: 20%;" v-if="feedbackInfo[0]">
              <div class="col-xs-6">
                     <article class="custom-card animated fadeInLeft" @click="goToSurvey(feedbackInfo[0].feedback_slug)">
                        <div class="card-body">
                          <h4 class="card-title">{{feedbackInfo[0].feedback_title}}</h4>
                          <h6 class="text-muted">Questions: {{ QuestionAmount }}</h6>
                          <p class="card-text">{{feedbackInfo[0].feedback_desc}}</p>
                        </div>
                      </article><!-- .end Card -->
              </div>
          </div>
           <div v-else class="row center-xs" style="padding-top: 20%;">
                <div class="col-xs-6">
                    <vue-ladda
                       class="survey-btn btn-red btn-survey-lg"
                      :loading="loadingButton(isLoading)"
                      :data-style="button.dataStyle"
                      :progress="button.progress"
                       @click="loadSurveys()">
                      Load Survey
                    </vue-ladda>
                </div>
            </div>
        </main>
</template>
<script>
import { OfflineIndicator, VueOnline } from 'vue-online'
import { mapGetters } from 'vuex';
import VueLadda from 'vue-ladda'
import Snackbar from 'vue-snackbar'
import PullTo from 'vue-pull-to'
import Icon from 'vue-awesome/components/Icon'
export default {
    data() {
      return {
        config: {
          pullText: '..Loading', // The text is displayed when you pull down
          triggerText: '..fetching data from server', // The text that appears when the trigger distance is pulled down
          loadingText: '... now loading', // The text in the load
          doneText: '...survey refreshed', // Load the finished text
          failText: '... cant load no internet', // Load failed text
          loadedStayTime: 400, // Time to stay after loading ms
          stayDistance: 50, // Trigger the distance after the refresh
          triggerDistance: 70 // Pull down the trigger to trigger the distance
        },
        feedback_id: "",
        database: 'SurveyDb',
        version: '1.0',
        pic_url: 'static/survey-themes/people-image.png',
        dbDisplay: 'ServeyDatabase',
        maxSize: 1105535,
        db: "",
        tab_state: "home",
        button: {
            loading: false,
            'dataStyle': 'expand-left',
            progress: 0,
        }
      }
    },
    created(){
      this.checkUserLogin();
      this.initilizeDatabase();
    },
    components: {
      OfflineIndicator,
     'vue-ladda': VueLadda,
      PullTo,
      Icon
    },
    computed: {
      ...mapGetters([
        'feedbackInfo',
        'QuestionAmount',
        'isLoading'
      ]),
      online () {
        return VueOnline.isOnline
      }
    },
    methods:{
      initilizeDatabase() {
        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        var user_id = localStorage.getItem('user_id')
        this.$store.dispatch('reCreateDatabases', db)
        this.$store.dispatch('getFeedback', {user_id, db})
      },
      loadingButton(load){
        return load;
      },
      logout(){
          var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
         this.$store.dispatch('dropDatabase', db)
         localStorage.removeItem("user_id");
         localStorage.removeItem("feedback_id");
         this.$router.push({name: 'Login'});
         location.reload();
      },
      createDatabases(db) {
          db.transaction(function (tx) {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS questions (id INTEGER NOT NULL PRIMARY KEY UNIQUE, 
              feedback_question TEXT NOT NULL, type INTEGER NOT NULL, feedback_id INTEGER NOT NULL, answer_count INTEGER)`, [])
            tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER,
            feedback_title TEXT, feedback_desc TEXT, feedback_slug Text)`, [])
            tx.executeSql(`CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL,
              answer TEXT NOT NULL, emoji TEXT, feedback_id INTEGER NOT NULL,  question_id INTEGER NOT NULL)`, [])
          })
      },
      refresh(loaded) {
          location.reload();
      },
       checkUserLogin() {
        if (localStorage.getItem("user_id") == null) {
            this.$router.push({name: 'Login'});
        }
      },
      goToSurvey(fb_id) {
         this.$router.push({name: 'Intro',  params: { id: fb_id } })
        //  location.reload();
      },
      showButtonTwo(value) {
        if (value > 0) {
          return false;
        } else {
          return true
        }
      },
      showSurveyTabResponse(){
        if (this.tab_state == 'response') {
          return true;
        }  else {
          return false;
        }
      },
      showSurveyTabHome(){
         if (this.tab_state == 'home') {
          return true;
        }  else {
          return false;
        }
      },
      goToResponse(fbId) {
        this.feedback_id = fbId;
        this.tab_state = 'response'
      },
      gotToSurvey() {
        this.tab_state = 'home'
      },
      loadSurveys() {
        
        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        var user_id = localStorage.getItem('user_id')

        this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
        this.$store.dispatch('getQuestions',  {user_id, db})
        this.$store.dispatch('getAnswers',  {user_id, db})
        this.$store.dispatch('getMatrixs',  {user_id, db})
        this.$store.dispatch('getSliders',  {user_id, db})
        this.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
      }
    }
}
</script>
<style>
  .logo img {
    width: 90%;
   }
</style>