import { DatabaseSetting } from '../../config/variables.js'
export default {
    data: () => ({
      timeout: 5000,
      show1: false,
      company_url: 'demo',
      url: '.happyreply.com',
      url2: 'https://',
      dialog: false,
      isCompany: true,
      snackbar: false,
      formInputs: {
	    password: "",
	    email: ""
	  },
	  rules: {
	      required: value => !!value || 'Required.',
	      min: v => v.length >= 8 || 'Min 8 characters'
       }

    }),
     beforeRouteEnter (to, from, next) {
        next(vm => {

            // access to component's instance using `vm` . this is done because this navigation guard is called before the component is created.
            var check =  localStorage.getItem('user_id');
            if (check == null || check == 'undefined') {
                next();
            } else {
                vm.home();
            }
        })
    },
    created() {
        var company  =  localStorage.getItem('company');
           if ( company == null ) {
               this.isCompany = false
           }
    },
    computed: {
    	address() {
    		return this.url2+''+this.company_url+''+this.url
    	},
      showCompany() {
          var company  =  localStorage.getItem('company');
           if ( company == null ) {
               return false
           }
           return true
       }
    },
    methods: {
       initilizeApp() {

       },
       //Initlize local databases
       initDatabase() {
          var db = openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
          this.$store.dispatch('creatingDatabase', db)
       },

       // Check company details
       checkCompany() {
          this.companyName = localStorage.getItem('company')
       },

       //start over login process
       startOver() {
         this.dialog = true;
         localStorage.removeItem('company')

         setTimeout(function(){
         	   this.dialog = false;
         	   this.isCompany = true;
	      }, 1000);
       },

       // Save company infromation
       saveCompany() {
       	 this.dialog = true
       	 var self = this

       	 setTimeout(function() {
       	 	  self.dialog = false
       	  	localStorage.setItem("url", self.address)
            localStorage.setItem('company', self.company_url)
            console.log(self.address)
            self.isCompany = false
            location.reload()
       	 }, 2000)
       },

       // log user in
       submitForm: function(event) {

          var url = localStorage.getItem("url")
       	   var csrfToken = $('meta[name=csrf-token]').attr('content');
       	   this.$http.post(url+'/api/authenticate', this.formInputs, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
              })
       	  .then(function(data) {
       	  	  localStorage.setItem("user_id", data.body.user_id);
              localStorage.setItem("feedback_id", data.body.feedback_id);
              localStorage.setItem("user_name", data.body.user_name);
              this.fetchFromServer();

              var self = this
              setTimeout(function() {
              	 self.$router.push({name: 'Home'})
              }, 1000)
       	  })
       	  .catch( function (data) {
            console.log(data)
       	  	var errors = data.data;
       	  	if (errors != null) {

       	  	}
       	  });
       },

       /**
        * [home description]
        * @return {[type]} [description]
        */
       home() {
          this.$router.push({name: 'Home'})
       },
       //
       fetchFromServer(){

          var db =  openDatabase(DatabaseSetting.database, DatabaseSetting.version, DatabaseSetting.dbDisplay, DatabaseSetting.maxSize)
          var user_id = localStorage.getItem('user_id')
          this.$store.dispatch('creatingDatabase', db)
          this.$store.dispatch('getFeedback', {user_id, db})
          this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
          this.$store.dispatch('getQuestions',  {user_id, db})
          this.$store.dispatch('getAnswers',  {user_id, db})
          this.$store.dispatch('getMatrixs',  {user_id, db})
          this.$store.dispatch('getSliders',  {user_id, db})
          this.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
       }
    }
 }