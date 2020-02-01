const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route GET api/profile/me
// @desc Get current user profile
// @acess Private
router.get('/me', auth, async (req, res) => {
	try {
		// get user profile and also add name and avatar fields from user schema onto this query (because Profile schema doesnt have  those properties)
		const profile = await Profile.findOne({ user: req.user.id }).populate('user', [
			'name',
			'avatar'
		])
		if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' })
		// send back user profile data to client
		res.json(profile)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
