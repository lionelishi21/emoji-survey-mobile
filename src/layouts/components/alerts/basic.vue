<template>
   <v-snackbar
      :timeout="timeout"
      :top="y === 'top'"
      :bottom="y === 'bottom'"
      :right="x === 'right'"
      :left="x === 'left'"
      :multi-line="mode === 'multi-line'"
      :vertical="mode === 'vertical'"
      v-model="snackbarAlert.alert"
    >
      {{ snackbarAlert.alert }}
      <v-btn flat color="pink" @click.native="close">Close</v-btn>
    </v-snackbar>
</template>
<script>
import { mapGetters, mapStates } from 'vuex'
export default {
	data(){
		return {
		   timeout: 5000,
		}
	}
	computed: {
		...mapGetters([
			'snackbarAlert',
		]),
	},
	methods: {
		close() {

		}
	}
}
</script>