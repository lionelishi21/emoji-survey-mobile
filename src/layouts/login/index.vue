<template>
  <v-app id="inspire" class="container-login100" style="background-image: url('static/survey-themes/breeze-cotton.jpg');">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            
            <!-- Sanck bar end -->
             <v-snackbar
                :timeout="timeout"
                top
                multi-line
                vertical
                v-model="snackbar"
              >
                <v-btn flat color="pink" @click.native="snackbar = false">Close</v-btn>
              </v-snackbar>
            <!-- Snackbar Ended -->

            <!-- Logo Container -->
            <v-card class="elevation-12">
              <v-card-text>
                  <div align-center justify-center class="logo-container center-lg center-sm center-md">
                     <img src="static/logo/logo.png" alt="Logo" style="width: 200px">
                  </div>
              </v-card-text>
            </v-card>
            <!-- Logo conatiner ended -->

            <!--Comapny sections -->
            <v-card class="elevation-12" v-if="showCompany">
              <v-card-text>
                <v-form >
                  <v-text-field
                    :rules="[rules.required]"
                    v-model="formInputs.email" 
                    prepend-inner-icon="person" 
                    outline 
                    name="login" 
                    label="Email" 
                    type="text">
                  </v-text-field>
                  <v-text-field
                    :rules="[rules.required]"
                     :append-icon="show1 ? 'visibility' : 'visibility_off'"
                     counter
                     v-model="formInputs.password"
                     @click:append="show1 = !show1"
                     hint="At least 8 characters"
                     :type="show1 ? 'text' : 'password'"
                     id="password" outline prepend-inner-icon="lock" 
                     name="password" 
                     label="Password">
                    </v-text-field>
                </v-form>
                <a href="#">Forget Password</a>
                 <!-- <span>Start Over</span> -->
              </v-card-text>
              <v-card-actions>
                <v-btn block round  @click.prevent="submitForm()" color="error" large>Login</v-btn>
              </v-card-actions>
            </v-card>
          <!-- Company End -->

          <v-card v-else class="elevation-12">
              <v-card-text>
                  <v-form >
                    <v-text-field
                      :rules="[rules.required]"
                      v-model="company_url" 
                      prepend-inner-icon="block" 
                      outline
                      name="company" 
                      label="Company" 
                      type="text">
                    </v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn block round @click="saveCompany()" color="error" large>Save</v-btn>
                </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>
<script src="./index.js"></script>
<link href="./index.scss" lang="scss" scoped>