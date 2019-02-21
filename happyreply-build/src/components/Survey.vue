<template>
<div id="wrapper" >
    <!-- <img :src="pic_url " id="bg" class="" alt=""> -->
    <vue-up></vue-up>
        <div class="wrapper fullscreen overlay">
          <transition-group tag="div" name="fadeLeft">
            <section  v-for="(q, key) in  getAllQuestions" v-if="showQuestion(key)" :key="key" :class="key+' wrapper fullscreen matrix_content question-bg-1'" style="padding: 10px;" >
                 <div class="question-overlay" v-if="showMultipleChoiceQuestions(q.type)">
                        <div class="inner">
                            <h2 class="quesHeader">{{q.question}} this is working</h2>

                            <div class="features question_content">
                               
                            </div>
                        </div>
                 </div>
            </section>
          </transition-group>
        </div>
       <section id="submitSurvey" style="background-image: url('static/survey-themes/breeze-cotton.jpg');" class="wrapper intro1 fullscreen fade-up question-bg-1">
            <div class="question-overlay">
                <div class="inner text-center">
                    <h1>Congratulations on making it this far !</h1>
                    <p>
                        Click button below to submit your survey results
                    </p>
                  <vue-ladda
                   class="btn btn-primary btn-lg survey_button"
                   :loading="this.button.loading"
                   :data-style="this.button.dataStyle"
                   :progress="this.button.progress"
                   @click="formSubmit(all_feedback[0]['feedback_slug'])">
                   Submit Survey
                 </vue-ladda>
                </div>
            </div>
        </section>

  </div>
</template>
<script>
import vueSlider from 'vue-slider-component/src/vue2-slider.vue'
import { OfflineIndicator, VueOnline } from 'vue-online'

// require styles
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import RangeSlider from 'vue-range-slider'

// you probably need to import built-in style
import 'vue-range-slider/dist/vue-range-slider.css'
import VueLadda from 'vue-ladda'
import Simplert from 'vue2-simplert'
import { mapGetters } from 'vuex';

export default {
		data() {
			return {
        step: 0,
        show: false,
        feedback_title: '',
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
        showSliderQue: false,
        showMatrixQue: false,
        showRangeQue: false,
        showCommentQue: false,
        showMcQue: false,

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
            lazy:true,
            max: 5,
            min: 0,
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
        'getAllQuestions',

      ]),
       online () {
        return VueOnline.isOnline
      }
    },
    created() {
      var db
      db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
       this.$store.dispatch('getFeedbackTitleFromSqlLite', db);
      this.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
    },
    watch: {
      step (val) {
         if (val == 2) {
           return true;
         }
      },
    },
    components: {
      vueSlider,
      swiper,
      swiperSlide,
      'vue-ladda': VueLadda,
      RangeSlider,
      Simplert
    },
  	methods: {
      showAlert(key, emoji, answer) {
      var emoji = 'static/emoji/'+emoji+'.svg';
      this.$popup({
          message         : answer,
          color           : '#423452',
          backgroundColor : 'rgba(0, 0, 0, 0.4)',
          delay           : 10,
          image: emoji
      })
      this.getNextPage(key)
      },
      showMatrixAlert(qustion_key, matrix_key) {
        var emoji = this.all_matrixs[matrix_key]['emoji']
        var matrix = this.all_matrixs[matrix_key]['matrix']
        

        // this.showAlert(qustion_key, emoji, matrix)
      },
      goTSubmit(){
        var check = this.checkForNull();
        if (check) {
            window.location.hash = '#submitSurvey';
        } else {
          let obj = {
            title: 'No answer has been selected!',
            message: 'Please select at lease one answer to go any further',
            type: 'info',
            customClass: 'simple_background',
            customIconUrl: 'static/disappointed.svg',
           

          }
          this.$refs.simplert.openSimplert(obj)
        }
      },
      getSurveyQuestionAnswer() {
         this.getSurveyTitle()
         this.getSurveyQuestions()
         this.getSurveyAnswers()
         this.getSurveyMatrixes()
         this.getSurveySliders()
      },
      modifyAnswers(answer) {
            if (answer == '') {
                return '<div class="col-md-12"><input type="text" class="text-primary form-control" placeholder="Enter your answer here" style="border-radius: 2px;height: 45px;"></div>'
            } else {
                return answer
            }
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
        this.button.loading = true;

        this.newSaveResponse(this.mc_responses, this.matrix_responses, this.slider_questions, this.range_questions, this.comments_response, fbId)
      // this.button.loading = false;
        this.clearFormData();
    },
    clearFormData() {
      this.mc_responses = {}
      this.matrix_responses = {}
      this.slider_questions = {}
      this.range_questions = {}
      this.comments_response = {}
    },
    isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
    },
    checkForNull() {
      if (  this.isEmpty(this.mc_responses) === true &&
      this.isEmpty(this.matrix_responses) === true &&
      this.isEmpty(this.slider_questions) === true &&
      this.isEmpty(this.range_questions) === true &&
      this.isEmpty(this.comments_response) === true) {
        return false;
      }
      return true;
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
          // if (key == this.all_questions.length - 1) {
          //   alert('end of questio')
          //   this.goTSubmit()
          // }

          // if (key == 0) {
          //   this.step = 1;
          // } else {
          //   this.step += 1;
          // }

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
       console.log('Error: ' + error + ' code: ' + error);
    },
    errorHandler(tx, error) {
      console.log('Error: ' + error + ' code: ' + error);
    },
    getNext(key) {
        this.step + 1;
    },
    getPrev(key) {
        this.step - 1;
    },
    refreshSlider: function () {
        this.$nextTick(function () {
          console.log(this.$refs);
          this.$refs['vue_slider'].refresh()
        })
      }
	   }
	}
</script>

<style lang="scss">
    .table th, .table td {
        border: 0 !important;
    }
    .simplert__title {
      color: #000 !important;
    }

    .simplert__body {
       color: #000 !important;
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
        background: url('../../static/disappointed.svg') no-repeat !important;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_2 .vue-slider .vue-slider-dot {
        background: url('../../static/worried.svg') no-repeat !important;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_3 .vue-slider .vue-slider-dot {
        background: url('../../static/neutral_face.svg') no-repeat !important;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_4 .vue-slider .vue-slider-dot {
        background: url('../../static/smiling.svg') no-repeat !important;
        background-size: contain;
        box-shadow: none;
        border-radius: 0;
    }

    .emo_5 .vue-slider .vue-slider-dot {
        background: url('../../static/veryhappy.svg') no-repeat !important;
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


#app_ {
  transform: rotate(90deg);
}
</style>
