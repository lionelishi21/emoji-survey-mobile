<template>
<div id="wrapper" >
    <img :src="pic_url " id="bg" class="" alt="">
     <section class="wrapper fullscreen  overlay" v-show="showQuestion(-1)"  >
         <img @click="exitKioasMode()" src="static/emoji/grey_question.svg"  class="position_gear">
         <img  v-if="!online" src="static/offline.png"  class="position_offline">
          <div class="question-overlay">
              <div class="inner text-center">
                  <h1>{{all_feedback[0]['feedback_title']}}</h1>
                  <p>{{all_feedback[0]['feedback_desc']}}</p>
                  <ul>
                      <li><a @click.prevent="initStep()" class="button beginButton">Take Survey</a></li>
                  </ul>
              </div>
          </div>
      </section>
        <div class="wrapper fullscreen overlay">
          <transition-group name="fadeLeft">
            <section  v-for="(q, key) in  all_questions" v-show="showQuestion(key)" :key="key" :class="key+' wrapper fullscreen matrix_content question-bg-1'" style="padding: 10px;" >
                 <div class="question-overlay" v-show="showMultipleChoiceQuestions(q.type)">
                        <div class="inner">
                            <h2 class="quesHeader">{{q.question}}</h2>

                            <div class="features question_content">
                                <section v-for="(answer, key) in all_answers" :class="key" v-if="answer.question_id == q.id" :key="key">
                                    <label class="img-label text-center m-r-20 " :id="answer.id">
                                        <input
                                            v-model="mc_responses[q.id]"
                                            type="radio"
                                            v-bind:checked="answer.id"
                                            :name="'answers_mc['+q.id+']'"
                                            :class="'emoji stats'+answer.id" :value="answer.id"
                                            :id="'radio_'+answer.id"
                                        />
                                        <img
                                            :id="'emojimage_'+answer.id"
                                            :src="'static/emoji/'+answer.emoji+'.svg'"
                                            class="img-responsive emoji-img "
                                            />
                                    </label>

                                    <h3 v-html="modifyAnswers(answer.answer)"></h3>
                                </section>
                            </div>
                            <div class="nextPrevious">
                                <a @click="backToIntro()" v-if="key == 0" class="button pull-left">Back to Introduction</a>
                                <a v-else @click="getPrevPage(key)" class="button pull-left">Previous Question</a>
                                <a v-if="key == all_questions.length-1" href="#submitSurvey" class="button pull-right">Submit</a>
                                <a v-else @click="getNextPage(key)" class="button pull-right">Next Questions</a>
                            </div>
                        </div>
                 </div>
                 <div class="question-overlay " v-show="showMatrixQuestions(q.type)">
                        <div :id="'quest_back'+key" class="inner">
                            <h2 class="quesHeader">{{q.question}}</h2>
                        </div>
                        <div class="question_content">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th v-for="(mt, key) in all_matrixs" v-if="q.id == mt.question_id" :key="key">
                                            <div class="text-center">
                                                <div class="circle">
                                                    <img class="img-responsive emoji-img " style="margin: 0 auto;"
                                                        :src="'static/emoji/'+mt.emoji+'.svg'">
                                                </div>
                                                <h4 class="text-center">{{mt.matrix}}</h4>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(ans, key) in all_answers" v-if="q.id == ans.question_id" :key="key">
                                        <div class="text-left mt-3">
                                            <td><h4 class="text-left">{{ans.answer}}</h4></td>
                                        </div>

                                        <td v-for="(mt, key) in all_matrixs" v-if="q.id == mt.question_id" :key="key">
                                            <div class="center_check">
                                                <label class="matrix_ques">
                                                    <input
                                                    :name="'answers_matrixs['+ans.id+']'"
                                                        class='myinput large custom'
                                                        type="radio"
                                                        v-model="matrix_responses[ans.id]"
                                                        :value="q.id+'-'+mt.id
                                                    ">
                                                    <i class="input-helper"></i>
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    <div class="nextPrevious">
                            <a @click="backToIntro()" v-if="key == 0" class="button pull-left">Back to Introduction</a>
                            <a v-else @click="getPrevPage(key)" class="button pull-left">Previous Question</a>
                            <a v-if="key == all_questions.length-1" href="#submitSurvey" class="button pull-right">Submit</a>
                            <a v-else  @click="getNextPage(key)" class="button pull-right">Next Questions</a>
                    </div>
                 </div>
                 <div class="question-overlay" v-show="showCommentQuestions(q.type)">
                       <div class="inner">
                          <h2 class="quesHeader">{{q.question}}</h2>
                          <div class="question_content">
                          <div class="form-group">
                              <textarea class="form-control" v-model="comments_response[q.id]"  :name="'answers_comment['+q.id+']'" rows="7" id="textArea"></textarea>
                              <span style="color:white">Click above to enter your comment.</span>
                          </div>
                          </div>

                          <div class="nextPrevious">
                               <a @click="backToIntro()" v-if="key == 0" class="button pull-left">Back to Introduction</a>
                                    <a v-else @click="getPrevPage(key)" class="button pull-left">Previous Question</a>
                                    <a v-if="key == all_questions.length-1" href="#submitSurvey" class="button pull-right">Submit</a>
                                    <a v-else  @click="getNextPage(key)" class="button pull-right">Next Questions</a>
                          </div>
                      </div>
                 </div>
                 <div class="question-overlay" v-show="showSliderQuestions(q.type)">
                      <div class="inner">
                          <h2 class="quesHeader">{{q.question}}</h2>
                          <div class="question_content pt-4">
                              <div class="text-center" v-for="(slider, key) in all_sliders" v-if="slider.question_id == q.id" :key="key">
                                <vue-slider
                                    :min="0"
                                    :class="changeEmoji(slider_questions[q.id])"
                                    :max="5"
                                    v-bind="options"
                                    v-model="slider_questions[q.id]"
                                    >
                                    </vue-slider>
                                </div>
                          </div>

                            <div class="nextPrevious">
                                <a @click="backToIntro()" v-if="key == 0" class="button pull-left">Back to Introduction</a>
                                <a v-else @click="getPrevPage(key)" class="button pull-left">Previous Question</a>
                                <a v-if="key == all_questions.length-1" href="#submitSurvey" class="button pull-right">Submit</a>
                                <a v-else  @click="getNextPage(key)" class="button pull-right">Next Questions</a>
                          </div>
                      </div>
                 </div>
                 <div class="question-overlay" v-show="showRangeQuestions(q.type)">
                      <div class="inner">
                            <h2 class="quesHeader">{{q.question}}</h2>
                            <div class="features" style="padding-bottom: 20px;">
                                <div class="col-sm-12" style="width: 100%; padding-left: 15px; padding-right: 15px; position: relative;" v-for="(answer, key) in all_answers" :class="key" v-if="answer.question_id == q.id" :key="key">
                                    <div class="cen/ter_check m-b-15 label_padding" style="padding-top: 20px; padding-left: 10px; padding-right: 10px;">
                                        <label class="matrix_ques" style="width:100%;">
                                            <img :id="'emojimage_'+answer.id" :src="'static/emoji/'+answer.emoji+'.svg'" class="img-responsive emoji-img" style="margin: 0px auto;margin-right:10px;"/>

                                            <input v-model="range_questions[q.id]" class='rangeInput large custom' type="radio" name="range_question" :value="answer.id">
                                            <i class="input-helper"></i>

                                            <strong class="range-label">{{answer.answer}}</strong>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div class="nextPrevious">
                                <a @click="backToIntro()" v-if="key == 0" class="button pull-left">Back to Introduction</a>
                                <a v-else @click="getPrevPage(key)" class="button pull-left">Previous Question</a>
                                 <a v-if="key == all_questions.length-1" href="#submitSurvey" class="button pull-right">Submit</a>
                                <a v-else=""  @click="getNextPage(key)" class="button pull-right">Next Questions</a>
                            </div>
                      </div>
                 </div>
            </section>
          </transition-group>
        </div>
       <section id="submitSurvey" class="wrapper intro1 fullscreen fade-up question-bg-1">
            <div class="question-overlay">
                <div class="inner text-center">
                    <h1>Congratulations on making it this far !</h1>
                    <p>
                        Click button below to submit your survey results
                    </p>
                  <vue-ladda
                  class="button beginButton"
                   :loading="button.loading"
                   :data-style="button.dataStyle"
                   :progress="button.progress"
                   @click="formSubmit(all_feedback[0]['feedback_id'])">
                   Submit Survey
                 </vue-ladda>
                </div>
            </div>
        </section>

  </div>
</template>
<script>
import vueSlider from 'vue-slider-component';
import { OfflineIndicator, VueOnline } from 'vue-online'

// require styles
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import RangeSlider from 'vue-range-slider'

// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css'

import Feedback from '../databases/feedback';
import Question from '../databases/questions';
import Answer from '../databases/answers';
import Matrix from '../databases/matrixs';
import Slider from '../databases/slider';
import Post from '../databases/post';
import VueLadda from 'vue-ladda'
import { mapGetters } from 'vuex';

export default {
    mixins: [Feedback, Question, Answer, Matrix, Slider, Post],
		data() {
			return {
        step: -1,
        feedback_title: '',
      //   survey: {
      //     survey: null,
      //     sliders: {},
      //     matrixs: null,
      //     answers: {},
      //     questions: null,
			//  },
        sliderValue: 50,
        success: false,
        amount_answer: '',
        feedback_id: '',
        pic_url: 'static/survey-themes/people-image.png',
        feedback_desc: '',
        database: 'SurveyDb',
        version: '1.0',
        dbDisplay: 'ServeyDatabase',
        maxSize: 1105535,
        db: '',
        mc_responses: {},
        matrix_responses: {},
        range_questions: {},
        comments_response: {},
        slider_questions: {},
				index: 0,
				count: 0,
				questions: null,
        count_mcq: 0,
        range_count: '',
				surveys: '',
        hash: '',
        button: {
          loading: false,
          'dataStyle': 'expand-left',
          progress: 0,
        },
        connectionStatus: '',
         options: {
            width: "100%",
            height: 60,
            dotSize: 60,
            show: true,
            interval: 1,
            tooltip: "always",
            piecewise: true,
            piecewiseLabel: true,

            style: {
              "color": 'red',
              "width": "100%",
              "border-radius": "100px"
            },
            labelStyle: {
              "background-image": "/static/emoji/kissing.svg",
              'color': '#fff'
            },
            bgStyle: {
              "backgroundColor": "#ECECEC",
              "border-radius": "100px",
            },
            sliderStyle: {
                "backgroundColor": "#59ABE",
                "background-image": "/static/emoji/kissing.svg"
            },
            piecewiseStyle: {
              "border-radius": "100px",
                "width": "50px",
              "background-image": "static/emoji/kissing.svg"
            }
        }

			}
    },
    computed: {
      ...mapGetters([
        'all_feedback',
        'all_questions',
        'all_answers',
        'all_sliders',
        'all_matrixs'
      ]),
       online () {
        return VueOnline.isOnline
      }
    },
    created() {
      this.init();
    },
    components: {
      vueSlider,
      swiper,
      swiperSlide,
      RangeSlider
    },
  	methods: {
      checkConnection() {
         // this.db.transaction(this.queryResponsesDatabase, this.errorHandler);
         // this.db.transaction(this.dropResponsesDatabase, this.errorHandler);
         console.log(this.connectionStatus);
      },
      modifyAnswers(answer) {
            if (answer == '') {
                return '<div class="col-md-12"><input type="text" class="text-primary form-control" placeholder="Enter your answer here" style="border-radius: 2px;height: 45px;"></div>'
            } else {
                return answer
            }
        },
      init() {
        //  this.$router.reload()
        VueOnline.isOnline;
        console.log('creating database')
        var db
        db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
        console.log(db)
        this.db = db
         this.getSelectedSurvey();
        this.db.transaction(this.queryFeedbackDatabase, this.errorHandler);
        this.db.transaction(this.queryQuestionDatabase, this.errorHandler);
        this.db.transaction(this.queryAnswerDatabase, this.errorHandler);
        this.getSurveySliders(localStorage.getItem("user_id"));
        this.getSurveyMatrix();
      },
      showSubmit() {
        this.step = 'submit';
      },
      showSumitButton(){
        if (this.step == 'submit') {
          return true;
        } else {
          return false;
        }
      },
      exitKioasMode() {
        //  KioskPlugin.exitKiosk();
        //  localStorage.setItem("user_id", '');
         this.$router.push({name: 'Home'});
      },
     formSubmit(fbId) {
      // created response database
       this.db.transaction(this.createResponseDatabase, this.errorHandler)
       this.newSaveResponse(this.mc_responses, this.matrix_responses, this.slider_questions, this.range_questions, this.comments_response, fbId)


        this.$router.push({name: 'Survey'});
        location.reload();
    },
   changeEmoji(value){
        if  (value == 1) {
           return 'emo_1'
        }
        if (value == 2) {
           return 'emo_2'
        }
        if (value == 3) {
           return 'emo_3'
        }
        if (value == 4) {
           return 'emo_4'
        }
        if (value == 5) {
           return 'emo_5'
        }
      },
      parseInts(value) {
        return parseInt(value)
      },
      showMultipleChoiceQuestions(value){
         if(value == 1){
          return true;
         } else {
           return false;
         }
      },
      showMatrixQuestions(value){
         if(value == 2){
          return true;
         } else {
           return false;
         }
      },
      showCommentQuestions(value){
         if(value == 3){
          return true;
         } else {
           return false;
         }
      },
      showSliderQuestions(value){
         if(value == 4){
          return true;
         } else {
           return false;
         }
      },
      showRangeQuestions(value){
         if(value == 5){
          return true;
         } else {
           return false;
         }
      },
      backToIntro() {
        this.step = -1;
      },
      showQuestion(key) {
          if (this.step == key) {
            return true;
          } else if (this.step == -1) {
            return true;
          } else {
            return false;
          }
      },

      getNextPage(key) {
          if (key == 0) {
            this.step = 1;
          } else {
            this.step += 1;
          }

      },
      getPrevPage(key) {
          if (key == 0) {
            this.step = 1;
          } else {
            this.step -= 1;
          }
      },
      initStep() {
        this.step = 0;

      },
    nullHandler(tx, error) {
       console.log('Error: ' + error + ' code: ' + error.code);
    },
    errorHandler(tx, error) {
      console.log('Error: ' + error + ' code: ' + error.code);
    },
    getNext(key) {
        this.step + 1;
    },
    getPrev(key) {
        this.step - 1;
    },

	   }
	}
</script>

<style lang="scss">
    .table th, .table td {
        border: 0 !important;
    }

    label.matrix_ques {
        margin: 0.4em 0 0.7em 0;
    }

    .bg-color {
        background: #312450;
    }
    .headerColor {
        background: #312450;
    }

    .matrix_content {
        margin:auto;
        width:1500px;
        max-width:100%;
    }
    .increse_index {
        position: absolute;
        z-index: 1 !important;
    }

    .slider_index {
        z-index: 1000 !important; /*or greater*/
    }

    .question_content {
        height: 400px;
        overflow-y:scroll;
        overflow-x:hidden;
    }

    .swiper-container {
        z-index: 0 !important;
    }

    .swiper-wrapper {
        z-index: 0 !important;
    }
    .hg-100 {

        /* Full height */
        height: 100%;
        min-height: 100%;
        /* Center and scale the image nicely */
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;

    }

    .header-style {
        color: #000;
        font-weight: bold;
        margin-top: 0px;
        /*line-height: 1.5;*/
    /*  margin: 0 0 0.5em 0;*/
    }

    .outer_content{
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        min-height: 100%;
        width: auto;
        overflow: hidden !important;
    }

    .slider {
        /* overwrite slider styles */
        width: 200px;
        z-index: 1000;
    }
    .emo_1 .vue-slider .vue-slider-dot {
        background: url('/static/disappointed.svg') no-repeat;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_2 .vue-slider .vue-slider-dot {
        background: url('/static/worried.svg') no-repeat;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_3 .vue-slider .vue-slider-dot {
        background: url('/static/neutral_face.svg') no-repeat;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_4 .vue-slider .vue-slider-dot {
        background: url('/static/smiling.svg') no-repeat;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_5 .vue-slider .vue-slider-dot {
        background: url('/static/veryhappy.svg') no-repeat;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .wrapper.fullscreen {
        display: -moz-flex;
        display: -webkit-flex;
        display: -ms-flex;
        display: flex;
        -moz-flex-direction: column;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        -moz-justify-content: center;
        -webkit-justify-content: center;
        -ms-justify-content: center;
        justify-content: center;
        min-height: 100vh;
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
    }

    .parallax-bg {
        position: absolute;
        left: 0;
        top: 0;
        width: 130%;
        height: 100%;
        -webkit-background-size: cover;
    /*   box-shadow:inset 0 0 0 2000px rgba(255,0,150,0.3);*/
        background-position: center;
        background-color: rgba(0, 0, 0, 0.6);
        background-image: url(/static/images/surmon-1.jpg);
    }

    #bg {
        position: fixed;
        /*background:linear-gradient(0deg,rgba(255,0,150,0.3),rgba(255,0,150,0.3)),url(http://lorempixel.com/800/600/nature/2);*/
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* Preserve aspet ratio */
        min-width: 50%;
        min-height: 50%;
    }

    .overlay {
    width: 100%;
    height: 100%;
    box-shadow:inset 0 0 0 2000px rgba(0,0,0,0.7);
    }

    .parallax {
        left: 0;
        top: 0;
        width: 130%;
        height: 100%;
        -webkit-background-size: cover;
    /*   box-shadow:inset 0 0 0 2000px rgba(255,0,150,0.3);*/
        background-position: center;
    }
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

    .position_offline {
        cursor: pointer;
        border-radius: 10px;
        position: absolute;
        top: 10px;
        right: 35px;
        padding:2px;
        color: #fff;
        font-weight: 50px;
        width:20px;
        height:20px;
        z-index: 1000;
    }

    html {
        height: 100%;
    }

    body {
        min-height: 100% !important;
        height: 100%;
    }

    .rangeInput.large {
        position: absolute;
        margin-top: 34px;
    }

    .rangeInput[type="radio"]:before{
        position: relative;
        display: block;
        width:  30px;
        height: 30px;
        -moz-border-radius: 50px;
        -webkit-border-radius: 50px;
        border-radius: 100%;
        content: "";
        /*background: #FFF;*/
    }
    .rangeInput[type="radio"]:after{
        position: relative;
        display: block;
        left: 0px;
        top:  0px;
        width: 7px;
        height: 7px;
        -moz-border-radius: 50px;
        -webkit-border-radius: 50px;
        border: 5px solid #AAAAAA;
        border-radius: 100%;
        content: "";
        background-image: linear-gradient(135deg, #FFF 0%,#FFF 100%);
        background-repeat: no-repeat;
        background-position:center;
    }

    .rangeInput[type="radio"]:not(:disabled):hover:after{
        background-image: linear-gradient(135deg, #8BB0C2 0%,#FFF 100%);
        border-color: #2196F3;
    }
    .rangeInput[type="radio"]:not(:disabled):hover:before{
        border-color: #3D7591;
    }
    /* Large checkboxes */
    .rangeInput.large{
        height:30px;
        width: 30px;
    }

    .rangeInput.large[type="radio"]:before{
        height:30px;
        width:30px;
    }
    .rangeInput.large[type="radio"]:after{
        top: -48px;
        width: 55px;
        height: 55px;

    }
    /* Custom checkbox */
    .rangeInput.large.custom[type="radio"]:checked:after{
    /*background-image: url('tumbsup.png'), linear-gradient(135deg, #B1B6BE 0%,#FFF 100%);*/
    background-size: 100%;
    border-color: #2196F3;
    }
</style>
