import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types'

const initialState = {
	// access jwt token from local storage
	token: localStorage.getItem('token'),
	isAuthenticated: null,
	loading: true,
	user: null
}

export default function(state = initialState) {
	const { type, payload } = action

	switch (type) {
		case REGISTER_SUCCESS:
			// if user has succesfully registered (gotten a token back from api request), set that token to their local storage
			localStorage.setItem('token', action.payload)
			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false
			}
		case REGISTER_FAIL:
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
