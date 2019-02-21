<template>
	<v-navigation-drawer
	   id="app-drawer"
	    app
	    dark
	    floating
	    persistent
	    mobile-break-point="991"
	    width="260"
		permanent
	>
	   <v-img
	      :src="image"
	      height="100%"
	    >
	      <v-layout
	        class="fill-height"
	        tag="v-list"
	        column
          >
            <v-list-tile avatar>
	          <v-list-tile-avatar
	            color="white"
	          >
	            <v-img
	              :src="logo"
	              height="34"
	              contain
	            />
	          </v-list-tile-avatar>
	          <v-list-tile-title class="title">
	            {{user_name}}
	          </v-list-tile-title>
	        </v-list-tile>
	        <v-divider/>

	          <v-list-tile 
	          	 :active-class="color"
                 :to="'/dashboard'"
	             avatar 
	             class="v-list-item"
	             >
	            <v-list-tile-action>
                   <v-icon>dashboard</v-icon>
                </v-list-tile-action>
			    <v-list-tile-title
					v-text="link.main"
			    />
                </v-list-tile>
              <v-list-tile 
                 :active-class="color"
                 :to="'/surveys'"
                 avatar 
                 class="v-list-item"
                 >
	            <v-list-tile-action>
                   <v-icon>rate_review</v-icon>
                </v-list-tile-action>
			    <v-list-tile-title
					v-text="link.sur"
			    />
                </v-list-tile>
               <v-list-tile
               	   :active-class="color"
                   :to="'/response'"
                   avatar 
                   class="v-list-item">
	            <v-list-tile-action>
                   <v-icon>check_circle</v-icon>
                </v-list-tile-action>
			    <v-list-tile-title
					v-text="link.res"
			    />
                </v-list-tile>
                <v-list-tile
                 :active-class="color"
                 :to="'/qrscanner'"
                 avatar
                 class="v-list-item" 
                 @click="">
	            <v-list-tile-action>
                   <v-icon>scanner</v-icon>
                </v-list-tile-action>
			    <v-list-tile-title
					v-text="link.qr"
			    />
                </v-list-tile>
                <v-list-tile avatar class="v-list-item" @click="logout()">
	            <v-list-tile-action>
                   <v-icon>account_circle</v-icon>
                </v-list-tile-action>
			    <v-list-tile-title
					v-text="link.log"
			    />
                </v-list-tile>
	        </v-list-tile>
          </v-layout>
        </v-img>
	</v-navigation-drawer>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			image: '',
			logo: 'static/logo/logo.png',
			user_name: '',
			link: {
				main: 'Dashboad',
				'qr': 'QrScanner',
				'res': 'Responses',
				'sur': 'Surveys',
				'log': 'logout'
			},
			color: 'green',
			dash: 'Dashboad',
			database: 'SurveyDb',
	        version: '1.0',
	        pic_url: 'static/survey-themes/people-image.png',
	        dbDisplay: 'ServeyDatabase',
	        maxSize: 1105535
		}
	},
	created() {
		this.user_name = localStorage.getItem('user_name')
	},
	methods: {
		scanner() {
		   this.$router.push( { name: 'QrcodeScanner'})
		},
		home() {
			this.$router.push( { name: 'Home' })
		},
		response() {
			this.$router.push({ name: 'Response'})
		},
		logout(){
	         var db = openDatabase(this.database, this.version, this.dbDisplay, this.maxSize)
	         this.$store.dispatch('dropDatabase', db)
	         localStorage.removeItem("user_id");
	         localStorage.removeItem("feedback_id");
	         this.$router.push({name: 'Login'});
	         location.reload();
         }
	}
}
</script>
<style lang="scss">
  #app-drawer {
    .v-list__tile {
      border-radius: 4px;
      &--buy {
        margin-top: auto;
        margin-bottom: 17px;
      }
    }
    .v-image__image--contain {
      top: 9px;
      height: 60%;
    }
    .search-input {
      margin-bottom: 30px !important;
      padding-left: 15px;
      padding-right: 15px;
    }
  }
</style>