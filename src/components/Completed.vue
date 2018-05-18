<template>
   <section class="wrapper intro1 fullscreen fade-up question-bg-1">
	    <div class="question-overlay main-question-section">
	        <div class="inner text-center">
	            <h1>Thank you for completing this survey!!</h1>
	            <p>
	                Create your own for free, click the button below to get started.

	            </p>
	            <ul>
	                <router-link tag="button" :to="'/survey/' + this.feed_id" class="btn btn-primary btn-lg survey_button" href="survey" > Continue</router-link>
	            </ul>
	        </div>

	         <footer id="footers" class="text-center" style="margin-top:20px;bottom:0">
	            Copyright &copy; 2017 HappyReply
	                <p><br/>
	                <a href="#" class="share_icons" data-toggle="tooltip" data-placement="top" title="Like or Share HappyReply"> <i class="zmdi zmdi-facebook-box share_facebook"></i> <span>facebook</span> </a>
	                <a href="#" class="share_icons" data-toggle="tooltip" data-placement="top" title="Like or Share HappyReply"> <i class="zmdi zmdi-twitter-box share_twitter"></i> <span>twitter</span> </a>
	                <a href="#" class="share_icons" data-toggle="tooltip" data-placement="top" title="Like or Share HappyReply"> <i class="zmdi zmdi-youtube share_youtube"></i> <span>youtube</span></a>
	                <a href="#" class="share_icons" data-toggle="tooltip" data-placement="top" title="Like or Share HappyReply"> <i class="zmdi zmdi-linkedin-box share_linkedin"></i> <span>linkedin</span></a>
	                <a href="#" class="share_icons" data-toggle="tooltip" data-placement="top" title="Like or Share HappyReply"> <i class="zmdi zmdi-google-plus-box share_google"></i> <span>google-plus</span></a>

	            </p>
	        </footer>
	    </div>
	</section>
</template>
<script>

export default {
  data(){
    return {
         feed_id: '',
    }
  },
  watch: {
		'$route'(to, from) {
			this.feed_id = this.$route.params.id
		}
  },
  created() {
    if (this.$route.params.id) {
     this.feed_id = this.$route.params.id
    }
  },
  methods: {

  }
}
</script>
