const state = {
	snackbar: {
		alert: false,
		message: 'Alert'
	}
}

const getters = {
	snackbarAlert: state => state.snackbar
}

const mutations = {
	setAlert(state, alert) {
		if (state.snackbar.alert == true) {
		    state.snackbar.alert = false
		}
		state.snackbar.alert = alert
	},
	setAlertMessage (state, mesg) {
		state.snackbar.alert = mesg
	}
}

export default {
	state,
	getters,
	mutations
}