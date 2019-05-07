import { mapGetters } from 'vuex';
export default {
	props:['scanner'],
	data() {
		return {
			results: ''
		}
	},
	created(){

	},
	methods: {
		showQrScanner() {
		   window.QRScanne.show();
		},
		onDecode (result) {
            this.result = result
            this.$store.dispatch('fetchQrcode', result)
        }
	}
}