export default {
	data() {
		return {
			scanner: false,
			results: ''
		}
	},
	methods: {
		showQrScanner() {
			this.scanner = !this.scanner
		},
		onDecode (result) {
            this.result = result
            alert(result)
        },
	}
}