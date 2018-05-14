<template>
 <div class="question-wrapper">
 	<div class="row">
 	  <div class="col-md-12">
 	  	  <h2>{{question}}</h2>
 	  </div>
   </div>
   <div class="row">
	    <div class="col-md-4" v-for="(answer, key) in answers" :key="key" v-if="answer.question_id == questionId">
	      <div class="card answer_content" :id="'card_select'+answer.id">
			  <div class="card-body text-center">
			     <label class="img-label text-center m-r-20 " :id="answer.id">
                    <input
                        v-model="mc_responses[questionId.id]"
                        type="radio"
                      
                        v-bind:checked="answer.id"
                        :name="'answers_mc['+questionId.id+']'"
                        :class="'emoji stats'+answer.id" :value="answer.id"
                        :id="'radio_'+answer.id"
                    />
                    <img
                    	  @click="selectAnswer(answer.id, answer.emoji, answer.answer, key)"
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
</template>
<script>
import { mapGetters } from 'vuex'
export default {
	props: {
		question: {
		  type: String
		},
		answers: {
		  type: Array,
		  default: []
		},
		questionId: {
			type: Number
		} 
	},
	data() {
		return {
			mc_responses: [],
			mc_question: []
		}
	},
	created(){
	},
	mounted: function() {
  	},
	methods: {
		modifyAnswers(answer) {
	        if (answer == '') {
	            return '<div class="col-md-12"><input type="text" class="text-primary form-control" placeholder="Enter your answer here" style="border-radius: 2px;height: 45px;"></div>'
	        } else {
	            return answer
	        }
	    },
	    selectAnswer(id, emoji, answer, key) {
	     var data = [id, emoji, answer, key];
	     this.$emit('answerselected', data);
	    }
	}
}
</script>