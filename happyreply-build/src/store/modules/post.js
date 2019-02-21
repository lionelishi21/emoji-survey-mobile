import api from '../../api'

const state = {
    mcResponses: [],
    matrix_responses: {},
    range_responses: {},
    comments_responses: {},
    slider_responses: {},
}

const getters = {
	getMcResponse: state => state.mcResponses,
	getMatrixResponse: state => state.matrix_responses,
	getRangeResponse: state => state.range_responses,
	getCommentResponse: state => state.comment_responses,
	getSliderResponse: state => state.slider_responses
}

const actions = {
	//TODO: Make post response works here
	postResponses (mcArray, matrixArray, sliderArray, rangeArray, commentArray, fbId) {
		// api.postResponses(fbId)
	}
}

const mutations = {
	setMcResponse(state, mc) {
		state.mcResponses = mc
	}
}

export default {
  state,
  getters,
  actions,
  mutations
}


