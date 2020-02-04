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

// Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json'
			}
		}

		const res = await axios.post('/api/profile', formData, config)

		dispatch({
			type: GET_PROFILE,
			payload: res.data
		})

		// alert different message deoending on if editing or creating a profile
		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

		// if creating a profile, redirect to dashboard once created
		if (!edit) history.push('/dashboard')
	} catch (err) {
		const errors = err.response.data.errors

		// loop over and display error messages in an alert
		if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))

		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		})
	}
}
