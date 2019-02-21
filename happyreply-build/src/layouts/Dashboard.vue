<template>
<v-app>
     <v-navigation-drawer
      :clipped="$vuetify.breakpoint.smAndUp"
      v-model="drawer"
      permanent
      app
    >
      <v-dialog v-model="logout" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Logout</v-card-title>
            <v-card-text>Are you sure you want to logout.</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" flat @click="logout = false">Disagree</v-btn>
              <v-btn color="green darken-1" flat @click="logUserOut()">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg" >
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{user_name}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
    <v-list dense>
        <v-list-tile @click="home()">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="response()">
          <v-list-tile-action>
            <v-icon>contact_mail</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Responses</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
         <v-list-tile @click="logout = true">
          <v-list-tile-action>
            <v-icon>power_settings_new</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
  </v-navigation-drawer>
  <v-toolbar color="grey darken-3" 
    fixed 
    dark
    app
     :clipped-left="$vuetify.breakpoint.mdAndUp"
    >
    <v-toolbar-title> <img src="static/logo/logo.png" alt="logo" style="width:200px"></v-toolbar-title>
    <v-spacer></v-spacer>
      <v-badge left>
          <span slot="badge">{{ResponseAmount}}</span>
         <v-icon large color="grey lighten-1">notification_important</v-icon>
      </v-badge>
  </v-toolbar>
  <v-content>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-content>
  <v-footer app></v-footer>
</v-app>
</template>
<script>
 import { mapGetters } from 'vuex';
 export default {
    data() {
      return {
        logout: false,
        response_count: 0,
        dialog: false,
        loading: false,
        user_name: '',
        database: 'SurveyDb',
        version: '1.0',
        dbDisplay: 'ServeyDatabase',
        maxSize: 1105535,
      }
    },
    computed: {
       ...mapGetters([
        'ResponseAmount'
      ]),
    },
    created() {
      this.user_name = localStorage.getItem('user_name')
      var online = navigator.onLine;
      var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
      this.db = db
      var user_id = localStorage.getItem('user_id')
      this.$store.dispatch('getResponses', db)
    },
    methods: {
      refresh(){

      },

      home() {
         this.$router.push({name: 'Home'});
      },
      response(){
         this.$router.push({name: 'Response'});
      },
      setting(){

      },
      logUserOut() {
         var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
         this.$store.dispatch('dropDatabase', db)
         localStorage.removeItem("user_id");
         localStorage.removeItem("feedback_id");
         localStorage.removeItem("user_name");
         this.$router.push({name: 'Login'});
         location.reload();
      },
    }
 }
</script>