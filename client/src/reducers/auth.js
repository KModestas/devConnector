import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT
} from '../actions/types'

const initialState = {
	// access jwt token from local storage
	token: localStorage.getItem('token'),
	isAuthenticated: false,
	loading: true,
	user: null
}

export default function(state = initialState, action) {
	const { type, payload } = action

	switch (type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload
			}
		case LOGIN_SUCCESS:
		case REGISTER_SUCCESS:
			// if user has succesfully registered (gotten a token back from api request), set that token to their local storage
			localStorage.setItem('token', payload.token)
			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false
			}
		// multiple cases can return the same result!
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
			// we never want to have an invalid token in local storage
			localStorage.removeItem('token')
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false
			}

		default:
			return state
	}
}
