<template>

    <div>
        <div class="login-content">

            <!-- Login -->
            <div class="lc-block toggled" id="l-login">
         
                <form class="lcb-form">
                      <div class="alert alert-danger" v-if="error">
                        <p>{{ error }}</p>
                      </div>
                    <div class="form-group">
                        <div class="fg-line">
                            <input type="text" class="form-control" placeholder="Username"  v-model="credentials.email">
                           
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="fg-line">
                            <input type="password" class="form-control" placeholder="Password"   v-model="credentials.password">
                        </div>
                    </div>

                    <div class="checkbox">
                        <label>
                            <input type="checkbox" value="">
                            <i class="input-helper"></i>
                            Keep me signed in
                        </label>
                    </div>

                    <button type="submit" @click.prevent="submit()" href="" class="btn btn-login btn-success"><i class="zmdi zmdi-arrow-forward"></i></button>
                </form>

                <div class="lcb-navigation">
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-register"><i class="zmdi zmdi-plus"></i> <span>Register</span></a>
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-forget-password"><i>?</i> <span>Forgot Password</span></a>
                </div>
            </div>

            <!-- Register -->
            <div class="lc-block" id="l-register">
                <div class="lcb-form">
                    <div class="form-group">
                        <div class="fg-line">
                            <input type="text" class="form-control"  placeholder="email">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="fg-line">
                            <input type="text" class="form-control" placeholder="Email Address">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="fg-line">
                            <input type="password" class="form-control" placeholder="Password">
                        </div>
                    </div>

                    <div class="checkbox">
                        <label>
                            <input type="checkbox" value="">
                            <i class="input-helper"></i>
                            Terms and Condition
                        </label>
                    </div>

                    <a href="" class="btn btn-login btn-success" @click="" ><i class="zmdi zmdi-check"></i></a>
                </div>

                <div class="lcb-navigation">
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-login"><i class="zmdi zmdi-long-arrow-right"></i> <span>Sign in</span></a>
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-forget-password"><i>?</i> <span>Forgot Password</span></a>
                </div>
            </div>

            <!-- Forgot Password -->
            <div class="lc-block" id="l-forget-password">
                <div class="lcb-form">
                    <p class="text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu risus. Curabitur commodo lorem fringilla enim feugiat commodo sed ac lacus.</p>

                    <div class="fg-line">
                        <input type="text" class="form-control" placeholder="Email Address">
                    </div>

                    <a href="" class="btn btn-login btn-success"><i class="zmdi zmdi-check"></i></a>
                </div>

                <div class="lcb-navigation">
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-login"><i class="zmdi zmdi-long-arrow-right"></i> <span>Sign in</span></a>
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-register"><i class="zmdi zmdi-plus"></i> <span>Register</span></a>
                </div>
            </div>
        </div>
        Woekinng
    </div>
</template>
<script>
import VueLadda from 'vue-ladda'
import auth from '../auth/index';

export default {
    components: {
        'vue-ladda': VueLadda
    },
    data() {

        return {
             // We need to initialize the component with any
             // properties that will be used in it
            credentials: {
              email: '',
              password: ''
            },
            error: '',
            loading: false,
            button: {
              loading: false,
              'dataStyle': 'expand-left',
              progress: 0,
            }
        }
    },
    methods: {
          submit() {
             var credentials = {
              email: this.credentials.email,
              password: this.credentials.password
            }
            // We need to pass the component's this context
            // to properly make use of http in the auth service
            auth.login(this, credentials, 'home')
      }
    }
}
</script>
<style>
</style>