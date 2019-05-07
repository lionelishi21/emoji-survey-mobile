<template>
<v-toolbar
    id="core-toolbar"
    flat
    prominent
    style="background: #eee;"
  >
   <div class="v-toolbar-title">
      <v-toolbar-title
        class="tertiary--text font-weight-light"
      >
       Dashboard
      </v-toolbar-title>
    </div>
    <v-spacer />
    <v-toolbar-items>
      <v-flex
        layout
        py-2
      >
      	<router-link
           v-ripple
           class="toolbar-items"
           to="/"
           >
          <v-icon color="tertiary">dashboard</v-icon>
        </router-link>
         <v-menu
          bottom
          left
          content-class="dropdown-menu"
          offset-y
          transition="slide-y-transition">
          <!-- <router-link
            v-ripple
            slot="activator"
            class="toolbar-items"
            to="/notifications"
          >
            <v-badge
              color="error"
              overlap
            >
              <template slot="badge">
                {{ notifications.length }}
              </template>
              <v-icon color="tertiary">notification_important</v-icon>
            </v-badge>
          </router-link> -->
          <v-card>
            <v-list dense>
              <v-list-tile
                v-for="notification in notifications"
                :key="notification"
                @click="onClick"
              >
                <v-list-tile-title
                  v-text="notification"
                />
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
       <!--  <router-link
          v-ripple
          class="toolbar-items"
          to="/user-profile"
        >
          <v-icon color="tertiary">account_circl</v-icon>
        </router-link> -->
     </v-flex>
    </v-toolbar-items>
 </v-toolbar>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
   data() {
   	return {
   		 notifications: [
	      'Mike, John responded to your email',
	      'You have 5 new tasks',
	      'You\'re now a friend with Andrew',
	      'Another Notification',
	      'Another One'
	    ],
   	}
   }
}
</script>
<style>
  #core-toolbar a {
    text-decoration: none;
  }
</style>