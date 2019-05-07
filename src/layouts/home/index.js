import { OfflineIndicator, VueOnline } from 'vue-online'
import { mapGetters, mapState } from 'vuex';
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
        database: 'SurveyDb',
        version: '1.0',
        pic_url: 'static/survey-themes/people-image.png',
        dbDisplay: 'ServeyDatabase',
        maxSize: 1105535,
        db: "",
      }
    },
    created(){
      this.checkUserLogin();
      this.initilizeDatabase();
    },
    components: {
      OfflineIndicator,
      PullTo,
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
        var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        var user_id = localStorage.getItem('user_id')
        this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
      },
      loadingButton(load){
        return load;
      },
      logout(){
         var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
         this.$store.dispatch('logoutUser', db)
         // this.$router.push({name: 'Login'});
         location.reload();
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
         this.$router.push({name: 'Intro',  params: { id: this.feedbackInfo.slug } })
      },
      //TODO:
      //Still some refactoring
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

        //Re create all survey datases
        this.$store.dispatch('reCreateDatabases', db)

        // Get survey datas and save it to the database
        this.SurveyDetails(user_id, db)
        this.SurveyQuestionairs(user_id, db);

        var self = this
        setTimeout(function(){
          self.$store.dispatch('getFeedbackAnswerFromSqlLite', db)
          self.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
          self.$store.dispatch('getQuestionCount', db)
          self.loading = false
          self.initilizeDatabase();
        }, 4000);
    },
    SurveyDetails(user_id, db) {
      this.$store.dispatch('getFeedback', { user_id, db })
      this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
    },
    SurveyQuestionairs(user_id, db) {
       this.$store.dispatch('getQuestions',  {user_id, db})
       this.$store.dispatch('getAnswers',  {user_id, db})
       this.$store.dispatch('getMatrixs',  {user_id, db})
       this.$store.dispatch('getSliders',  {user_id, db})
    }
    }
  
}