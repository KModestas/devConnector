import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'

import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Login from './components/auth/Login'
import Register from './components/auth/Register'

import './App.css'

const App = () => (
	<Provider store={store}>
		<Router>
			<Navbar />
			<Route exact path='/' component={Landing} />
			{/* every page will have a container except landing page for image to fill screen */}
			<section className='container'>
				<Switch>
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
				</Switch>
			</section>
		</Router>
	</Provider>
)

export default App