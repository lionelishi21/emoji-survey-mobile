const state = {
	snackbar: {
		alert: false,
		message: 'Alert'
	},
	loading: {
	    preloader: false,
        message: 'Please stand by'
	}
}

const getters = {
	snackbarAlert: state => state.snackbar
}

const mutations = {

	/**
	 * *****************************************
	 * [setAlert description]
	 * ******************************************
	 * @param {[type]} state [description]
	 * @param {[type]} alert [description]
	 */
	setAlert(state, alert) {
		if (state.snackbar.alert == true) {
		    state.snackbar.alert = false
		}
		state.snackbar.alert = alert
	},

	/**
	 * ******************************************
	 * Set Messages Alert
	 * ******************************************
	 * @param {[type]} state [description]
	 * @param {[type]} mesg  [description]
	 */
	setAlertMessage (state, mesg) {
		state.snackbar.alert = mesg
	},
   
   /**
   * *********************************************
   * Set loading message and preloading
   * *********************************************
   * @param {[type]} state  [description]
   * @param {[type]} params [description]
   * *********************************************
   */
  setLoading( state, params) {
  	console.log(params)
     state.loading.preloader = params['preloader']
     state.loading.message = params['message']
  }
}

export default {
	state,
	getters,
	mutations
}