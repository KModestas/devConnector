import {
	GET_PROFILE,
	GET_PROFILES,
	GET_REPOS,
	CLEAR_PROFILE,
	PROFILE_ERROR,
	UPDATE_PROFILE
} from '../actions/types'

const initialState = {
	// profile is used to set an individual profile for the current user and any public user you view. Ideally these should be seperate.
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
		/* falls through */
		case UPDATE_PROFILE:
			return {
				...state,
				profile: payload,
				loading: false
			}
		case GET_PROFILES:
			return {
				...state,
				profiles: payload,
				loading: false
			}
		case GET_REPOS:
			return {
				...state,
				repos: payload,
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
				loading: false,
				profile: null
			}
		default:
			return state
	}
}
