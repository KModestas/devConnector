import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const CreateProfile = props => {
	const [formData, setFormData] = useState({
		company: '',
		website: '',
		location: '',
		status: '',
		skills: '',
		githubusername: '',
		bio: '',
		twitter: '',
		facebook: '',
		linkedin: '',
		youtube: '',
		instagram: ''
	})

	return <div>YO</div>
}

CreateProfile.propTypes = {}

export default CreateProfile
