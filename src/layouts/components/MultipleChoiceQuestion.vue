<template>
 <div class="question-wrapper">
 	
  
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
			type: Number,
			default: 1
		} 
	},
	data() {
		return {
			mc_responses: {},
			mc_question: []
		}
	},
	computed: {
		
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
	    },
	    updateMe() {

	    }
	}
}
</script>