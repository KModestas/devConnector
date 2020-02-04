import axios from 'axios'
import { setAlert } from './alert'
import { GET_PROFILE, PROFILE_ERROR } from './types'

// current user
export const getCurrentProfile = () => async dispatch => {
	try {
		const res = await axios.get('/api/profile/me')

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			// these come from res.status().send()
			payload: { msg: err.response.statusText, status: err.response.status }
		})
	}
}
