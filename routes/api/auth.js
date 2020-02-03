const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = require('config').get('jwtSecret')
const { check, validationResult } = require('express-validator')

const auth = require('../../middleware/auth')
const User = require('../../models/User')

// @route GET api/auth
// @desc Get user by token
// @acess Private
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

//  middleware to handle errors / validation
const validation = [
	check('email', 'Please Include a valid email').isEmail(),
	check('password', 'Password is required').exists()
]

// @route POST api/auth
// @desc  login and get token
// @acess Public
router.post('/', validation, async (req, res) => {
	const errors = validationResult(req)
	// if there are errors, send back 400 with array of errors
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

	const { email, password } = req.body

	try {
		let user = await User.findOne({ email })

		const Err400 = () => res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] })

		if (!user) return Err400()

		// compare password user has typed in to the one on the Db
		const passwordMatches = await bcrypt.compare(password, user.password)

		if (!passwordMatches) return Err400()

		// mongoose provides id alias to mongodb _id
		const payload = {
			user: {
				id: user.id
			}
		}
		jwt.sign(
			payload,
			jwtSecret,
			{
				// 1 hour
				expiresIn: '24h'
			},
			(err, token) => {
				if (err) throw err
				res.json({ token })
			}
		)
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
