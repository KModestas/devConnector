const express = require('express')
const router = express.Router()

const auth = require('../../middleware/auth')
const User = require('../../models/User')

// @route GET api/auth
// @desc Test route
// @acess Public
router.get('/', auth, async (req, res) => {
	try {
		// use user id which was set after jwt.verify() in auth middleware and find user in db
		// select => get all properties except the password
		const user = await User.findById(req.user.id).select('-password')
		// return user data
		res.json(user)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
