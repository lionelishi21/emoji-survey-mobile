<template>
	<div>
      <v-snackbar
      :timeout="timeout"
      :top="y === 'top'"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      v-model="snackbar"
    >
      <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
		<div class="container-login100" 
       style="background-image: url('static/survey-themes/breeze-cotton.jpg');"
     >
			<div class="wrap-login100 p-t-190 p-b-30">
				<form class="login100-form validate-form">

          <div class="login100-form-avatar">
						<img src="static/logo/logo.png" alt="Logo">
					</div>

					<div id="emailInput" :class="'wrap-input100 validate-input m-b-10 '+showError(formErrors['email'])" data-validate = "Username is required">
						<input class="input100 " type="text" name="username" placeholder="Username" v-model="formInputs.email">
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							  <v-icon>perm_identity</v-icon>
						</span>
					</div>

					<div  id="passwordInput" :class="'wrap-input100 validate-input m-b-10 '+showError(formErrors['password'])" data-validate = "Password is required">
						<input class="input100 alert-validate" type="password" name="pass" placeholder="Password" v-model="formInputs.password" >
						<span class="focus-input100"></span>
						<span class="symbol-input100">
							<v-icon>lock</v-icon>
						</span>
					</div>

					<div class="container-login100-form-btn p-t-10">
               <vue-ladda
                     class="login100-form-btn"
                   :loading="button.loading"
                   :data-style="button.dataStyle"
                   :progress="button.progress"
                   @click.prevent="submitForm()">
                   Login
                 </vue-ladda>
					</div>
         <div class="text-center w-full p-t-25 p-b-230">
						<a href="#" class="txt1">
							Forgot Username / Password?
						</a>
					</div>
					<div class="text-center w-full">
						<a class="txt1" href="https://happyreply.com/register">
							Create new account
							<i class="fa fa-long-arrow-right"></i>
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
<script>
// import auth from '../auth/auth.js';
import VueLadda from 'vue-ladda'
import { mapGetters } from 'vuex';
export default {
  components: {
    'vue-ladda': VueLadda
  },
       data() {
            return {
                snackbar: false,
                y: 'top',
                x: null,
                mode: '',
                timeout: 5000,
                text: '',
                database: 'SurveyDb',
                version: '1.0',
                dbDisplay: 'ServeyDatabase',
                maxSize: 1105535,
                email: null,
                password: null,
                formInputs: {
                  password: "",
                  email: ""
                },
                formErrors: [],
                error: false,
                button: {
                    loading: false,
                    'dataStyle': 'expand-left',
                    progress: 0,
                  }
               }
        },
        created() {
          this.checkUserLogin();
          this.initDatabase();
        },
        computed: {

        },
        methods: {
            initDatabase() {
                db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
                this.$store.dispatch('creatingDatabase', db)
            },
            fetchFromServer(){
                var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
                var user_id = localStorage.getItem('user_id')
                this.$store.dispatch('creatingDatabase', db)
                this.$store.dispatch('getFeedback', {user_id, db})
                this.$store.dispatch('getFeedbackTitleFromSqlLite', db)
                this.$store.dispatch('getQuestions',  {user_id, db})
                this.$store.dispatch('getAnswers',  {user_id, db})
                this.$store.dispatch('getMatrixs',  {user_id, db})
                this.$store.dispatch('getSliders',  {user_id, db})
                this.$store.dispatch('getFeedbackQuestionsFromSqlLite', db)
            },
            showError(value){
              if (value != null) {
                return 'alert-validate';
              }
            },
            checkUserLogin() {
              if (localStorage.getItem("user_id") != null) {
                  this.$router.push({name: 'Home'});
              }
            },
            submitForm: function(event) {

            var action = 'https://psoj.happyreply.com/api/authenticate';
            var csrfToken = $('meta[name=csrf-token]').attr('content');

            if (this.formInputs.email == "") {
               $('#emailInput').addClass('alert-validate');
              $('#passwordInput').addClass('alert-validate');
               this.text = 'Email and password is required'
               this.snackbar = true;
               return
             } else {
                $('#emailInput').removeClass('alert-validate');
             }

            if (this.formInputs.password == "") {
              this.text = 'Password is required'
               this.snackbar = true;
               return
               $('#passwordInput').addClass('alert-validate');
             } else {
                $('#passwordInput').removeClass('alert-validate');
             }


             this.button.loading = true;
             this.$http.post(action, this.formInputs, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
              })
              .then(function(data) {
                   localStorage.setItem("user_id", data.body.user_id);
                   localStorage.setItem("feedback_id", data.body.feedback_id);
                   localStorage.setItem("user_name", data.body.user_name);
                   this.fetchFromServer();
                   // Retrieve
                   var self = this;
                   setTimeout(function(){
                       self.button.loading = false;
                       self.$router.push({name: 'Home'});
                   }, 1000);
              })
              .catch(function (data, status, request) {
                var errors = data.data;
                console.log(errors)
                if (errors != null) {
                  this.text = errors.error
                  this.snackbar = true

                  $('#emailInput').addClass('alert-validate');
                  $('#passwordInput').addClass('alert-validate');
                  this.formInputs.password == "";
                }
                this.formErrors = errors;
                this.button.loading = false;
              });
          },
        }
}
</script>

<style lang="css">
/*---------------------------------------------*/
input {
	outline: none;
	border: none;
}

.m-b-10 {margin-bottom: 10px !important;}

textarea {
  outline: none;
  border: none;
}

textarea:focus, input:focus {
  border-color: transparent !important;
}

input:focus::-webkit-input-placeholder { color:transparent; }
input:focus:-moz-placeholder { color:transparent; }
input:focus::-moz-placeholder { color:transparent; }
input:focus:-ms-input-placeholder { color:transparent; }

textarea:focus::-webkit-input-placeholder { color:transparent; }
textarea:focus:-moz-placeholder { color:transparent; }
textarea:focus::-moz-placeholder { color:transparent; }
textarea:focus:-ms-input-placeholder { color:transparent; }

input::-webkit-input-placeholder { color: #999999; }
input:-moz-placeholder { color: #999999; }
input::-moz-placeholder { color: #999999; }
input:-ms-input-placeholder { color: #999999; }

textarea::-webkit-input-placeholder { color: #999999; }
textarea:-moz-placeholder { color: #999999; }
textarea::-moz-placeholder { color: #999999; }
textarea:-ms-input-placeholder { color: #999999; }

/*---------------------------------------------*/
button {
	outline: none !important;
	border: none;
	background: transparent;
}

button:hover {
	cursor: pointer;
}

iframe {
	border: none !important;
}


/*//////////////////////////////////////////////////////////////////
[ Utility ]*/
.txt1 {
  font-family: Montserrat-Regular;
  font-size: 14px;
  color: #cccccc;
  line-height: 1.4;
}

.bo1 {
  border-bottom: 1px solid #999999;
}

.hov1:hover {
  border-color: #d33f8d;
}


/*//////////////////////////////////////////////////////////////////
[ login ]*/

.limiter {
  width: 100%;
  margin: 0 auto;
}

.container-login100 {
  width: 100%;
  min-height: 100vh;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  position: relative;
  z-index: 1;
}

.container-login100::before {
  content: "";
  display: block;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #000;
  background: -webkit-linear-gradient(bottom, #005bea, #00c6fb);
  background: -o-linear-gradient(bottom, #005bea, #00c6fb);
  background: -moz-linear-gradient(bottom, #005bea, #00c6fb);
  background: linear-gradient(bottom, #005bea, #00c6fb);
  opacity: 0.7;
}

.wrap-login100 {
  background: #fff;
  border-radius: 1px;
  padding: 25px;
  width: 390px;
}



/*------------------------------------------------------------------
[  ]*/
.login100-form {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.login100-form-title {
  font-family: Montserrat-ExtraBold;
  font-size: 24px;
  color: #fff;
  line-height: 1.2;
  text-align: center;

  width: 100%;
  display: block;
}

/*---------------------------------------------*/
.login100-form-avatar {
    width: 220px;
    height: 100px;
    overflow: hidden;
    display: block;
    margin: 0 auto;
}

.login100-form-avatar img {
  width: 100%;
}


/*---------------------------------------------*/
.wrap-input100 {
  position: relative;
  width: 100%;
  z-index: 1;
}

.input100 {
  font-family: Montserrat-Bold;
  font-size: 15px;
  line-height: 1.2;
  color: #333333;

  display: block;
  width: 100%;
  background: #f2f2f2;
  height: 50px;
  border-radius: 25px;
  padding: 0 30px 0 53px;
}


/*------------------------------------------------------------------
[ Focus ]*/
.focus-input100 {
  display: block;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  box-shadow: 0px 0px 0px 0px;
  color: rgba(0,91,234, 0.6);
}

.input100:focus + .focus-input100 {
  -webkit-animation: anim-shadow 0.5s ease-in-out forwards;
  animation: anim-shadow 0.5s ease-in-out forwards;
}

@-webkit-keyframes anim-shadow {
  to {
    box-shadow: 0px 0px 80px 30px;
    opacity: 0;
  }
}

@keyframes anim-shadow {
  to {
    box-shadow: 0px 0px 80px 30px;
    opacity: 0;
  }
}

.symbol-input100 {
  font-size: 15px;
  color: #999999;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  align-items: center;
  position: absolute;
  border-radius: 25px;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 30px;
  pointer-events: none;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}

.input100:focus + .focus-input100 + .symbol-input100 {
  color: #00c6fb;
  padding-left: 23px;
}


/*------------------------------------------------------------------
[ Button ]*/
.container-login100-form-btn {
  width: 100%;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}





.login100-form-btn {
  font-family: Montserrat-Bold;
  font-size: 15px;
  line-height: 1.5;
  color: #e0e0e0;

  width: 100%;
  height: 50px;
  border-radius: 25px;
  background: #F22613;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 25px;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;

  position: relative;
  z-index: 1;
}





.login100-form-btn::before {
  content: "";
  display: block;
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  border-radius: 25px;
  top: 0;
  left: 0;
  background: #005bea;
  background: -webkit-linear-gradient(left, #005bea, #00c6fb);
  background: -o-linear-gradient(left, #005bea, #00c6fb);
  background: -moz-linear-gradient(left, #005bea, #00c6fb);
  background: linear-gradient(left, #005bea, #00c6fb);
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
  opacity: 0;
}





.login100-form-btn:hover {
  background: transparent;
  color: #fff;
}





.login100-form-btn:hover:before {
  opacity: 1;
}




/*------------------------------------------------------------------
[ Button sign in with ]*/
.btn-face,
.btn-google {
  font-family: Raleway-Bold;
  font-size: 16px;
  line-height: 1.2;

  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc((100% - 10px) / 2);
  height: 40px;
  border-radius: 3px;
  border: 1px solid #e6e6e6;
  background-color: #fff;

  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  -moz-transition: all 0.4s;
  transition: all 0.4s;
}




.btn-face {
  color: #3b5998;
}





.btn-face i {
  font-size: 20px;
  margin-right: 10px;
  padding-bottom: 1px;
}




.btn-google {
  color: #555555;
}



.btn-google img {
  width: 19px;
  margin-right: 10px;
  padding-bottom: 1px;
}





.btn-face:hover,
.btn-google:hover {
  border-color: #d33f8d;
}



/*------------------------------------------------------------------
[ Alert validate ]*/

.validate-input {
  position: relative;
}





.alert-validate::before {
  content: attr(data-validate);
  position: absolute;
  max-width: 70%;
  background-color: white;
  border: 1px solid #c80000;
  border-radius: 14px;
  padding: 4px 25px 4px 10px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 8px;
  pointer-events: none;

  font-family: Montserrat-Bold;
  color: #c80000;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;

  visibility: hidden;
  opacity: 0;

  -webkit-transition: opacity 0.4s;
  -o-transition: opacity 0.4s;
  -moz-transition: opacity 0.4s;
  transition: opacity 0.4s;
}




.alert-validate::after {
  content: "\f06a";
  font-family: FontAwesome;
  display: block;
  position: absolute;
  color: #c80000;
  font-size: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  -moz-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  transform: translateY(-50%);
  right: 13px;
}



.alert-validate:hover:before {
  visibility: visible;
  opacity: 1;
}



@media (max-width: 992px) {
  .alert-validate::before {
    visibility: visible;
    opacity: 1;
  }
}




@media (max-width: 576px) {
  .wrap-login100 {
    padding-top: 80px;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
