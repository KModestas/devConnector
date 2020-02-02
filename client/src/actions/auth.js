import axios from 'axios'
import { setAlert } from './alert'
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types'

// Register User
export const register = ({ name, email, password }) => async dispatch => {
	// set headers
	const config = {
		headers: {
			'Content-Type': 'application/json'
		}
	}

	const body = JSON.stringify({ name, email, password })

	try {
		const res = await axios.post('/api/users', body, config)
		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data
		})
	} catch (err) {
		console.log('HELLOOOO')
		const errors = err.response.data.errors
		// loop over each error and display an alert
		if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))

		dispatch({
			type: REGISTER_FAIL
		})
	}
}
