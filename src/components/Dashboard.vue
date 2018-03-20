<template>
   <div id="app">
      <div class="">
      	<app-header></app-header>
        <div class="page-content pull-to-refresh-content">
          <div class="pull-to-refresh-layer">
            <div class="preloader"></div>
            <div class="pull-to-refresh-arrow"></div>
          </div>
             <div class="col-xs-12 col-sm-6 col-md-3 col-lg-3" v-for="survey in surveys">
                <div class="card sheet light p-10">
                    <div class="">
                        <div class="entries">
                            <h4 class="text-center">{{survey.feedback_title}}</h4>
                            <div class="text-center entries-date">
                                <small class="f-11"><small>Questions: {{survey.feedback_questions}} Response: {{survey.feedback_response}} </small> </small>
                            </div>
                            <div class="text-center">
                                <router-link 
                                class="btn btn-primary btn-block "
                                v-bind:to="{name: 'survey', params: {id: survey.feedback_id}}" >
                                Take
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
   </div>
</template>
<script>
import AppSidebar from '../modules/sidebar.vue'
import AppHeader  from '../modules/header.vue'
// import auth from '../auth/auth.js'
export default {
	components: {
		'app-sidebar' : AppSidebar,
		'app-header'  : AppHeader

	},
   data() {
      return {
          surveys: {},
          offsets: {},
          auth: auth,
          user: auth.user.profile   
      }
   },
   created() {
      this.fetchSurvey();
   },
   methods: {
      fetchSurvey: function() {
         var user_id = 2;
         this.$http.get('http://127.0.0.1:8082/api/get-surveys?user_id=' + user_id)
            .then(response => {
               return response.json();
            }).then(data => {
               this.surveys = data
               console.log(data)
            })

      },
      signout() {
         auth.signout()
      }
   },
   mounted: function () {
      this.$nextTick(function () {
         auth.check()
      })
   }
}


function getFeedbackInfo(user_id){
    alert('alert');
   console.log('getting feedback informations');

   // var user_id = $('#user_info').data('id');
   var url = 'http://127.0.0.1:8083/api/getFeebacks';
   console.log("user id: "+ user_id );

    $.ajax({
    type: "GET",
    url: url,
    data:{'user_id':user_id},
       success: function(data){
                db.transaction(function(tx){
                    
                    for (var x = 0; x < data.length; x++) {

                           console.log('getting feedback information: length: '+data.length)
                          var title  = data[x].feedback_title;
                          var id     = data[x].feedback_id;
                          var desc   = data[x].feedback_descriptionn;
                       
                          if(desc == null){
                             desc = "this is a test description";
                          }

                           console.log(title);
                          var sql = 'INSERT INTO FEEDBACKS (id, title, desc) VALUES (?,?,?)';
                          tx.executeSql(sql, [id, title, desc], selectFeedbacks, onError);
                    }

                   
                });

           
  
       }
  });
}
</script>