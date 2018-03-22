<template>
    <pull-to :top-load-method="refresh" id="home-preview-container">
        <!-- Sidebar -->
        <section id="sidebar">
            <div class="logo text-center">
                <img src="static/logo/logo.png" alt="logo">
            </div>
            <div class="inner">
                <nav>
                    <ul>
                        <li class="active"><a  @click="gotToSurvey()">Survey</a></li>
                        <li><a @click="goToResponse(all_feedback[0]['feedback_id'])">Response</a></li>
                    </ul>
                </nav>
            </div>
        </section>

        <!-- Wrapper -->
        <div id="wrapper" class="center-bg" v-if="showSurveyTabHome()">
            <div class="row text-center pt-4">
                <div class="col-md-12 pt-5">
                    <h1 class="h1_color_primary text-uppercase text-white mb-0">Welcome</h1>
                    <h3 class="text-white fw-200">The panels below displays a list of all your surveys along with the total questions within each.</h3>
                    <h3 class="fw-300">Select a survey panel of your choosing to begin the survey.</h3>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col-md-12">
                    <div class="logo text-center">
                        <img src="static/logo/logo.png" alt="logo">
                    </div>
                </div>
            </div> -->
            <div class="content_box_sm">
                <div class="row" v-if="all_feedback[0]">
                    <div class="question question--numeric" @click="goToSurvey()">
                        <div class="question__text-container pt-3">
                        <p class="question__title">{{all_feedback[0]['feedback_title']}}</p>
                        <p class="question__text">{{all_feedback[0]['feedback_desc']}}</p>
                        <p class="question__answers">Questions: {{question_count}}</p>
                        </div>
                    </div>
                </div>
                <div v-else class="row p-t-20 text-center">
                    <div class="col-md-12">
                         <vue-ladda
                           class="button"
                          :loading="button.loading"
                          :data-style="button.dataStyle"
                          :progress="button.progress"
                          @click="loadSurveys()">
                          Load Survey
                        </vue-ladda>
                    </div>
                </div>
            </div>
        </div>

        <div id="wrapper" class="center-bg" v-else>
            <div class="row text-center pt-4">
                <div class="col-md-12 pt-5">
                    <h1 class="h1_color_primary text-uppercase text-white">Welcome</h1>
                    <h3 class="text-white fw-200">The panels below displays a list of all your survey responses</h3>
                </div>
            </div>
            <!-- <div class="row">
                <div class="col-md-12">
                    <div class="logo text-center">
                        <img src="static/logo/logo.png" alt="logo">
                    </div>
                </div>
            </div> -->
            <OfflineIndicator message="Oh no, you're offline :("></OfflineIndicator>
            <div class="content_box_sm">
                <div class="row" v-if="all_feedback[0]">
                    <div class="question question--numeric">
                        <div class="question__text-container pt-3">
                        <p class="question__title">{{all_feedback[0]['feedback_title']}}</p>
                        <p class="question__text">{{all_feedback[0]['feedback_desc']}}</p>
                        <p class="question__answers">Responses: {{response_count}}</p>
                        </div>
                    </div>
                </div>
                <div class="row p-t-20">
                  <vue-ladda
                      v-if="online"
                      @click="postResponseOffline()"
                      class="button"
                      :loading="loadButton.loading"
                      :data-style="loadButton.dataStyle"
                      :progress="loadButton.progress">
                      Post Responses
                  </vue-ladda>
                  <button v-else class="button" disabled>Post Response</button>
                </div>
            </div>
        </div>
    </pull-to>
</template>
<script>
import Feedback from '../databases/feedback';
import Question from '../databases/questions';
import Answer from '../databases/answers';
import Matrix from '../databases/matrixs';
import Slider from '../databases/slider';
import Post from '../databases/post';
import { OfflineIndicator, VueOnline } from 'vue-online'
import { mapGetters } from 'vuex';
import VueLadda from 'vue-ladda'
import Snackbar from 'vue-snackbar'
import PullTo from 'vue-pull-to'


export default {
  mixins: [Feedback, Question, Answer, Matrix, Slider, Post],
    data() {
      return {
        feedback_id: "",
        database: 'SurveyDb',
        version: '1.0',
        dbDisplay: 'ServeyDatabase',
        maxSize: 1105535,
        db: "",
        tab_state: "home",
        button: {
            loading: false,
            'dataStyle': 'expand-left',
            progress: 0,
        },
        loadButton: {
          loading: false,
          'dataStyle': 'expand-left',
          progress: 0
        }
      }
    },
    created(){
      this.initilizeDatabase();
      this.createResponseDatabase();
      this.getSurveyResponse();
    },
    components: {
      OfflineIndicator,
     'vue-ladda': VueLadda,
      PullTo
    },
    computed: {
      ...mapGetters([
        'all_feedback',
        'question_count',
        'response_count',
        'all_response'
      ]),
      online () {
        return VueOnline.isOnline
      }
    },
    methods:{
      initilizeDatabase() {
        console.log('creating database')
        var db
        db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        console.log(db)
        this.db = db

      },
      refresh(loaded) {

      },
      loadSurveys() {
        this.button.loading = true;
        this.getSelectedSurvey();
        this.getSurveyQuestionCount();
        this.getSurveyAnswersCount();
        this.getSurveyMatrixCount();
        this.button.loading = true;
      },
      showButton(value) {
        if (value != "") {
          return false;
        } else {
          return true
        }
      },
      goToSurvey() {
         this.$router.push({name: 'Survey'});
         location.reload();
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
      }
    }
}
</script>

<style>
.button {
background: #CF000F !important;
}
#home-preview-container {
    background-image: url('/static/survey-themes/breeze-cotton.jpg');
    background-attachment: fixed;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.question {
    font-family: 'Open Sans', sans-serif;
    width: 30%;
    min-height: 50px;
    background: rgba(255, 255, 255, 0.9);
    box-shadow: 3px 0px 8px rgba(0, 0, 0, 0.07);
    border-radius: 2px;
    cursor: pointer;
    margin-left: 2%;
}

.question:hover {
    background: white;
}

.question__title, .question__text, .question__answers {
  font-size: 1rem;
  font-weight: bold;
  margin: 0;
  margin: 0 0 0.8em 0;
}
.question__title {
  color: #54b0df;
}
.question__text {
  font-size: 0.875rem;
  color: #7d62aa;
  font-weight: semibold;
}
.question__answers {
  font-size: 0.875rem;
  color: #bebebe;
  margin: 0 0 1.5em 0;
}
.question__details {
  display: inline-block;
  cursor: pointer;
  font-size: 0.875rem;
  background: #7d62aa;
  color: #f3f3f3;
  border: none;
  padding: .8em 1em;
  font-weight: semibold;
  border-radius: .2em;
}

/* Layout numeric question */
.question--numeric {
  /* display: flex; */
}
.question--numeric .question__text-container {
  width: 90%;
}
.question--numeric .question__chart-container {
  max-height: 165px;
  width: 42%;

}
.question--numeric .question__chart {
  /* width: 100%; */
}

/*  Layout text question */
.question--text {
  display: flex;
}
.question--text .question__text-container {
  /* width: 90%; */
}

#sidebar {
 /* background: #000 !important; */
    background: rgba(255, 255, 255, 0.9) !important;
    width: 16em !important;
}

#sidebar > .inner {
    min-height: 50vh !important;
}

#sidebar nav a {
    color: rgba(0, 0, 0, 0.5) !important
}

#sidebar nav a:before {
    background:#2196f3 !important;
}

.bg-white {
  background: #ececec;
}
.center-bg {
  height: 100vh;
  /* background: #E4F1FE; */
  /* -webkit-box-pack: center;
   -ms-flex-pack: center;
   justify-content: center;
  -webkit-box-align: center; */
}
.logo img {
  width: 200px;
}
.p-t-20 {
  padding-top: 20px;
}

.p-t-10 {
  padding-top: 01px;
}
.content_box {
  height: 50vh;
  padding-bottom: 20px;
  background: red;
}

.content_box_sm {
  height: 50vh;
  padding-top: 10%;
  /* background: #F2F1EF; */
}

/* .button {
  background: red !important;
} */

.h1_color_primary {
  color: #000
}

.content-home {
  position: relative;
  margin-right: auto;
  margin-left: auto;
}

.content-btn {
  margin-top: 50px;
  display: block;
}

.content-btn .btn {
  display: inline;
}

.content-btn p {
  text-align: center;
  font-size: 15px;
  margin-top: 20px;
  position: relative;
  display: block;
}
/* header/copyright link */
.link {
  text-decoration: none;
  color: #55acee;
  border-bottom: 2px dotted #55acee;
  transition: .3s;
  -webkit-transition: .3s;
  -moz-transition: .3s;
  -o-transition: .3s;
  cursor: url(http://cur.cursors-4u.net/symbols/sym-1/sym46.cur), auto;
}

.link:hover {
  color: #2ecc71;
  border-bottom: 2px dotted #2ecc71;
}

/* button div */
#buttons {
  padding-top: 50px;
  text-align: center;
}

/* start da css for da buttons */
.btn_button {
  border-radius: 5px !important;
  padding: 15px 25px !important;
  font-size: 22px !important;
  text-decoration: none !important;
  margin: 20px !important;
  color: #fff !important;
  position: relative !important;
  display: inline-block !important;
}

.btn_button:active {
  transform: translate(0px, 5px);
  -webkit-transform: translate(0px, 5px);
  box-shadow: 0px 1px 0px 0px;
}

.blue {
  background-color: #55acee;
  box-shadow: 0px 5px 0px 0px #3C93D5;
}

.blue:hover {
  background-color: #6FC6FF;
}

.green {
  background-color: #2ecc71;
  box-shadow: 0px 5px 0px 0px #15B358;
}

.green:hover {
  background-color: #48E68B;
}

.red {
  background-color: #e74c3c;
  box-shadow: 0px 5px 0px 0px #CE3323;
}

.red:hover {
  background-color: #FF6656;
}

.purple {
  background-color: #9b59b6;
  box-shadow: 0px 5px 0px 0px #82409D;
}

.purple:hover {
  background-color: #B573D0;
}

.orange {
  background-color: #e67e22;
  box-shadow: 0px 5px 0px 0px #CD6509;
}

.orange:hover {
  background-color: #FF983C;
}

.yellow {
  background-color: #f1c40f;
  box-shadow: 0px 5px 0px 0px #D8AB00;
}

.yellow:hover {
  background-color: #FFDE29;
}

/* copyright stuffs.. */
p {
  text-align: center;
  color: #55acee;
  padding-top: 20px;
}

.namecard{
  width:400px;
  high:350px;
  padding:20px;
  margin-right:auto;
  margin-left:auto;
  margin-top:100px;
  background-color:#ececec;

  letter-spacing: 1px;
  font-weight: 100;


  overflow: hidden;
  border: solid 1px rgba(225,117,117,0.30);
  border-radius: 3px;

  box-shadow: 0px 0px 15px rgba(2,0,0,0.2);

}

.namecard h2{
  font-size:24px;
  margin-top:-1.5px;
  border-bottom-style:soild 30px #ff7575;
  letter-spacing:2px;
  color:#333;

}

.namecard h2 span{
  font-size:18px;
}

.bb{
  display:clock;
  background-color:#ff7575;
  height:1px;
  width:200px;
  margin-top:-12px;
}

.namecard h4{
  font-size:16px;
  letter-spacing:1px;
  color: #ff7575;
  /*font-weight:500px;*/
}

.namecard h5{
  display:clock;
  font-size:14px;
  margin-top:-25px;
  border-bottom-style: soild 1px red;
}

.namecard p{
  font-size:13px;
}


.circle2{
  width: 100px; height: 100px;
  border-radius: 100%;
  position: absolute;
  top:-50px;
  background-color:rgba(225,117,117,0.50);
  right: -50px;

}

.circle1{
  width: 80px; height: 80px;
  border-radius: 100%;
  position: absolute;
  top:-40px;
  /*background-color:rgba(225,117,117,0.50);*/
  right: -40px;
  border: solid 2px rgba(225,225,225,0.5);

}



.mark {
  font-size:360px;
  position:absolute;
  bottom: 30px;
  font-weight: 100;
  color: rgba(0,0,0,0.030);
}


</style>
