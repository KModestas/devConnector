import { GET_PROFILE, CLEAR_PROFILE, PROFILE_ERROR, UPDATE_PROFILE } from '../actions/types'

const initialState = {
	profile: null,
	profiles: [],
	repos: [],
	loading: true,
	error: {}
}

export default function(state = initialState, action) {
	const { type, payload } = action
	switch (type) {
		case GET_PROFILE:
		// used for adding experience and education (which are within the profile document)
		case UPDATE_PROFILE:
			return {
				...state,
				profile: payload,
				loading: false
			}
		case CLEAR_PROFILE:
			return {
				...state,
				profile: null,
				repos: [],
				loading: false
			}
		case PROFILE_ERROR:
			return {
				...state,
				error: payload,
				loading: false
			}
		default:
			return state
	}
}
