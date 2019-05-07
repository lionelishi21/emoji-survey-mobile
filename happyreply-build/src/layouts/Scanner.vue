<template>
<v-app>
  <v-container
      fluid
      grid-list-lg
    >
    <v-layout row wrap>
      <v-flex xs12 sm12>
         <v-card>
            <v-list subheader>
              <v-subheader>Check In</v-subheader>
              <v-list-tile
                v-for="item in items"
                :key="item.title"
                avatar
                @click=""
              >
                <v-list-tile-avatar>
                  <img :src="item.avatar">
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-icon :color="item.active ? 'teal' : 'grey'">chat_bubble</v-icon>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <qrcode-scanner></qrcode-scanner>
</v-app>
</template>
<script>
import QrcodeScanner from './components/qrScanner/index.vue'
export default {
	components: {
	   QrcodeScanner
	}
}
</script>