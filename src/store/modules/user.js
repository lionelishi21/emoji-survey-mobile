
const actions = {
	logoutUser ({dispatch, commit}, db) {
		
		commit('startLoading', 'Please wait logging user out')
		dispatch('dropDatabase', db)
		localStorage.removeItem("user_id");
        localStorage.removeItem("feedback_id");

         setTimeout(function(){
          	commit('stopLoading')
         }, 1000);
	},
	fetchQrcode({commit}, email) {
	  api.PostQrcode(email)
       .then(response => {
         return response.json()
       }).then(response => {
       	alert('working')
          // dispatch('saveSliderToDataBase', { response, db })
       })
	}
}

export default {
	actions
}