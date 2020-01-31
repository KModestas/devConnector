const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtSecret = require('config').get('jwtSecret')
const { check, validationResult } = require('express-validator')

const User = require('../../models/User')

//  middleware to handle errors / validation
const validation = [
	check('name', 'Name is required')
		.not()
		.isEmpty(),
	check('email', 'Please Include a valid email').isEmail(),
	check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
]

// @route POST api/users
// @desc register user
// @acess Public
router.post('/', validation, async (req, res) => {
	const errors = validationResult(req)
	// if there are errors, send back 400 with array of errors
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

	const { name, email, password } = req.body

	try {
		let user = await User.findOne({ email })
		// if user already exists send back error message mimicking same format as express-validator
		if (user) return res.status(400).json({ errors: [{ msg: 'User already exists' }] })
		// get users gravatar
		const avatar = gravatar.url(email, {
			// size
			s: '200',
			// rating pg prevents nudes
			r: 'pg',
			// default image
			d: 'mm'
		})
		// create new instance of user
		user = new User({
			name,
			email,
			password,
			avatar
		})
		// encrypt password
		// salt adds random characters to a hashed password (10 in this case)
		const salt = await bcrypt.genSalt(10)
		user.password = await bcrypt.hash(password, salt)
		// save user to db
		await user.save()
		// mongoose provides id alias to mongodb _id
		const payload = {
			user: {
				id: user.id
			}
		}
		jwt.sign(
			payload,
			jwtSecret,
			// {
			// 	// 1 hour
			// 	expiresIn: 3600
			// },
			(err, token) => {
				if (err) throw err
				res.json({ token })
			}
		)
		// return jwt
		res.send('User registered')
	} catch (err) {
		console.error(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
