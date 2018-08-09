<template>
  <div>
    <transition name="zoomUp">
     <div id="dsp_data" v-show="animate"></div>
    </transition>
    <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  <div class="survey-intro video_overlay ">
      <v-dialog v-model="dialog3" max-width="500px" content-class="text-center" transition="zoomUp">
        <v-card style="background: transparent; color: #fff;">
          <v-card-text>
              <img :src="'static/emoji/'+modal.emoji+'.svg'" class="img-responsive" width="300px"/>
                  <v-spacer></v-spacer>
             <h3><b> {{modal.answer}}</b></h3>
          </v-card-text>
        </v-card>
      </v-dialog>
    <img :src="getBgImage" id="youtube_media" v-show="showBackgroundImage()" >
     
    <transition-group name="fadeLeft">
      <section  v-for="(q, key) in  getAllQuestions" 
        v-show="showQuestion(key, q.id, q.recieved_logic)" 
        :key="key" 
        :class="key+' wrapper fullscreen matrix_content question-bg-1'">
          <div  v-if="showMultipleChoiceQuestions(q.type)" :key="key">
              <div class="question-wrapper">
                  <div class="row">
                    <div class="col-md-12">
                        <div class="m-b-5">
                          <div class="">
                           <h2>{{q.question}}</h2>
                          </div>
                        </div>
                    </div>
                   </div>
                   <div class="row">
                      <div v-for="(answer, answer_key) in getAllAnswers" :key="answer_key" v-if="answer.question_id == q.id" 
                      :class="changeClass(q.answer_count)">
                        <div :class="'survey-card answer_content '+cardSelect(mc_responses[q.id], answer.id)" :id="'card_select_'+answer.id">
                          <div class="survey-card-body text-center" @click="triggerClicks(answer.id)">
                             <label class="img-label text-center m-r-20 " :id="answer.id">
                                      <input
                                      v-model="mc_responses[q.id]"
                                      type="radio"        
                                      id:checked="answer.id"
                                      :name="'answers_mc['+q.id+']'"
                                      :class="'emoji stats'+answer.id" 
                                      :value="answer.id"
                                      :id="'mc_'+answer.id"
                                       @change="showAlert(answer.id, answer.emoji, answer.answer, key, 'input', answer.logic_to)"
                                      />

                                      <img
                                       :id="'emojimage_'+answer.id"
                                        :src="'static/emoji/'+answer.emoji+'.svg'"
                                        class="img-responsive emoji-img "
                                       />
                                  </label>
                                  <h3 v-html="modifyAnswers(answer.answer)"></h3>
                                  <h3></h3>
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
                          <div class=" m-b-5">
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
                                        <tr v-for="(ans, answer_key) in getAllAnswers" v-if="q.id == ans.question_id" :key="answer_key">
                                            <div class="text-left mt-3">
                                                <td><h4 class="text-left">{{ans.answer}}</h4></td>
                                               
                                            </div>
                                            <td v-for="(mt, matrix_key) in getAllMatrixs" v-if="q.id == mt.question_id" :key="matrix_key">
                                                <div class="center_check">
                                                    <label class="matrix_ques">
                                                        <input
                                                            @click="showMatrixAlert(matrix_key, ans.id, q.answer_count, q.id, key)"
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
                     <div class=" m-b-5">
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
           <div class="question-wrapper" v-if="showEmailQuestions(q.type)" :key="key">
              <div class="row">
                  <div class="col-md-12">
                     <div class=" m-b-5">
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
                                   <v-text-field
                                    autofocus
                                    :rules="[rules.email]"
                                    placeholder="Type your email here"
                                    v-model="email_response[q.id]"
                                    style="color: #fff"
                                  >
                                 </v-text-field>
                                  <span style="color:white">Click above to enter your Email.</span>
                                   <img class="img-responsive emoji-img" src="/static/emoji/veryhappy.svg" style="width: 30px">
                              </div>
                            </div>
                        </div>
                   </div>
                </div>
           </div>
            <div class="question-wrapper" v-if="showShortTextQuestions(q.type)" :key="key">
              <div class="row">
                  <div class="col-md-12">
                     <div class=" m-b-5">
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
                                   <v-text-field
                                    autofocus
                                    v-model="shorttext_response[q.id]"
                                    class="c-white"
                                    :rules="[rules.counter]"
                                    style="color: #fff"
                                    single-line
                                    box
                                  >
                                 </v-text-field>
                                  <span style="color:white">Click above to enter your full name.</span>
                                   <img class="img-responsive emoji-img" src="/static/emoji/veryhappy.svg" style="width: 30px">
                              </div>
                            </div>
                        </div>
                   </div>
                </div>
        </div>
            <div class="question-wrapper" v-if="showNumberQuestions(q.type)" :key="key">
               <div class="row">
                  <div class="col-md-12">
                     <div class=" m-b-5">
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
                                   <v-text-field
                                    autofocus
                                    :mask="'(###) ### - ####'" 
                                    v-model="number_response[q.id]"
                                    class="c-white"
                                    :rules="[rules.phonenumber]"
                                    placeholder="(876) 999-9999"
                                    style="color: #fff"
                                  >
                                 </v-text-field>
                                  <span style="color:white">Click above to enter your Number.</span>
                                   <img class="img-responsive emoji-img" src="/static/emoji/veryhappy.svg" style="width: 30px">
                              </div>
                            </div>
                        </div>
                   </div>
                </div>
           </div>
           <div class="question-wrapper" v-if="showSliderQuestions(q.type)" :key="key" >
              <div class="row">
                  <div class="col-md-12">
                   <div class=" m-b-5">
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
          <div v-if="showRangeQuestions(q.type)" :key="key" >
              <div class="question-wrapper">
                  <div class="row">
                    <div class="col-md-12">
                        <div class="m-b-5">
                            <div class="survey-card-body ">
                               <h2>{{q.question}}</h2>
                             </div>
                          </div>
                    </div>
                   </div>
                   <div class="row">
                      <div class="col-md-4" v-for="(answer, answer_key) in getAllAnswers" :key="answer_key" v-if="answer.question_id == q.id">
                         <div :class="'survey-card answer_content '+cardSelect(range_questions[q.id], answer.id)" :id="'card_select_'+answer.id">
                        <div class="survey-card-body text-center"  @click="triggerClicks(answer.id)" >
                           <label class="img-label text-center m-r-20 " :id="answer.id">
                                    <input
                                   
                                    v-model="range_questions[q.id]"
                                    type="radio"        
                                    v-bind:checked="answer.id"
                                    :name="'answers_mc['+q.id+']'"
                                    :class="'emoji stats'+answer.id" 
                                    :value="answer.id"
                                    :id="'mc_'+answer.id"
                                    @change="showAlert(answer.id, answer.emoji, answer.answer, key, 'input', answer.logic_to)"
                                    />
                                    <img
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
               <button @click="backToIntro()" v-if="key == 0" class="survey-btn pull-left btn-red btn-survey-lg">Back to Introduction </button>
                <button v-else @click="getPrevPage(key)" class="survey-btn pull-left btn-red btn-survey-lg">Previous Question </button>
            </div>
            <div class="col-md-6">
                <button v-if="key == getAllQuestions.length-1"
                   @click="goTSubmit()"
                   class="survey-btn pull-right btn-red btn-survey-lg">
                 Next Question
                </button>
                <button v-else @click="getNextPage(key, q.type)" class="survey-btn pull-right btn-red btn-survey-lg">Next Questions</button>
            </div>
        </div>
      </section>
    </transition-group>
     <section class="wrapper intro1 fullscreen fade-up question-wrapper" id="showsubmit" v-show="showSubmitContent()"> 
        <div class="survey-card">
            <div class="survey-card-body text-center">
               <h2>Thank you for completing this survey!!</h2>
               <p>Please submit.</p>
               <button @click="clickToSubmit()" class="survey-btn btn-red  btn-survey-intro">
                 Click to Submit
              </button>
            </div>
        </div>
    </section>
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
        rules: {
          required: value => !!value || 'Required.',
          counter: value =>  value.length <= 20 || 'Max 20 characters',
          phonenumber: value => {
            console.log(value.length)
              if (value.length  > 0 && value.length < 10) {
                this.phone_number_valid = false
                return 'Invalid phone number'
              } else {
                this.phone_number_valid = true
              }
          },
          email: value => {
             const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
             
             if (pattern.test(value) == false && value.length > 0) {
               this.valid = false
             } else {
               this.valid = true
             }
             return pattern.test(value) || 'Invalid e-mail.'
          }
        },
        phone_number_valid:true,
        valid: true,
        location: {
          lat: '',
          long: ''
        },
        animate: true,
        current_answer_array: [],
        matrix_answer_count: 0,
        current_answer: 0,
        surveybgimage:'',
        appTimeout: 100000,
        answer_id: 0,
        loading: false,
        backgroundImage: true,
        value1: 0,
        slug: '',
        isSlider: 0,
        question_type: 0,
        dialog3: false,
        current_question: 0,
        question_increment: [],
        step: 0,
        show: false,
        feedback_title: '',
        sliderValue: 50,
        success: false,
        amount_answer: '',
        feedback_id: '',
        pic_url: '',
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
        email_response: {},
        number_response: {},
        shorttext_response: {},
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
        goback: false,
        isLogic: false,
        logic_question_id: '',
        before_logic_step: '',
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
        'getMcResponse',
        'getBgImage'

      ]),
      online () {
        return VueOnline.isOnline
      },
      messageStr() {
        if (this.isAppIdle) {
          this.backToIntro()
        }
      }
    
    },
    created() {
      this.slug = this.$route.params.id
      var db
      
      this.getUserLocation();
      db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
      this.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
      this.$store.dispatch('getFeedbackAnswerFromSqlLite', db)
      this.$store.dispatch('getFeedbackMatixFromSqlLite', db)
      this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
      this.$store.dispatch('getFeedbackSliderFromSqlLite', db)
      this.$store.dispatch('getBackgroundImage', this.feedbackInfo[0].feedback_slug)
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
      getUserLocation() {
         var bool = true
         var int = 0
          this.$getLocation({
            enableHighAccuracy: bool, //defaults to false
            timeout: Infinity, //defaults to Infinity
            maximumAge: int //defaults to 0
          })
        .then(coordinates => {
           console.log(coordinates)
           this.lat = coordinates['lat']
           this.long = coordinates['lng']
        });
      },
      emailValidationOptions() {
        if (this.valid == false ) {
           this.modal.answer = 'Something is wrong with your email address'
           this.modal.emoji = 'sad' 
           this.dialog3 = true;
          return true
        }
        return false
      },
      phoneValidationOptions() {
        if (this.phone_number_valid == false) {
           this.modal.answer = 'Something is wrong with your phone number'
           this.modal.emoji = 'sad' 
           this.dialog3 = true;
           return true
        }
        return false
      },
      showShortTextQuestions(value) {
        if (value == 8){
          return true;
         } 
         return false
      },
      showLogicsQuestion(logic_question_id) {
        if (logic_question_id) {
           this.logic_question_id = logic_question_id
           this.logic = true
           this.before_logic_step = this.step
           this.step = 'logic'
         } else {
          this.logic_question_id = ''
          this.logic = false
          if (this.before_logic_step) {
              this.step = this.before_logic_step          
          }
        }
      },
      triggerClicks(key){
        var mc_id = '#mc_'+key
        $(mc_id).trigger('click')
      },
      showSubmitContent() {
        if (this.step == 100) {
          return true
        }
        return false
      },
      clickToSubmit() {
         this.loading = true
         this.formSubmit(this.feedbackInfo[0].feedback_slug)
         var self = this
         setTimeout(function(){
          self.loading = false
         }, 1000);
      },
      backToIntro() {
        this.$router.push({name: 'Intro',  params: { id:  this.slug  } })
      },
      showBackgroundImage() {
        return this.backgroundImage
      },
      initateSurvey(){
        this.step = 0
        this.showBackgroundImage()
        this.backgroundImage = true
      
      },
      showIntro(){
        if (this.step == 100) {
          this.backgroundImage = false
          return true
        }
        return false
      },
      showCheckedbg(id, event) {
         if (event.target.checked) {
           var card = '#card_select_'+id;
           $(card).addClass('survey-card-hightlight');
         } else {
           var card = '#card_select_'+id;
           $(card).removeClass('survey-card-hightlight');
         }
      },
      showAlert(id, emoji, answer, key , value, logic_question_id = '') {

       this.animateEmoji(emoji)
       this.modal.answer = answer
       this.modal.emoji = emoji 
       this.dialog3 = true;
        
        var self = this;
        setTimeout(function(){
           self.dialog3 = false;
           self.getNextPage(key, id, logic_question_id)
        }, 1000);
      },
      changeClass (value) {
        if ( value == 2) {
          return 'col-md-6'
        }
        if (value == 4 ) {
          return 'col-md-6'
        }
        if (value == 6 ) {
          return 'col-md-3'
        }

        if (value == 3) {
          return 'col-md-4'
        }

        if (value == 5) {
           return 'col-md-6 row-center'
        } 

      },
      beforeOpen(event) {
        this.modal.answer = event.params.answer
        this.modal.emoji = event.params.emoji
      },
      attemptMatrixQuestion(answer_id, question_id) {
          this.current_question = question_id
          this.current_answer = answer_id;
          this.current_answer_array = []
          this.matrix_answer_count = 1
          this.current_answer_array.push(answer_id)
          return
      },
     inArray: function(needle, haystack) {
            var length = haystack.length;
            for(var i = 0; i < length; i++) {
                if(haystack[i] == needle) 
                return true;
            }
            return false;
        },
      showMatrixAlert (matrix_key, answer_id, answer_count, question_id, question_key) {
        
        if (this.current_question == 0) {
            this.attemptMatrixQuestion(answer_id, question_id)
        }

        if (this.current_question != question_id) {
            his.attemptMatrixQuestion(answer_id, question_id)
        }


        if (this.current_question == question_id) {
            if (this.current_answer == answer_id) {
                return
            } else {
                if (this.inArray(answer_id, this.current_answer_array)) {
                } else {
                   this.current_answer_array.push(answer_id)
                   this.matrix_answer_count += 1  
                }
                if (this.matrix_answer_count == answer_count) {
                   var emoji = this.getAllMatrixs[matrix_key]['emoji']
                   var matrix = this.getAllMatrixs[matrix_key]['matrix']
                    this.showAlert(question_id, emoji, matrix, question_key, '', '')
                }
                return
            }
        }
      },
      cardSelect(value, answer) {
        if (value != undefined) {
           if (value == answer) {
            return 'survey-card-hightlight'
          }
        }
       
      },
      goTSubmit(){
        var check = this.checkForNull();
        if (check) {
           this.step = 100
           // windows.location('#showsubmit')
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
      this.newSaveResponsenew(this.mc_responses, this.matrix_responses, this.slider_questions, this.range_questions, this.comments_response, this.email_response, this.number_response, this.lat, this.lng, fbId, db)
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
    showEmailQuestions(value) {
        if (value == 6){
          return true;
         } 
         return false
      },
    showNumberQuestions(value) {
        if (value == 7){
          return true;
         } 
         return false
    },
     checkForNull() {
        if (  this.isEmpty(this.mc_responses) === true &&
        this.isEmpty(this.matrix_responses) === true &&
        this.isEmpty(this.slider_questions) === true &&
        this.isEmpty(this.range_questions) === true &&
        this.isEmpty(this.comments_response) === true &&
        this.isEmpty(this.email_response) === true &&
        this.isEmpty(this.number_response) === true
        ) {
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
      showQuestion(key, question_id, recieved_logic) {
        if (this.logic) {
           if (this.logic_question_id == question_id) {
             return true
           }
        }

        if (this.step == key) {
          if (recieved_logic == 1) {
            if (this.goback == true ) {
              this.step -= 1
            } else {
              
              this.step += 1
            }
            
            if (this.step == this.getAllQuestions.length) {
                this.goTSubmit()
             }
          }
          return true;
        } else if (this.step == -1) {
          return true;
        } else {
          return false;
        }
      },
      getNextPage(key, answer_id, logic_question_id) {
          if (this.emailValidationOptions() == true) {
           return 
         }

         if (this.phoneValidationOptions() == true) {
           return
         }

         this.goback = false
         if (this.logic == true) {
               this.logic_question_id = ''
               this.logic = false
               this.step = this.before_logic_step
            if (this.before_logic_step !== '') {
                this.step = this.before_logic_step
                if (this.step == 0) {
                  this.step = 1
                }else {
                  this.step = this.step+1
                }
                // this.before_logic_step == ''
                // this.step = key+1
                 return
             }
            
         }


         if (logic_question_id === null || logic_question_id === false || logic_question_id === '' || logic_question_id === undefined ) {
            if (key == this.getAllQuestions.length-1) {
              this.goTSubmit()
            } else {
              if (key == 0) {
                 this.step = 1;
              } else {
                this.step += 1
              }
            }
         } else {
             this.showLogicsQuestion(logic_question_id)
         }
      },
      getPrevPage(key) {
        this.goback = true
        if (key == 0) {
          this.step = 1;
        } else {
          if (this.step == 'logic') {
            this.step = this.before_logic_step;
            this.before_logic_step = ''
          } else {
             this.step -= 1;
          }
         
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
    animateEmoji(emoji) {
      this.animate = true
      var emo = 'static/emoji/'+emoji+'.svg'
      var data = '<div class="webloder"';
        for (var i = 1; i <= 40; i++) {
           if(i==1 || i==11 || i==21) {

           } else {
             data +='<div style="background-image: url('+emo+')" class="bubble x'+i+'"></div>'; 
           }
        }
        data +='</div>';
        $("#dsp_data").html(data);
        
        var self = this
        setTimeout(function(){
           self.animate = false
        }, 2900);
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
    .pull-right {
      float: right;
    }

#app_ {
  transform: rotate(90deg);
}
</style>
