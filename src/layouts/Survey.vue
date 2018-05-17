<template>
  <div>

  <div class="survey-intro video_overlay">
      <v-dialog v-model="dialog3" max-width="250px" content-class="text-center" dialog-transition="">
        <v-card>
          <v-card-text>
              <img :src="'static/emoji/'+modal.emoji+'.svg'"
                 class="img-responsive emoji-img"/>
                  <v-spacer></v-spacer>
             <b> {{modal.answer}}</b>
          </v-card-text>
        </v-card>
      </v-dialog>
    <section :class="key+' wrapper fullscreen matrix_content question-bg-1'" v-show="showIntro()" >
        <intro :slug="slug" @startsurvey="initateSurvey"></intro>
    </section>
    <img :src="pic_url " id="youtube_media" v-show="showBackgroundImage()" >
    <transition-group name="fadeLeft" @after-enter="refreshSlider">
      <section  v-for="(q, key) in  getAllQuestions" v-show="showQuestion(key)" :key="key" :class="key+' wrapper fullscreen matrix_content question-bg-1'">
          <div  v-if="showMultipleChoiceQuestions(q.type)" :key="key">
              <div class="question-wrapper">
                  <div class="row">
                    <div class="col-md-12">
                        <div class="survey-card m-b-5">
                          <div class="survey-card-body">
                           <h2>{{q.question}}</h2>
                          </div>
                        </div>
                    </div>
                   </div>
                   <div class="row">
                      <div v-for="(answer, answer_key) in getAllAnswers" :key="answer_key" v-if="answer.question_id == q.id" 
                      :class="changeClass(q.answer_count)">
                        <div class="survey-card answer_content" :id="'card_select'+answer.id">
                          <div class="survey-card-body text-center">
                             <label class="img-label text-center m-r-20 " :id="answer.id">
                                      <input
                                      v-model="mc_responses[q.id]"
                                      type="radio"        
                                      v-bind:checked="answer.id"
                                      :name="'answers_mc['+q.id+']'"
                                      :class="'emoji stats'+answer.id" 
                                      :value="answer.id"
                                      :id="'radio_'+answer.id"
                                      />
                                      <img
                                     @click="showAlert(answer.id, answer.emoji, answer.answer, key)"
                                       :id="'emojimage_'+answer.id"
                                        :src="'static/emoji/'+answer.emoji+'.svg'"
                                        class="img-responsive emoji-img "
                                       />
                                  </label>
                                  <h3 v-html="modifyAnswers(answer.answer)"></h3>
                          </div>
                        </div>
                      </div>
                   </div>
                </div>
          </div>
               <div v-if="showMatrixQuestions(q.type)" :key="key">
                <div class="question-wrapper">
                     <div class="row">
                        <div class="col-md-12">
                          <div class="survey-card m-b-5">
                            <div class="survey-card-body">
                               <h2>{{q.question}}</h2>
                             </div>
                          </div>
                        </div>
                    </div>
                   <div class="row">
                    <div class="col-md-12">
                        <div class="survey-card">
                          <div class="survey-card-body answer-body">
                             <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th v-for="(mt, header_key) in getAllMatrixs" v-if="q.id == mt.question_id" :key="header_key">
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
                                        <tr v-for="(ans, matrix_key) in getAllAnswers" v-if="q.id == ans.question_id" :key="matrix_key">
                                            <div class="text-left mt-3">
                                                <td><h4 class="text-left">{{ans.answer}}</h4></td>
                                            </div>
                                            <td v-for="mt in getAllMatrixs" v-if="q.id == mt.question_id" :key="matrix_key">
                                                <div class="center_check">
                                                    <label class="matrix_ques">
                                                        <input
                                                        @click="showMatrixAlert(key, matrix_key, q.answer_count, q.id)"
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
                          <div class="survey-card-footer text-center">
                              <span style="color:white">Select an option for each response.</span>
                               <img class="img-responsive emoji-img" src="static/emoji/veryhappy.svg" style="width: 30px">
                          </div>
                        </div>
                    </div>
                   </div>
              </div>
          </div>
           <div class="question-wrapper" v-if="showCommentQuestions(q.type)" :key="key">
              <div class="row">
                  <div class="col-md-12">
                     <div class="survey-card m-b-5">
                        <div class="survey-card-body">
                           <h2>{{q.question}}</h2>
                         </div>
                      </div>
                </div>
              </div>
                  <div class="row">
                    <div class="col-md-12">
                        <div class="survey-card answer_content">
                           <div class="survey-card-body text-center">
                              <div class="form-group">
                                  <textarea class="form-control" v-model="comments_response[q.id]"  :name="'answers_comment['+q.id+']'" rows="7" id="textArea"></textarea>
                                  <span style="color:white">Click above to enter your comment.</span>
                                   <img class="img-responsive emoji-img" src="static/emoji/veryhappy.svg" style="width: 30px">
                              </div>
                            </div>
                        </div>
                   </div>
                </div>
           </div>
           <div class="question-wrapper" v-if="showSliderQuestions(q.type)"  :key="key" >
              <div class="row">
                  <div class="col-md-12">
                   <div class="survey-card m-b-5">
                      <div class="survey-card-body">
                         <h2>{{q.question}}</h2>
                       </div>
                    </div>
                </div>
              </div>
              <div class="row">
                  <div class="col-md-12">
                      <div class="survey-card">
                        <div class="survey-card-body text-center">
                            <vue-slider
                              :ref="slider"
                              :key="key"
                              :class="changeEmoji(slider_questions[q.id])"
                              v-bind="options"
                              v-model="slider_questions[q.id]"
                              >

                          </vue-slider>
         <!--                  <input 
                             type="range" 
                             name="" 
                             :class="changeEmoji(slider_questions[q.id])"
                             min="0" max="100"
                             list="tickmarks"
                             step="1"
                          >
                          <datalist id="tickmarks">
                           <option>10</option>
                            <option>15</option>
                            <option>30</option>
                            <option>50</option>
                            <option>90</option>
                          </datalist> -->

                          <span style="color:white">Slide me.</span>

                          <img class="img-responsive emoji-img" src="static/emoji/smiling.svg" style="width: 30px">
                        </div>
                      </div>
                  </div>
                </div>
           </div>
          <div  v-if="showRangeQuestions(q.type)" :key="key" >
              <div class="question-wrapper">
                  <div class="row">
                    <div class="col-md-12">
                        <div class="survey-card m-b-5">
                            <div class="survey-card-body ">
                               <h2>{{q.question}}</h2>
                             </div>
                          </div>
                    </div>
                   </div>
                   <div class="row">
                      <div class="col-md-4" v-for="(answer, key) in getAllAnswers" :key="key" v-if="answer.question_id == q.id">
                        <div class="survey-card answer_content" :id="'card_select'+answer.id">
                        <div class="survey-card-body text-center">
                           <label class="img-label text-center m-r-20 " :id="answer.id">
                                    <input
                                    v-model="mc_responses[q.id]"
                                    type="radio"        
                                    v-bind:checked="answer.id"
                                    :name="'answers_mc['+q.id+']'"
                                    :class="'emoji stats'+answer.id" 
                                    :value="answer.id"
                                    :id="'radio_'+answer.id"
                                    />
                                    <img
                                   @click="showAlert(answer.id, answer.emoji, answer.answer, key)"
                                     :id="'emojimage_'+answer.id"
                                      :src="'static/emoji/'+answer.emoji+'.svg'"
                                      class="img-responsive emoji-img "
                                     />
                                </label>
                                <h3 v-html="modifyAnswers(answer.answer)"></h3>
                        </div>
                      </div>
                      </div>
                   </div>
                  
                 </div>
          </div>
            <div class="row">
               <div class="col-md-6">
                 <button @click="step = 100" v-if="key == 0" class="survey-btn pull-left btn-red btn-survey-lg">Back to Introduction </button>
                  <button v-else @click="getPrevPage(key)" class="survey-btn pull-left btn-red btn-survey-lg">Previous Question </button>
              </div>
              <div class="col-md-6">
                  <button v-if="key == getAllQuestions.length-1"
                     @click="goTSubmit()"
                     class="survey-btn pull-right btn-red btn-survey-lg">
                    Submit
                  </button>
                  <button v-else @click="getNextPage(key, q.type)" class="survey-btn pull-right btn-red btn-survey-lg">Next Questions</button>
              </div>
          </div>
      </section>
    </transition-group>
  </div>
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
import { mapGetters } from 'vuex'
import multipleChoice from './components/MultipleChoiceQuestion'
import Intro from './components/Intro'
import Post from '../databases/post';

export default {
    mixins: [Post],
		data() {
			return {
        backgroundImage: false,
         value1: 0,
        slug: '',
        isSlider: 0,
        question_type: 0,
        dialog3: false,
        current_question: 0,
        question_increment: [],
        step: 100,
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
        modal: {
          answer: '',
          emoji: ''
        },
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
        'feedbackInfo',
        'getAllAnswers',
        'getAllSliders',
        'getAllMatrixs',
        'getMcResponse'

      ]),
       online () {
        return VueOnline.isOnline
      }
    },
    created() {
      this.slug = this.$route.params.id
      var db
      db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
      this.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
      this.$store.dispatch('getFeedbackAnswerFromSqlLite', db)
      this.$store.dispatch('getFeedbackMatixFromSqlLite', db)
      this.$store.dispatch('getFeedbackTitleFromSqlLite', db);
      this.$store.dispatch('getFeedbackSliderFromSqlLite', db)
    },
    components: {
      vueSlider,
      swiper,
      swiperSlide,
      'vue-ladda': VueLadda,
      RangeSlider,
      Intro
    },
  	methods: {
      showBackgroundImage() {
        return this.backgroundImage
      },
      initateSurvey(){
        this.step = 0
        this.showBackgroundImage()
        this.backgroundImage = true
      
      },
      refreshSlider: function () {
        this.$nextTick(() => this.$refs.slider.refresh())
      },
      showIntro(){
        if (this.step == 100) {
          this.backgroundImage = false
          return true
        }
        return false
      },
      showAlert(id, emoji, answer, key) {
       
       this.modal.answer = answer
       this.modal.emoji = emoji 


        this.dialog3 = true;
        this.getNextPage(key)
        
        var self = this;
        setTimeout(function(){
           self.dialog3 = false;
        }, 1500);
      },
      showSlider(step) {
          if (this.isSlider == 1) {
            this.$nextTick(() => this.$refs.slider.refresh());
            return true
          }
          return false
      },
      changeClass (value) {
        if (value == 4 || value == 2 ) {
          return 'col-md-6'
        }
        if (value == 6 || value == 3) {
          return 'col-md-3'
        }

        if (value == 5) {
           return 'col-md-6 row-center'
        } 

      },
      beforeOpen(event) {
        this.modal.answer = event.params.answer
        this.modal.emoji = event.params.emoji
      },
      showMatrixAlert(qustion_key, matrix_key, answer_count, question_id) {
        if (this.current_question != question_id) {
            this.current_question = question_id
            this.question_increment = []
            this.question_increment.push({ matrix_key });
        }

        if (this.current_question == question_id) {
            this.question_increment.push({ matrix_key })

            //TODO: check if key already exist
            //Example to know if key is already in array:
            // [1, 2, 3].includes(2);     // true
            // [1, 2, 3].includes(4);     // false
            // [1, 2, 3].includes(3, 3);  // false

             if (this.question_increment.length == answer_count) {
                var emoji = this.getAllMatrixs[matrix_key]['emoji']
                var matrix = this.getAllMatrixs[matrix_key]['matrix']
                this.showAlert(qustion_key, emoji, matrix)
             }
        }

        
      },
      goTSubmit(){
        var check = this.checkForNull();
        if (check) {
            this.formSubmit(this.feedbackInfo[0].feedback_slug)
        } else {
           this.modal.answer = 'You have to select at lease one answer'
           this.modal.emoji = 'sad' 

            this.dialog3 = true;
            var self = this;
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
      var db
      db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
      this.button.loading = true;
      this.newSaveResponse(this.mc_responses, this.matrix_responses, this.slider_questions, this.range_questions, this.comments_response, fbId, db)
      this.button.loading = false;
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
         this.question_type = value
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
      getNextPage(key, type) {
            this.isSlider = this.step

          if (key == this.getAllQuestions.length - 1) {
            this.goTSubmit()
          }

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
    .slide-enter { transform: translate3d( 100%, 0, 0 ); }
.slide-enter-active { transition: 0.3s linear all; }
.slide-leave { transform: translate3d( -100%, 0, 0 ); }
.slide-leave-active { transition: 0.3s linear all; }
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
    .pull-right {
      float: right;
    }

#app_ {
  transform: rotate(90deg);
}
</style>
