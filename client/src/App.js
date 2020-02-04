import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

import Alert from './components/layout/Alert'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import PrivateRoute from './components/auth/PrivateRoute'
import Dashboard from './components/dashboard/Dashboard'

import { loadUser } from './actions/auth'

import './App.css'

const App = () => {
	useEffect(() => {
		store.dispatch(loadUser())
	}, [])
	return (
		<Provider store={store}>
			<Router>
				<Navbar />
				<Route exact path='/' component={Landing} />
				{/* every page will have a container except landing page for image to fill screen */}
				<section className='container'>
					<Alert />
					<Switch>
						<Route exact path='/login' component={Login} />
						<Route exact path='/register' component={Register} />
						<PrivateRoute exact path='/dashboard' component={Dashboard} />
					</Switch>
				</section>
			</Router>
		</Provider>
	)
}

export default App
