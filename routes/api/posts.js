const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

const createPostValidaton = [
	check('text', 'Text is required')
		.not()
		.isEmpty()
]

// @route POST api/posts
// @desc Create a post
// @acess Private
router.post('/', [auth, createPostValidaton], async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
	try {
		// get all properites of user from db except password
		const user = await User.findById(req.user.id).select('-password')
		// create new Post instance with user properties
		const newPost = new Post({
			// text is the only user generated property in this case
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		})
		const post = await newPost.save()
		res.json(post)
	} catch (err) {
		console.log(err.message)
		res.status(500).send('Server Error')
	}
})

module.exports = router
