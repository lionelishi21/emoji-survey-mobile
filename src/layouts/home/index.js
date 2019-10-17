import { OfflineIndicator, VueOnline } from 'vue-online'
import { mapGetters, mapState } from 'vuex';
import { DatabaseSetting } from '../../config/variables.js'
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
        feedback_id: "",
        pic_url: 'static/survey-themes/people-image.png',
        loadingBtn: true
      }
    },
    created(){
      this.checkUserLogin();
      this.initilizeDatabase();
    },
    components: {
      OfflineIndicator,
      Icon
    },
    computed: {
      ...mapGetters([
        'feedbackInfo',
        'QuestionAmount',
        'isLoading',
        'isLoadSuccessfully'
      ]),
      ...mapState([
        'title'
      ]),
      online () {
        return VueOnline.isOnline
      },
    },
    methods:{
      initilizeDatabase() {
        var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
        var user_id = localStorage.getItem('user_id')
        this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
      },

      loadingButton(load){
        return load;
      },

      logoutUser(){
         var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
         this.$store.dispatch('logoutUser', db)
         // this.$router.push({name: 'Login'});
         location.reload();
      },

      /**
       * Thus function refrech use data
       * @param  {[type]} loaded [description]
       * @return {[type]}        [description]
       */
      refresh(loaded) {
          location.reload();
      },

      /**
       * [checkUserLogin description]
       * @return {[type]} [description]
       */
      checkUserLogin() {
        if (localStorage.getItem("user_id") == null) {
            this.$router.push({name: 'Login'});
        }
      },

      /**
       * [goToSurvey description]
       * @return {[type]} [description]
       */
      goToSurvey() {
         this.$router.push({name: 'Intro',  params: { id: this.feedbackInfo.slug } })
      },

      /**
       * ********************************************************************************
       * Load survey data
       * ********************************************************************************
       * @return {[type]} [description]
       * ********************************************************************************
       */
      loadSurveys() {

        this.loadingBtn = false
        this.loading = true
        /**
         *****************************************************************************
         * [loading description]
         * @type {Boolean}
         ****************************************************************************
         * *
         */
        
        if (this.online == false) {
            this.text = 'Internet connection is unavailable'
            this.snackbar = true;
            this.loading = false
          return
        }

        /**
         *
         * ******************************************************************
         * Open websql database
         * ******************************************************************
         * @type {[type]}
         * ******************************************************************
         */
        var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
        var user_id = localStorage.getItem('user_id')

        //Re create all survey datases
        this.$store.dispatch('reCreateDatabases', db)

        // Get survey datasand save it to the database
        this.SurveyDetails(user_id, db)
        this.SurveyQuestionairs(user_id, db);
        var self = this

        /**
         * ************************************************************
         * Timeout function help to proceess recreatring survey data
         * ************************************************************
         * @param  {[type]} ){
         * self.$store.dispatch('getFeedbackAnswerFromSqlLite',db)
         * self.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
         * self.$store.dispatch('getQuestionCount', db)
         * self.loading [description]
         * @param  {[type]} 4000 [description]
         * @return {[type]}      [description]
         * **************************************************************
         */
        setTimeout(function(){
          self.$store.dispatch('getFeedbackAnswerFromSqlLite', db)
          self.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
          self.$store.dispatch('getQuestionCount', db)
          self.loading = false
          self.loadingBtn = true
          // self.initilizeDatabase();
        }, 4000);
    },

    /**
     * **************************************************************
     * Fetch Survey from database
     * save the sqlite database
     * **************************************************************
     * @param {[type]} user_id [description]
     * @param {[type]} db      [description]
     * **************************************************************
     */
    SurveyDetails(user_id, db) {
      this.$store.dispatch('getFeedback', { user_id, db })
      this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
    },

    /**
     * *************************************************************
     * Fetch all survey questions
     * save them to sqlite database
     * *************************************************************
     * @param {[type]} user_id [description]
     * @param {[type]} db      [description]
     * *************************************************************
     */
    SurveyQuestionairs(user_id, db) {
       this.$store.dispatch('getQuestions',  {user_id, db})
       this.$store.dispatch('getAnswers',  {user_id, db})
       this.$store.dispatch('getMatrixs',  {user_id, db})
       this.$store.dispatch('getSliders',  {user_id, db})
     }
    }
}