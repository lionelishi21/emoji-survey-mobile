<template>
<v-app>
     <v-navigation-drawer
      :clipped="$vuetify.breakpoint.lgAndUp"
      v-model="drawer"
      permanent
      app
    >
    <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{user_name}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
    <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Responses</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
         <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
  </v-navigation-drawer>
  <v-toolbar color="grey darken-3" 
    fixed 
    dark
    app
     :clipped-left="$vuetify.breakpoint.mdAndUp"
    >
    <v-toolbar-title> <img src="static/logo/logo.png" alt="logo" style="width:200px"></v-toolbar-title>
    <v-spacer></v-spacer>
     <v-btn icon @click="">
      <v-icon>refresh</v-icon>
    </v-btn>
  </v-toolbar>
  <v-content>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-content>
  <v-footer app></v-footer>
</v-app>
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
        user_name: 'Lionel Francis',
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
        // this.user_name = localStorage.getItem('user_name')
        this.$store.dispatch('reCreateDatabases', db)
        this.$store.dispatch('getFeedback', {user_id, db})
      },
      loadingButton(load){
        return load;
      },
      logout(){
        
         localStorage.removeItem("user_id");
         localStorage.removeItem("feedback_id");
         // this.$router.push({name: 'Login'});
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