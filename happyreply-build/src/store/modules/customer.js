import api from '../../api'
import {
	LOAD_CUSTMER
} from '../mutation-types.js';

/**
 * ***************************
 * [state description]
 * ***************************
 * @type {Object}
 * ***************************
 */
const state = {
	customers: [],
	alert: {
		modal: false,
		message: '',
	}
}


/**
 * *******************************************
 * [getters description]
 * *******************************************
 * @type {Object}
 */
const getters = {
	allCustomers: state => state.customers,
	customerAlerts: state => state.alert
}

/**
 * *******************************************
 * [actions description]
 * *******************************************
 * @type {Object}
 */
const actions = {

	/**
	 * **********************************************************************
	 * THIS FUNCTION PULL CUSTOMER NAMES
	 * **********************************************************************
	 * @param {[type]} options.commit   [description]
	 * @param {[type]} options.dispatch [description]
	 * @param {[type]} payload          [description]
	 * **********************************************************************
	 */
	FETCH_CUSTOMER ({commit, dispatch}, payload) {
		var db = payload['db']
		var userId = payload['user_id']

		api.getCustomer (userId)
			.then ( response => {
				console.log( response )
				return response.json()
			})
			.then ( response => {
				dispatch('SAVE_CUSTOMER_TO_DATABASE', response)
			})
	},

	/**
	 * *********************************************************************
	 * SAVE CUSTOMER INFROMATION TO DATABASE
	 * *********************************************************************
	 * @param {[type]} options.commit [description]
	 * @param {[type]} payload        [description]
	 * *********************************************************************
	 */
	SAVE_CUSTOMER_TO_DATABASE ({ commit }, payload) {
		var data = payload['response']
		var db   = payload['db']

		for (let key in data) {
			db.transaction ( function (tx){
				var sql = "INSERT INTO customers (id, name,) VALUES (?,?)"
				tx.executeSql(sql, [data[key][id], data[key]['name']])
			}, function(tx, error){
				console.log(tx)
			})
		}
	},

	/**
	 * ***************************************************************************************
	 * [GET_CUSTOMER_SQLITE description]
	 * ***************************************************************************************
	 * @param {[type]} options.commit [description]
	 * @param {[type]} db             [description]
	 */
	GET_CUSTOMER_SQLITE ({commit}, db) {
		db.transaction ( function (tx) {
			tx.executeSql('SELECT * FROM customers;', [], function (tx, results) {
				var len = results.rows.lenght;
				var resultsArray = [];
				for (var i = 0; i < len; i++) {
					var res = { id: results.rows.item(i).id, name: results.row.item(i).name }
					resultsArray.push(res)
				}
				commit ('SET_CUSTOMERS', resultsArray )
				commit ('setAlert', true)
				commit ('setAlertMessage', 'Successfull ad  an attendee')
			})
		})
	},

	/**
	 * This function post qrcode for and event
	 * @param {[type]} {dispatch} emil [description]
	 */
	fetchQrcode({dispatch}, email){
		api.PostQrcode(email)
		.then(response => {
			return response.json()
		})
		.then(response => {
			console(response)
		})
	}
}

/**
 * ***************************************
 * [const description]
 * ***************************************
 * @type {[type]}
 * ***************************************
 */
const  mutations = {
	SET_CUSTOMERS (state, customer) {
		state.customers = customer
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}