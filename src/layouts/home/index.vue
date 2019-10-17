<template>
	<div>
    
        <!--=====================================
    =           Loader sectuibcomment            =
    ======================================-->
    <v-dialog v-model="loading" persistent fullscreen content-class="loading-dialog">
      <v-container fill-height>
        <v-layout row justify-center align-center>
          <v-progress-circular indeterminate :size="70" :width="7" color="purple"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
    <!--====  End of Section comment  ====-->

    <!--====================================
    =            Section comment            =
    ======================================-->
    <v-container fluid grid-list-lg>
      <v-layout row wrap>
        <v-flex xs4 sm4 md4>
           <v-card color="white" class="grey--text text-md-center card-pretty">
              <v-layout row >
                <v-flex xs12 sm12>
                  <v-card-title primary-title  class="justify-center">
                       <h4 class="headline red--text">
                         {{feedbackInfo.name}}
                       </h4>
                  </v-card-title>
                  <p>Questions: {{QuestionAmount}}</p>
                </v-flex>
              </v-layout>
                <v-layout row >
                  <v-flex xs12>
                  <img :src="'static/emoji/smiling_face_with_glasses.gif'" class="emoji-img nps-size">
                </v-flex>
              </v-layout>
               <v-spacer></v-spacer>
              <v-card-actions class="pa-3">
                 <v-spacer></v-spacer>
                 <v-btn @click="goToSurvey()" large class="white--text red">
                   Select
                </v-btn>
                 <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!--====  End of Section comment  ====-->

    <!--=====================================
    =            Fab comment            =
    ======================================-->
    <v-btn @click="loadSurveys()" color="pink" v-show="loadingBtn" dark bottom fixed right fab >
       <v-icon>refresh</v-icon>
    </v-btn>
    <!--====  End of Section comment  ====-->
</div>
</template>
<script src="./index.js"></script>
<style lang="scss" src="./index.scss" scoped>