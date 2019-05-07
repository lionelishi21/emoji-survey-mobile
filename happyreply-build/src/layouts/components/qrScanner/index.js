import { mapGetters } from 'vuex';
export default {
	props:['scanner'],
	data() {
		return {
			results: ''
		}
	},
	methods: {
		showQrScanner() {
			this.scanner = !this.scanner
		},
		onDecode (result) {
			alert(result)
            this.result = result
            this.$store.dispatch('fetchQrcode', result)
        },
	}
}