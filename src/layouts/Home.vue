<template>
  <div>
      <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
   <v-layout row wrap>
      <v-subheader><h2>Surveys</h2></v-subheader>
      <v-btn @click="loadSurveys()"
        color="pink" dark bottom fixed
        right fab >
         <v-icon>refresh</v-icon>
      </v-btn>
   </v-layout>
   </v-layout>
      <v-flex xs6>

        <div @click="goToSurvey()">
         <v-card  >
              <v-container fluid grid-list-lg>
                <v-layout row>
                  <v-flex xs7>
                    <div>
                      <div class="headline fadein">{{feedback_title}}</div>
                      <div>{{feedback_desc}}</div>
                     
                    </div>
                  </v-flex>
                  <v-flex xs5 style="background: #96281B; color: #fff">
                    <v-card-text class="text-center">
                      <h1>
                        {{ question_count }}
                      </h1>
                       <v-spacer></v-spacer>
                       <p>Questions</p>
                    </v-card-text>
                    
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </div>
      </v-flex>
</v-layout>
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
        loading: false,
        value: 0,
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
    mounted() {
      
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
      },
      QuestionAmount(value){
        this.question_count = value
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
      goToSurvey() {

         this.$router.push({name: 'Intro',  params: { id: this.feedback_slug } })
      },
      loadSurveys() {
        this.loading = true
        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        var user_id = localStorage.getItem('user_id')
        this.$store.dispatch('reCreateDatabases', db)
         this.$store.dispatch('getFeedback', {user_id, db})
        this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
        this.$store.dispatch('getQuestions',  {user_id, db})
        this.$store.dispatch('getAnswers',  {user_id, db})
        this.$store.dispatch('getMatrixs',  {user_id, db})
        this.$store.dispatch('getSliders',  {user_id, db})
        
        var self = this
        setTimeout(function(){

        self.$store.dispatch('getFeedbackAnswerFromSqlLite', db)
        self.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
        self.$store.dispatch('getQuestionCount', db)
          self.loading = false
          this.initilizeDatabase();
        }, 5000);
      }
    }
}
</script>
<style>
.loading-dialog {
   background-color: rgba(236,236,236, 0.4) 
}
</style>
