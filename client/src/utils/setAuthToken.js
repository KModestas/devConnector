import axios from 'axios'

// if there is a token, send it with every axios request you make instead of picking and choosing which requests to send it with
const setAuthToken = token => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token
	}

	// else delete axios.defaults.headers.common['x-auth-token']
}

export default setAuthToken
