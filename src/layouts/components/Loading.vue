<template>
<!--=================================
=   Loader sectuibcomment           =
==================================-->
<v-dialog 
   v-model="loading.loading.preloader"
  hide-overlay
  persistent
  width="300">
  <v-card color="red" dark>
    <v-card-text>
     {{loading.loading.message}}
      <v-progress-linear
        indeterminate
        color="white"
        class="mb-0"
      ></v-progress-linear>
    </v-card-text>
  </v-card>
</v-dialog>
<!--====  End of Section comment  ====-->
</template>
<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			dialog: true,
			title: 'Loading Component'
		}
	},
	computed: {
		...mapState({
			loading: 'dialog'
		})
	}
}
</script>