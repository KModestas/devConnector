import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// destructure component prop and store the rest of the arguments passed in into an array called 'rest' (using spread syntax)
const PrivateRoute = ({ component: Component, isAuthenticated, loading, ...rest }) => {
	return (
		<Route
			// rest contains exact, and path etc
			{...rest}
			// if user not autneticated then redirect to /login else, render the component passed in
			render={props =>
				!isAuthenticated && !loading ? <Redirect to='/login' /> : <Component {...props} />
			}
		/>
	)
}

PrivateRoute.propTypes = {
	auth: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
	isAuthenticated: state.auth.isAuthenticated,
	loading: state.auth.loading
})

export default connect(mapStateToProps)(PrivateRoute)
