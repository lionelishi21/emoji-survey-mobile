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
              <v-btn @click="save()" large class="white--text red">Save</v-btn>
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
        url: '.iledgers.io',
        url2: 'http://'
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
      save () {
        localStorage.setItem("url", this.address)
        localStorage.setItem('company', this.company_url)
        this.logout();
      },
      logout(){
         var self = this
         this.dialog = true
         setTimeout(function(){
           this.dialog = false
           // var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
           // this.$store.dispatch('logoutUser', db)
           // location.reload();
         }, 1000);
      },
    }
  }
</script>