<template>
<v-app>
     <v-navigation-drawer
      :clipped="$vuetify.breakpoint.smAndUp"
      v-model="drawer"
      permanent
      app
    >
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
         <v-list-tile @click="logout()">
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
     <v-btn icon @click="">
      <v-icon>refresh</v-icon>
    </v-btn>
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
 export default {
    data() {
      return {
        user_name: 'Lionel Francis'
      }
    },
    created() {
      this.user_name = localStorage.getItem('user_name')
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
      logout(){

      }
    }
 }
</script>