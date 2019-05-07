<template>
<div>

    <!--=====================================
    =           Loader sectuibcomment            =
    ======================================-->
    <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
    <!--====  End of Section comment  ====-->

    <!--=====================================
    =            Section comment            =
    ======================================-->
    <v-container
      fluid
      grid-list-lg
    >
      <v-layout row wrap>
        <v-flex xs5  sm5>
          <v-card color="white" class="blue--text">
            <v-card-title primary-title>
              <div>
                <div class="headline">{{feedback_title}}</div>
                <hr>
                <span>{{feedback_desc}}</span>
              </div>
            </v-card-title>
            <v-card-title primary-title>
              <div>
                <div class="headline">Questions: {{ QuestionAmount }}</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn @click="goToSurvey()" class="blue--text" flat dark>Take Now</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!--====  End of Section comment  ====-->

    <!--=====================================
    =            Fab comment            =
    ======================================-->
    <v-btn @click="loadSurveys()"
      color="pink" dark bottom fixed
      right fab >
       <v-icon>refresh</v-icon>
    </v-btn>
    <!--====  End of Section comment  ====-->
</div>
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
        text: "",
        logout: false,
        snackbar: false,
        loading: false,
        value: 0,
        y: 'top',
        x: null,
        mode: '',
        timeout: 5000,
        feedback_title: '',
        feedback_desc: '',
        feedback_slug: '',
        question_count: 0,
        slug: '',
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
    watch: {
      feedbackInfo(oldValue, newValue) {
        this.feedback_title = this.feedbackInfo[0].feedback_title
        this.feedback_desc = this.feedbackInfo[0].feedback_desc
        this.feedback_slug = this.feedbackInfo[0].feedback_slug
      }
    },
    computed: {
      ...mapGetters([
        'feedbackInfo',
        'QuestionAmount',
        'isLoading',
        'isLoadSuccessfully'
      ]),
      online () {
        return VueOnline.isOnline
      },
    },
    methods:{
      initilizeDatabase() {
        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        var user_id = localStorage.getItem('user_id')
        this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
        this.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
        this.$store.dispatch('getQuestionCount', db)
        this.feedback_title = this.feedbackInfo[0].feedback_title
        this.feedback_desc = this.feedbackInfo[0].feedback_desc
        this.feedback_slug = this.feedbackInfo[0].feedback_slug
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

      // createDatabases(db) {
      //     db.transaction(function (tx) {
      //       tx.executeSql(`CREATE TABLE IF NOT EXISTS questions (id INTEGER NOT NULL PRIMARY KEY UNIQUE, 
      //         feedback_question TEXT NOT NULL, type INTEGER NOT NULL, feedback_id INTEGER NOT NULL, answer_count INTEGER)`, [])
      //       tx.executeSql(`CREATE TABLE IF NOT EXISTS feedbacks (feedback_id INTEGER,
      //       feedback_title TEXT, feedback_desc TEXT, feedback_slug Text)`, [])
      //       tx.executeSql(`CREATE TABLE IF NOT EXISTS answers (id INTEGER NOT NULL,
      //         answer TEXT NOT NULL, emoji TEXT, feedback_id INTEGER NOT NULL,  question_id INTEGER NOT NULL)`, [])
      //     })
      // },
      refresh(loaded) {
          location.reload();
      },
       checkUserLogin() {
        if (localStorage.getItem("user_id") == null) {
            this.$router.push({name: 'Login'});
        }
      },
      goToSurvey() {
         this.$router.push({name: 'Intro',  params: { id: this.feedback_slug } })
      },
      loadSurveys() {
        this.loading = true

        if (this.online == false) {
            this.text = 'Internet connection is unavailable'
            this.snackbar = true;
            this.loading = false
            return
        }

        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        var user_id = localStorage.getItem('user_id')

        this.$store.dispatch('reCreateDatabases', db)
        this.$store.dispatch('getFeedback', {user_id, db})
        this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
        this.$store.dispatch('getQuestions',  {user_id, db})
        this.$store.dispatch('getAnswers',  {user_id, db})
        this.$store.dispatch('getMatrixs',  {user_id, db})
        this.$store.dispatch('getSliders',  {user_id, db})
        // this,$store.dispatch('FETCH_CUSTOMER', {user_id, db})

        var self = this
        setTimeout(function(){

        self.$store.dispatch('getFeedbackAnswerFromSqlLite', db)
        self.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
        self.$store.dispatch('getQuestionCount', db)
          self.loading = false
          self.initilizeDatabase();
        }, 4000);
      }
    }
}
</script>
<style>
.loading-dialog {
   background-color: rgba(236,236,236, 0.4) 
}
</style>
