import api from '../../api'

const state = {
    mc_responses: {},
    matrix_responses: {},
    range_responses: {},
    comments_responses: {},
    slider_responses: {},
}

const getters = {
	getMcResponse: state => state.mc_responses,
	getMatrixResponse: state => state.matrix_responses,
	getRangeResponse: state => state.range_responses,
	getCommentResponse: state => state.comment_responses,
	getSliderResponse: state => state.slider_responses
}

const action = {

}

const mutations = {
	setMcResponse(state, mc) {

	}
}

export default {
  state,
  getters,
  actions,
  mutations
}


