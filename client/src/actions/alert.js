import uuid from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (msg, alertType) => dispatch => {
	const id = uuid.v4()
	dispatch({
		// the type corresponds to the alert class in app.css
		type: SET_ALERT,
		payload: { msg, alertType, id }
	})
}
