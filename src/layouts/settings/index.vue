<template>
<v-container>
  <alert-components :alert="dialog"></alert-components>
  <v-layout row>
    <v-flex xs12 sm12>
      <v-card>
        <v-list two-line subheader>
          <v-subheader>General</v-subheader>
          <v-list-tile avatar>
            <v-list-tile-content>
              <v-list-tile-title>Company URL</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
   <v-layout row wrap>
    <v-flex xs12 sm21>
      <v-card>
          <v-card-title>
             {{address}}
          </v-card-title>
         <v-layout row wrap>
           <v-flex xs10 sm10>
              <v-card-title>
              <v-text-field
                v-model="company_url"
                class="pl-3"
                label="Enter Company url here"
                outline
              ></v-text-field>
            </v-card-title>
          </v-flex>
           <v-flex xs2 sm2>
              <v-card-title>
              <v-btn @click="setTenantData()" large class="white--text red">Save</v-btn>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>
<script>
  import alertComponents from './components/alerts.vue'
  export default {
    components: {
      alertComponents
    },
    data () {
      return {
        dialog: false,
        company_url: 'demo',
        notifications: false,
        sound: false,
        video: false,
        invites: false,

        company: '',
        url: '.happyreply.com',
        url2: 'https://'
      }
    },
    created() {
      this.company_url = localStorage.getItem('company')
    },
    computed: {
      address() {
        return this.url2+''+this.company_url+''+this.url
      }
    },
    methods: {
      setTenantData() {
        this.dialog = true
        var self = this
         setTimeout(function() {
            self.dialog = false
            localStorage.setItem("url", self.address)
            localStorage.setItem('company', self.company_url)
            self.logoutUser();
         }, 1000)
      },
      logoutUser(){
         var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
         this.$store.dispatch('logoutUser', db)
         this.$router.push({name: 'Login'});
         location.reload();
      }
    }
  }
</script>